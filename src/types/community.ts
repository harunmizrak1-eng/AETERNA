/** Community module domain types — backed by Supabase, not local SQLite. */

export interface Profile {
  id: string;
  displayName: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorDisplayName: string;
  imageUrl: string;
  caption: string | null;
  relatedCompoundId: string | null;
  weekNumber: number | null;
  createdAt: string;
  commentCount: number;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
}

export type ReportTarget = { postId: string; commentId?: undefined } | { postId?: undefined; commentId: string };
