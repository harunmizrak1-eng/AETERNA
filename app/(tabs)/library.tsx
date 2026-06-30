import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { compoundLibrary } from '../../src/data/compounds';
import { colors, spacing, type, radius, categoryColor, categoryLabel, evidenceTierColor, evidenceTierLabel } from '../../src/theme/tokens';

/**
 * LIBRARY TAB — TODO (Claude Code):
 * - Search bar (filter by name)
 * - Category filter chips (metabolic, growth, repair, longevity, cognitive, aesthetic)
 * - Evidence tier filter
 * - Better card design with category color accent
 */
export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kütüphane</Text>
      <Text style={styles.subtitle}>{compoundLibrary.length} bileşik</Text>

      <FlatList
        data={compoundLibrary}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.md, paddingBottom: spacing.huge }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/compound/${item.id}`)}
          >
            <View style={[styles.categoryDot, { backgroundColor: categoryColor[item.category] }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardTagline} numberOfLines={1}>{item.tagline}</Text>
              <View style={styles.metaRow}>
                <Text style={[styles.tierBadge, { color: evidenceTierColor[item.evidenceTier] }]}>
                  {evidenceTierLabel[item.evidenceTier]}
                </Text>
                <Text style={styles.categoryText}>{categoryLabel[item.category]}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  title: { ...type.display, color: colors.textPrimary },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'flex-start',
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  cardTitle: { ...type.h3, color: colors.textPrimary },
  cardTagline: { ...type.caption, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  tierBadge: { ...type.micro, textTransform: 'uppercase' },
  categoryText: { ...type.micro, color: colors.textTertiary, textTransform: 'uppercase' },
});
