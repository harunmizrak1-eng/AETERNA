import { useCallback, useState } from 'react';
import { View, Text, Image, FlatList, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPost, listComments, addComment, reportContent, blockUser, toTurkishErrorMessage } from '../../../src/lib/communityRepository';
import { CommunityComment, CommunityPost } from '../../../src/types/community';
import { getCompoundById } from '../../../src/data/compounds';
import { colors, spacing, type, radius } from '../../../src/theme/tokens';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getPost(id), listComments(id)])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
      })
      .catch((e) => setError(toTurkishErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleAddComment() {
    if (!id || !commentBody.trim()) return;
    setPosting(true);
    try {
      const created = await addComment(id, commentBody.trim());
      setComments((prev) => [...prev, created]);
      setCommentBody('');
    } catch (e) {
      setError(toTurkishErrorMessage(e));
    } finally {
      setPosting(false);
    }
  }

  async function handleReportComment(commentId: string) {
    await reportContent({ commentId }, 'inappropriate').catch(() => {});
  }

  async function handleReportPost() {
    if (!post) return;
    await reportContent({ postId: post.id }, 'inappropriate').catch(() => {});
  }

  async function handleBlock() {
    if (!post) return;
    await blockUser(post.userId).catch(() => {});
    router.back();
  }

  if (loading && !post) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textPrimary }}>Paylaşım bulunamadı.</Text>
      </View>
    );
  }

  const compound = post.relatedCompoundId ? getCompoundById(post.relatedCompoundId) : undefined;

  return (
    <FlatList
      style={styles.container}
      data={comments}
      keyExtractor={(c) => c.id}
      ListHeaderComponent={
        <View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
          </Pressable>

          <Image source={{ uri: post.imageUrl }} style={styles.image} />

          <View style={{ paddingHorizontal: spacing.xl }}>
            <Text style={styles.author}>{post.authorDisplayName}</Text>
            {post.caption && <Text style={styles.caption}>{post.caption}</Text>}
            <View style={styles.metaRow}>
              {compound && <Text style={styles.metaBadge}>{compound.name}</Text>}
              {post.weekNumber != null && <Text style={styles.metaBadge}>{post.weekNumber}. hafta</Text>}
            </View>

            <View style={styles.actionRow}>
              <Pressable onPress={handleReportPost}>
                <Text style={styles.actionText}>Şikayet et</Text>
              </Pressable>
              <Pressable onPress={handleBlock}>
                <Text style={styles.actionText}>Kullanıcıyı engelle</Text>
              </Pressable>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.commentsTitle}>Yorumlar ({comments.length})</Text>
          </View>
        </View>
      }
      contentContainerStyle={{ paddingBottom: spacing.huge }}
      renderItem={({ item }) => (
        <View style={styles.commentRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.commentAuthor}>{item.authorDisplayName}</Text>
            <Text style={styles.commentBody}>{item.body}</Text>
          </View>
          <Pressable onPress={() => handleReportComment(item.id)}>
            <Text style={styles.commentReport}>Şikayet et</Text>
          </Pressable>
        </View>
      )}
      ListFooterComponent={
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            value={commentBody}
            onChangeText={setCommentBody}
            placeholder="Yorum yaz…"
            placeholderTextColor={colors.textTertiary}
          />
          <Pressable style={[styles.sendBtn, posting && { opacity: 0.6 }]} onPress={handleAddComment} disabled={posting}>
            <Ionicons name="send" size={16} color={colors.bg} />
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  backBtn: { marginTop: spacing.huge, marginLeft: spacing.xl, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 320, backgroundColor: colors.bgElevated, marginTop: spacing.md },
  author: { ...type.h2, color: colors.textPrimary, marginTop: spacing.lg },
  caption: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  metaBadge: {
    ...type.micro,
    color: colors.gold,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  actionRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  actionText: { ...type.caption, color: colors.textTertiary },
  errorText: { ...type.caption, color: colors.danger, marginTop: spacing.md },
  commentsTitle: { ...type.h3, color: colors.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.md },
  commentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  commentAuthor: { ...type.captionMedium, color: colors.textPrimary },
  commentBody: { ...type.body, color: colors.textSecondary, marginTop: 2 },
  commentReport: { ...type.micro, color: colors.textTertiary },
  commentInputRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, alignItems: 'center' },
  commentInput: {
    ...type.body,
    flex: 1,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sendBtn: { width: 36, height: 36, borderRadius: radius.pill, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
});
