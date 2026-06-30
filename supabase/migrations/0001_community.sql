-- ÆTERNA — Community module schema.
-- Run once against a new Supabase project: paste into the SQL Editor in the
-- Supabase dashboard, or `supabase db push` if you've linked the project
-- with the Supabase CLI. This is the only part of the app backed by a
-- remote database — see AGENTS.md "Phase 1 — Community".

-- ── profiles ─────────────────────────────────────────────────────────────
-- auth.users isn't queryable from the client, so we mirror a display name
-- here (set at sign-up) purely so the feed/comments can show who posted.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by any authenticated user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── blocked_users ────────────────────────────────────────────────────────
-- Defined before community_posts/comments so their RLS policies can
-- reference it.

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_user_id uuid not null references auth.users (id) on delete cascade,
  blocked_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_user_id, blocked_user_id),
  check (blocker_user_id <> blocked_user_id)
);

alter table public.blocked_users enable row level security;

create policy "users manage their own block list"
  on public.blocked_users for all
  to authenticated
  using (blocker_user_id = auth.uid())
  with check (blocker_user_id = auth.uid());

-- ── community_posts ──────────────────────────────────────────────────────

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  caption text,
  related_compound_id text, -- references the static compound id in src/data/compounds.ts, not a DB table
  week_number integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_posts_created_at on public.community_posts (created_at desc);
create index if not exists idx_community_posts_user on public.community_posts (user_id);

alter table public.community_posts enable row level security;

create policy "posts are readable, excluding blocked authors"
  on public.community_posts for select
  to authenticated
  using (
    not exists (
      select 1 from public.blocked_users b
      where b.blocker_user_id = auth.uid() and b.blocked_user_id = community_posts.user_id
    )
  );

create policy "users can create their own posts"
  on public.community_posts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can update their own posts"
  on public.community_posts for update
  to authenticated
  using (user_id = auth.uid());

create policy "users can delete their own posts"
  on public.community_posts for delete
  to authenticated
  using (user_id = auth.uid());

-- ── comments ─────────────────────────────────────────────────────────────

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_post on public.comments (post_id, created_at);

alter table public.comments enable row level security;

create policy "comments are readable, excluding blocked authors"
  on public.comments for select
  to authenticated
  using (
    not exists (
      select 1 from public.blocked_users b
      where b.blocker_user_id = auth.uid() and b.blocked_user_id = comments.user_id
    )
  );

create policy "users can create their own comments"
  on public.comments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can delete their own comments"
  on public.comments for delete
  to authenticated
  using (user_id = auth.uid());

-- ── reports ──────────────────────────────────────────────────────────────
-- Write-only from the client by design — there's no in-app moderation
-- queue (see AGENTS.md "Phase 1 — Community"). Reports are reviewed
-- directly in the Supabase dashboard with the service role, which bypasses
-- RLS, so no SELECT policy is needed here.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  reporter_user_id uuid not null references auth.users (id) on delete cascade,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);

alter table public.reports enable row level security;

create policy "users can file reports"
  on public.reports for insert
  to authenticated
  with check (reporter_user_id = auth.uid());

-- ── Storage: community-images bucket ────────────────────────────────────
-- Public read (feed images load without signed URLs); writes restricted to
-- each user's own folder, keyed by their uid as the first path segment
-- (the app uploads to `${userId}/${filename}`).

insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do nothing;

create policy "community images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'community-images');

create policy "users upload images to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete their own images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'community-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
