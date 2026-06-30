import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, type } from '../../src/theme/tokens';

/**
 * LOG TAB — TODO (Claude Code):
 * - Today's metric entry form (weight, sleep, mood, energy — see DailyMetric type)
 * - Dose log timeline for today (from listDoseLogsForDateRange)
 * - Quick "mark as taken" for today's scheduled doses
 * - Weekly chart view (use react-native-svg or victory-native)
 * - Link to blood panel entry
 */
export default function LogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günlük</Text>
      <Text style={styles.subtitle}>Bugünkü veriler ve doz takibi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  title: { ...type.display, color: colors.textPrimary },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
});
