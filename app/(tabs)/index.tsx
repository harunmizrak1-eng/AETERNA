import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { listStackItems } from '../../src/db/stackRepository';
import { getCompoundById } from '../../src/data/compounds';
import { StackItem } from '../../src/types/models';
import { colors, spacing, type, radius } from '../../src/theme/tokens';

/**
 * STACK TAB — TODO (Claude Code):
 * - Replace placeholder rows with real StackItemCard component
 *   (compound name, dose, next dose time, quick-log button)
 * - Add empty state with CTA to add first compound
 * - Add "+" header button → navigate to add-stack-item flow
 * - Swipe-to-log-dose gesture
 * - Group by time-of-day (morning/evening) or by category
 */
export default function StackScreen() {
  const [items, setItems] = useState<StackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      listStackItems(true)
        .then((rows) => { if (!cancelled) setItems(rows); })
        .finally(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stack</Text>
      <Text style={styles.subtitle}>Aktif protokolün</Text>

      {!loading && items.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz aktif bileşik yok.</Text>
          <Text style={styles.emptyHint}>Kütüphaneden bir bileşik seçip stack'ine ekle.</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.md }}
        renderItem={({ item }) => {
          const compound = getCompoundById(item.compoundId);
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{compound?.name ?? item.customName ?? 'Bilinmeyen'}</Text>
              <Text style={styles.cardMeta}>
                {item.doseAmount} {item.doseUnit} · {item.route}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  title: { ...type.display, color: colors.textPrimary },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  emptyState: { marginTop: spacing.huge, alignItems: 'center', gap: spacing.sm },
  emptyText: { ...type.h3, color: colors.textSecondary },
  emptyHint: { ...type.caption, color: colors.textTertiary, textAlign: 'center' },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardTitle: { ...type.h3, color: colors.textPrimary },
  cardMeta: { ...type.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
