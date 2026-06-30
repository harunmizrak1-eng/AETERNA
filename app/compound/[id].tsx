import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCompoundById } from '../../src/data/compounds';
import { colors, spacing, type, radius, evidenceTierColor, evidenceTierLabel, categoryColor, categoryLabel } from '../../src/theme/tokens';

/**
 * COMPOUND DETAIL — TODO (Claude Code):
 * - "Add to Stack" CTA button (creates StackItem via createStackItem)
 * - Render sources as tappable list (open URL if present)
 * - Reconstitution calculator if vial-based (subq/im route)
 * - "Add personal note" field
 */
export default function CompoundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const compound = getCompoundById(id);

  if (!compound) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textPrimary }}>Bileşik bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.huge }}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color={colors.textSecondary} />
      </Pressable>

      <View style={[styles.categoryBadge, { backgroundColor: categoryColor[compound.category] + '22' }]}>
        <Text style={[styles.categoryBadgeText, { color: categoryColor[compound.category] }]}>
          {categoryLabel[compound.category]}
        </Text>
      </View>

      <Text style={styles.name}>{compound.name}</Text>
      <Text style={styles.tagline}>{compound.tagline}</Text>

      <View style={[styles.tierPill, { borderColor: evidenceTierColor[compound.evidenceTier] }]}>
        <View style={[styles.tierDot, { backgroundColor: evidenceTierColor[compound.evidenceTier] }]} />
        <Text style={[styles.tierText, { color: evidenceTierColor[compound.evidenceTier] }]}>
          {evidenceTierLabel[compound.evidenceTier]}
        </Text>
      </View>

      <Section title="Mekanizma" body={compound.mechanism} />
      <Section title="Kanıt Özeti" body={compound.evidenceSummary} />

      <View style={styles.doseGrid}>
        <DoseStat label="Doz Aralığı" value={compound.typicalDoseRange} />
        <DoseStat label="Sıklık" value={compound.typicalFrequency} />
        <DoseStat label="Uygulama" value={compound.administrationRoute} />
        {compound.halfLife && <DoseStat label="Yarı Ömür" value={compound.halfLife} />}
      </View>

      {compound.cautionNotes && (
        <View style={styles.cautionBox}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
          <Text style={styles.cautionText}>{compound.cautionNotes}</Text>
        </View>
      )}

      <View style={styles.sourcesBlock}>
        <Text style={styles.sectionTitle}>Kaynaklar</Text>
        {compound.sources.map((s, idx) => (
          <Text key={idx} style={styles.sourceItem}>· {s.label} — {s.detail}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

function DoseStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.doseStat}>
      <Text style={styles.doseLabel}>{label}</Text>
      <Text style={styles.doseValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl },
  backBtn: { marginTop: spacing.huge, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, marginTop: spacing.lg },
  categoryBadgeText: { ...type.micro, textTransform: 'uppercase' },
  name: { ...type.display, fontSize: 36, color: colors.textPrimary, marginTop: spacing.md },
  tagline: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  tierPill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.lg },
  tierDot: { width: 6, height: 6, borderRadius: 3 },
  tierText: { ...type.captionMedium },
  sectionTitle: { ...type.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionBody: { ...type.body, color: colors.textSecondary, lineHeight: 23 },
  doseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl },
  doseStat: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minWidth: '45%', flexGrow: 1 },
  doseLabel: { ...type.micro, color: colors.textTertiary, textTransform: 'uppercase' },
  doseValue: { ...type.bodyMedium, color: colors.textPrimary, marginTop: spacing.xs },
  cautionBox: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xl, alignItems: 'flex-start' },
  cautionText: { ...type.caption, color: colors.textPrimary, flex: 1, lineHeight: 18 },
  sourcesBlock: { marginTop: spacing.xl },
  sourceItem: { ...type.caption, color: colors.textTertiary, marginTop: spacing.xs },
});
