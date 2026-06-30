import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, type } from '../../src/theme/tokens';

/**
 * PROFILE TAB — TODO (Claude Code):
 * - Basic profile info (name, optional)
 * - Settings: reminder defaults, units (mg vs mcg), theme
 * - Data export (CSV/PDF of logs)
 * - Blood panel history list → link to add new panel
 * - About / evidence-tier framework explainer (transparency builds trust)
 */
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  title: { ...type.display, color: colors.textPrimary },
});
