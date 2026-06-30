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

type PostRow = {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  related_compound_id: string | null;
  week_number: number | null;
  created_at: string;
  profiles: { display_name: string } | null;
  comments: { count: number }[];
};

function rowToPost(row: PostRow): CommunityPost {
  return {
    id: row.id,
    userId: row.user_id,
    authorDisplayName: row.profiles?.display_name ?? 'Kullanıcı',
    imageUrl: row.image_url,
    caption: row.caption,
    relatedCompoundId: row.related_compound_id,
    weekNumber: row.week_number,
    createdAt: row.created_at,
    commentCount: row.comments?.[0]?.count ?? 0,
  };
}

export async function listPosts(): Promise<CommunityPost[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('community_posts')
    .select('id, user_id, image_url, caption, related_compound_id, week_number, created_at, profiles(display_name), comments(count)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PostRow[]).map(rowToPost);
}

export async function getPost(id: string): Promise<CommunityPost> {
  const client = requireClient();
  const { data, error } = await client
    .from('community_posts')
    .select('id, user_id, image_url, caption, related_compound_id, week_number, created_at, profiles(display_name), comments(count)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return rowToPost(data as unknown as PostRow);
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
    .select('id, user_id, image_url, caption, related_compound_id, week_number, created_at, profiles(display_name), comments(count)')
    .single();
  if (error) throw error;
  return rowToPost(data as unknown as PostRow);
}

// ── Comments ─────────────────────────────────────────────────────────────

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string } | null;
};

function rowToComment(row: CommentRow): CommunityComment {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    authorDisplayName: row.profiles?.display_name ?? 'Kullanıcı',
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function listComments(postId: string): Promise<CommunityComment[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('comments')
    .select('id, post_id, user_id, body, created_at, profiles(display_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as CommentRow[]).map(rowToComment);
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
    .select('id, post_id, user_id, body, created_at, profiles(display_name)')
    .single();
  if (error) throw error;
  return rowToComment(data as unknown as CommentRow);
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
