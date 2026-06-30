import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPost, toTurkishErrorMessage } from '../../src/lib/communityRepository';
import { compoundLibrary } from '../../src/data/compounds';
import { colors, spacing, type, radius } from '../../src/theme/tokens';

export default function CreatePostScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [relatedCompoundId, setRelatedCompoundId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Galeri erişim izni gerekli.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (!imageUri) {
      setError('Bir fotoğraf seç.');
      return;
    }
    setError(null);
    setPosting(true);
    try {
      await createPost({
        imageUri,
        caption: caption.trim() || undefined,
        relatedCompoundId: relatedCompoundId ?? undefined,
        weekNumber: weekNumber.trim() ? parseInt(weekNumber, 10) : undefined,
      });
      router.back();
    } catch (e) {
      setError(toTurkishErrorMessage(e));
    } finally {
      setPosting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.huge }}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <Text style={styles.title}>Yeni paylaşım</Text>

      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={28} color={colors.textTertiary} />
            <Text style={styles.imagePlaceholderText}>Fotoğraf seç</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Açıklama</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          value={caption}
          onChangeText={setCaption}
          placeholder="Paylaşımın hakkında yaz…"
          placeholderTextColor={colors.textTertiary}
          multiline
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>İlgili bileşik (opsiyonel)</Text>
        <View style={styles.chipWrap}>
          {compoundLibrary.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, relatedCompoundId === c.id && styles.chipSelected]}
              onPress={() => setRelatedCompoundId(relatedCompoundId === c.id ? null : c.id)}
            >
              <Text style={[styles.chipText, relatedCompoundId === c.id && styles.chipTextSelected]}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Hafta (opsiyonel)</Text>
        <TextInput
          style={[styles.input, { width: 100 }]}
          value={weekNumber}
          onChangeText={setWeekNumber}
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable style={[styles.submitBtn, posting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={posting}>
        <Text style={styles.submitBtnText}>{posting ? 'Paylaşılıyor…' : 'Paylaş'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl },
  backBtn: { marginTop: spacing.huge, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { ...type.h1, color: colors.textPrimary, marginTop: spacing.md },
  imagePicker: { marginTop: spacing.xl, borderRadius: radius.lg, overflow: 'hidden' },
  previewImage: { width: '100%', height: 280, backgroundColor: colors.bgElevated },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imagePlaceholderText: { ...type.caption, color: colors.textTertiary },
  field: { marginTop: spacing.xxl },
  fieldLabel: { ...type.h3, color: colors.textPrimary, marginBottom: spacing.md },
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
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  chipSelected: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  chipText: { ...type.captionMedium, color: colors.textSecondary },
  chipTextSelected: { color: colors.gold },
  errorText: { ...type.caption, color: colors.danger, marginTop: spacing.xl },
  submitBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center', marginTop: spacing.xxl },
  submitBtnText: { ...type.bodyMedium, color: colors.bg, fontWeight: '700' },
});
