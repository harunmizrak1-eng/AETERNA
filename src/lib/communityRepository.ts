import { supabase } from './supabaseClient';
import { CommunityComment, CommunityPost, ReportTarget } from '../types/community';

function requireClient() {
  if (!supabase) throw new Error('Supabase yapılandırılmamış (.env eksik).');
  return supabase;
}

/** Best-effort Turkish translation for the handful of errors users actually hit. */
export function toTurkishErrorMessage(e: unknown): string {
  const message = e instanceof Error ? e.message : '';
  if (/failed to fetch|network request failed/i.test(message)) {
    return 'Bağlantı kurulamadı. İnternetini kontrol et.';
  }
  if (/invalid login credentials/i.test(message)) {
    return 'E-posta veya şifre hatalı.';
  }
  if (/user already registered/i.test(message)) {
    return 'Bu e-posta zaten kayıtlı.';
  }
  return message || 'Bir hata oluştu.';
}

// ── Auth ─────────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, displayName: string) {
  const client = requireClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

// ── Posts ────────────────────────────────────────────────────────────────

// community_posts.user_id / comments.user_id reference auth.users, not
// public.profiles, so PostgREST has no FK to walk for a `profiles(...)`
// embed (confirmed against the live project: PGRST200 "no relationship
// between community_posts and profiles"). Fetch display names separately
// and merge client-side instead of relying on embedding.
type PostRow = {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  related_compound_id: string | null;
  week_number: number | null;
  created_at: string;
  comments: { count: number }[];
};

function rowToPost(row: PostRow, names: Map<string, string>): CommunityPost {
  return {
    id: row.id,
    userId: row.user_id,
    authorDisplayName: names.get(row.user_id) ?? 'Kullanıcı',
    imageUrl: row.image_url,
    caption: row.caption,
    relatedCompoundId: row.related_compound_id,
    weekNumber: row.week_number,
    createdAt: row.created_at,
    commentCount: row.comments?.[0]?.count ?? 0,
  };
}

async function fetchDisplayNames(userIds: string[]): Promise<Map<string, string>> {
  const client = requireClient();
  const uniqueIds = [...new Set(userIds)];
  if (uniqueIds.length === 0) return new Map();
  const { data, error } = await client.from('profiles').select('id, display_name').in('id', uniqueIds);
  if (error) throw error;
  return new Map((data ?? []).map((p: { id: string; display_name: string }) => [p.id, p.display_name]));
}

const POST_COLUMNS = 'id, user_id, image_url, caption, related_compound_id, week_number, created_at, comments(count)';

export async function listPosts(): Promise<CommunityPost[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('community_posts')
    .select(POST_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as PostRow[];
  const names = await fetchDisplayNames(rows.map((r) => r.user_id));
  return rows.map((row) => rowToPost(row, names));
}

export async function getPost(id: string): Promise<CommunityPost> {
  const client = requireClient();
  const { data, error } = await client.from('community_posts').select(POST_COLUMNS).eq('id', id).single();
  if (error) throw error;
  const row = data as unknown as PostRow;
  const names = await fetchDisplayNames([row.user_id]);
  return rowToPost(row, names);
}

export async function createPost(params: {
  imageUri: string;
  caption?: string;
  relatedCompoundId?: string;
  weekNumber?: number;
}): Promise<CommunityPost> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Oturum açılmamış.');

  const extMatch = /\.(\w+)$/.exec(params.imageUri.split('?')[0]);
  const ext = extMatch?.[1]?.toLowerCase() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const response = await fetch(params.imageUri);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  const { error: uploadError } = await client.storage
    .from('community-images')
    .upload(path, arrayBuffer, { contentType });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = client.storage.from('community-images').getPublicUrl(path);

  const { data, error } = await client
    .from('community_posts')
    .insert({
      user_id: userId,
      image_url: publicUrlData.publicUrl,
      caption: params.caption ?? null,
      related_compound_id: params.relatedCompoundId ?? null,
      week_number: params.weekNumber ?? null,
    })
    .select(POST_COLUMNS)
    .single();
  if (error) throw error;
  const row = data as unknown as PostRow;
  const names = await fetchDisplayNames([row.user_id]);
  return rowToPost(row, names);
}

// ── Comments ─────────────────────────────────────────────────────────────

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

function rowToComment(row: CommentRow, names: Map<string, string>): CommunityComment {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    authorDisplayName: names.get(row.user_id) ?? 'Kullanıcı',
    body: row.body,
    createdAt: row.created_at,
  };
}

const COMMENT_COLUMNS = 'id, post_id, user_id, body, created_at';

export async function listComments(postId: string): Promise<CommunityComment[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('comments')
    .select(COMMENT_COLUMNS)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as unknown as CommentRow[];
  const names = await fetchDisplayNames(rows.map((r) => r.user_id));
  return rows.map((row) => rowToComment(row, names));
}

export async function addComment(postId: string, body: string): Promise<CommunityComment> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Oturum açılmamış.');

  const { data, error } = await client
    .from('comments')
    .insert({ post_id: postId, user_id: userId, body })
    .select(COMMENT_COLUMNS)
    .single();
  if (error) throw error;
  const row = data as unknown as CommentRow;
  const names = await fetchDisplayNames([row.user_id]);
  return rowToComment(row, names);
}

// ── Reports & blocking ──────────────────────────────────────────────────

export async function reportContent(target: ReportTarget, reason: string): Promise<void> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Oturum açılmamış.');

  const { error } = await client.from('reports').insert({
    post_id: target.postId ?? null,
    comment_id: target.commentId ?? null,
    reporter_user_id: userId,
    reason,
  });
  if (error) throw error;
}

export async function blockUser(blockedUserId: string): Promise<void> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('Oturum açılmamış.');

  const { error } = await client
    .from('blocked_users')
    .insert({ blocker_user_id: userId, blocked_user_id: blockedUserId });
  if (error) throw error;
}
