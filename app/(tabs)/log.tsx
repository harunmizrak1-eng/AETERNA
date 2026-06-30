import { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getDailyMetric, upsertDailyMetric } from '../../src/db/metricsRepository';
import { DailyMetric } from '../../src/types/models';
import { colors, spacing, type, radius } from '../../src/theme/tokens';

/**
 * LOG TAB — TODO (Claude Code):
 * - Today's full metric entry form (weight, sleep, mood, energy — see DailyMetric type)
 * - Dose log timeline for today (from listDoseLogsForDateRange)
 * - Quick "mark as taken" for today's scheduled doses
 * - Weekly chart view (use react-native-svg or victory-native)
 * - Link to blood panel entry
 */

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LogScreen() {
  const [existing, setExisting] = useState<DailyMetric | null>(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [waterMl, setWaterMl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getDailyMetric(todayIso()).then((metric) => {
        if (cancelled) return;
        setExisting(metric);
        setCaloriesConsumed(metric?.caloriesConsumed?.toString() ?? '');
        setCaloriesBurned(metric?.caloriesBurned?.toString() ?? '');
        setWaterMl(metric?.waterMl?.toString() ?? '');
      });
      return () => { cancelled = true; };
    }, [])
  );

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const parsed = (v: string) => (v.trim() === '' ? undefined : parseFloat(v.replace(',', '.')));
      const saved = await upsertDailyMetric({
        date: todayIso(),
        weightKg: existing?.weightKg,
        sleepHours: existing?.sleepHours,
        sleepQuality: existing?.sleepQuality,
        whoopRecovery: existing?.whoopRecovery,
        whoopDeepSleepMin: existing?.whoopDeepSleepMin,
        energyLevel: existing?.energyLevel,
        mood: existing?.mood,
        caloriesConsumed: parsed(caloriesConsumed),
        caloriesBurned: parsed(caloriesBurned),
        waterMl: parsed(waterMl),
        notes: existing?.notes,
      });
      setExisting(saved);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günlük</Text>
      <Text style={styles.subtitle}>Bugünkü veriler ve doz takibi</Text>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Alınan kalori</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={caloriesConsumed}
            onChangeText={(v) => { setCaloriesConsumed(v); setSaved(false); }}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
          <Text style={styles.unit}>kcal</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Yakılan kalori</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={caloriesBurned}
            onChangeText={(v) => { setCaloriesBurned(v); setSaved(false); }}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
          <Text style={styles.unit}>kcal</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Su tüketimi</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={waterMl}
            onChangeText={(v) => { setWaterMl(v); setSaved(false); }}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />
          <Text style={styles.unit}>ml</Text>
        </View>
      </View>

      <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor…' : saved ? 'Kaydedildi' : 'Kaydet'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl, paddingTop: spacing.huge },
  title: { ...type.display, color: colors.textPrimary },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  field: { marginTop: spacing.xxl },
  fieldLabel: { ...type.h3, color: colors.textPrimary, marginBottom: spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  input: {
    ...type.numeric,
    flex: 1,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  unit: { ...type.bodyMedium, color: colors.textTertiary },
  saveBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  saveBtnText: { ...type.bodyMedium, color: colors.bg, fontWeight: '700' },
});
