import { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { isSupabaseConfigured } from '../../src/lib/supabaseClient';
import { useSession } from '../../src/lib/useSession';
import { signIn, signUp, signOut, listPosts, reportContent, blockUser, toTurkishErrorMessage } from '../../src/lib/communityRepository';
import { CommunityPost } from '../../src/types/community';
import { getCompoundById } from '../../src/data/compounds';
import { colors, spacing, type, radius } from '../../src/theme/tokens';

export default function CommunityScreen() {
  if (!isSupabaseConfigured) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Topluluk</Text>
        <View style={styles.notConfigured}>
          <Ionicons name="cloud-offline-outline" size={28} color={colors.textTertiary} />
          <Text style={styles.notConfiguredText}>
            Topluluk modülü yapılandırılmamış. .env dosyasına EXPO_PUBLIC_SUPABASE_URL ve
            EXPO_PUBLIC_SUPABASE_ANON_KEY ekle.
          </Text>
        </View>
      </View>
    );
  }

  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return <Feed />;
}

function AuthForm() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!email || !password || (mode === 'signUp' && !displayName)) {
      setError('Tüm alanları doldur.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signUp') {
        await signUp(email, password, displayName);
      } else {
        await signIn(email, password);
      }
    } catch (e) {
      setError(toTurkishErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Topluluk</Text>
      <Text style={styles.subtitle}>{mode === 'signIn' ? 'Giriş yap' : 'Hesap oluştur'}</Text>

      <View style={styles.authForm}>
        {mode === 'signUp' && (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Kullanıcı adı"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
          />
        )}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          placeholderTextColor={colors.textTertiary}
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable style={[styles.primaryBtn, busy && { opacity: 0.6 }]} onPress={handleSubmit} disabled={busy}>
          <Text style={styles.primaryBtnText}>
            {busy ? 'Bekleyin…' : mode === 'signIn' ? 'Giriş yap' : 'Hesap oluştur'}
          </Text>
        </Pressable>

        <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          <Text style={styles.switchModeText}>
            {mode === 'signIn' ? 'Hesabın yok mu? Kayıt ol.' : 'Zaten hesabın var mı? Giriş yap.'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Feed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    listPosts()
      .then(setPosts)
      .catch((e) => setError(toTurkishErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleReportPost(postId: string) {
    try {
      await reportContent({ postId }, 'inappropriate');
    } catch {
      // best-effort; no UI feedback needed beyond not crashing
    }
  }

  async function handleBlock(userId: string) {
    await blockUser(userId).catch(() => {});
    load();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Topluluk</Text>
          <Text style={styles.subtitle}>ÆTERNA topluluğundan paylaşımlar</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Pressable style={styles.iconBtn} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.addBtn} onPress={() => router.push('/community/create')}>
            <Ionicons name="add" size={24} color={colors.bg} />
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && posts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz paylaşım yok.</Text>
          <Text style={styles.emptyHint}>İlk paylaşımı sen yap.</Text>
        </View>
      )}

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.lg, paddingBottom: spacing.huge }}
        onRefresh={load}
        refreshing={loading}
        renderItem={({ item }) => {
          const compound = item.relatedCompoundId ? getCompoundById(item.relatedCompoundId) : undefined;
          return (
            <Pressable style={styles.card} onPress={() => router.push(`/community/post/${item.id}`)}>
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardAuthor}>{item.authorDisplayName}</Text>
                {item.caption && <Text style={styles.cardCaption}>{item.caption}</Text>}
                <View style={styles.metaRow}>
                  {compound && <Text style={styles.metaBadge}>{compound.name}</Text>}
                  {item.weekNumber != null && <Text style={styles.metaBadge}>{item.weekNumber}. hafta</Text>}
                  <Text style={styles.metaText}>{item.commentCount} yorum</Text>
                </View>
                <View style={styles.actionRow}>
                  <Pressable onPress={() => handleReportPost(item.id)}>
                    <Text style={styles.actionText}>Şikayet et</Text>
                  </Pressable>
                  <Pressable onPress={() => handleBlock(item.userId)}>
                    <Text style={styles.actionText}>Kullanıcıyı engelle</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { ...type.display, color: colors.textPrimary },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  addBtn: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },

  notConfigured: { marginTop: spacing.huge, alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  notConfiguredText: { ...type.body, color: colors.textTertiary, textAlign: 'center' },

  authForm: { marginTop: spacing.xxl, gap: spacing.md },
  input: {
    ...type.body,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center', marginTop: spacing.sm },
  primaryBtnText: { ...type.bodyMedium, color: colors.bg, fontWeight: '700' },
  switchModeText: { ...type.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  errorText: { ...type.caption, color: colors.danger, marginTop: spacing.xs },

  emptyState: { marginTop: spacing.huge, alignItems: 'center', gap: spacing.sm },
  emptyText: { ...type.h3, color: colors.textSecondary },
  emptyHint: { ...type.caption, color: colors.textTertiary, textAlign: 'center' },

  card: { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardImage: { width: '100%', height: 220, backgroundColor: colors.bgElevated },
  cardBody: { padding: spacing.lg },
  cardAuthor: { ...type.bodyMedium, color: colors.textPrimary },
  cardCaption: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'center' },
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
  metaText: { ...type.caption, color: colors.textTertiary },
  actionRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  actionText: { ...type.caption, color: colors.textTertiary },
});
