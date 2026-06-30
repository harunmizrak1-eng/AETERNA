import { ReactNode, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getCompoundById } from '../../../src/data/compounds';
import { createStackItem } from '../../../src/db/stackRepository';
import { AdministrationRoute, FrequencyRule, StackItem } from '../../../src/types/models';
import { colors, spacing, type, radius, categoryColor, categoryLabel } from '../../../src/theme/tokens';

type DoseUnit = StackItem['doseUnit'];
type FrequencyType = FrequencyRule['type'];

const DOSE_UNITS: DoseUnit[] = ['mg', 'mcg', 'iu', 'ml'];

const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Her gün' },
  { value: 'everyNDays', label: 'X günde bir' },
  { value: 'weekly', label: 'Haftanın günleri' },
  { value: 'asNeeded', label: 'Gerektiğinde' },
];

const ROUTE_OPTIONS: { value: AdministrationRoute; label: string }[] = [
  { value: 'subq', label: 'Subkutan' },
  { value: 'im', label: 'Kas içi (IM)' },
  { value: 'oral', label: 'Oral' },
  { value: 'nasal', label: 'Nazal' },
  { value: 'sublingual', label: 'Dil altı' },
  { value: 'topical', label: 'Topikal' },
];

// FrequencyRule.weekly days follow JS Date#getDay (0=Sun..6=Sat); displayed Monday-first.
const WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Pzt' },
  { value: 2, label: 'Sal' },
  { value: 3, label: 'Çar' },
  { value: 4, label: 'Per' },
  { value: 5, label: 'Cum' },
  { value: 6, label: 'Cmt' },
  { value: 0, label: 'Paz' },
];

const REMINDER_PRESETS = ['08:00', '12:00', '18:00', '22:00'];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function AddToStackScreen() {
  const { compoundId } = useLocalSearchParams<{ compoundId: string }>();
  const compound = getCompoundById(compoundId);

  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState<DoseUnit>('mg');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [everyNDays, setEveryNDays] = useState('2');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([]);
  const [route, setRoute] = useState<AdministrationRoute>('subq');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [customHour, setCustomHour] = useState('');
  const [customMinute, setCustomMinute] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const frequency: FrequencyRule = useMemo(() => {
    switch (frequencyType) {
      case 'everyNDays':
        return { type: 'everyNDays', n: Math.max(1, parseInt(everyNDays, 10) || 1) };
      case 'weekly':
        return { type: 'weekly', days: weeklyDays };
      case 'asNeeded':
        return { type: 'asNeeded' };
      default:
        return { type: 'daily' };
    }
  }, [frequencyType, everyNDays, weeklyDays]);

  if (!compound) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textPrimary }}>Bileşik bulunamadı.</Text>
      </View>
    );
  }

  function toggleWeeklyDay(day: number) {
    Haptics.selectionAsync();
    setWeeklyDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  function addReminderTime(time: string) {
    if (reminderTimes.includes(time)) return;
    Haptics.selectionAsync();
    setReminderTimes((prev) => [...prev, time].sort());
  }

  function removeReminderTime(time: string) {
    Haptics.selectionAsync();
    setReminderTimes((prev) => prev.filter((t) => t !== time));
  }

  function addCustomReminderTime() {
    const h = parseInt(customHour, 10);
    const m = parseInt(customMinute, 10);
    if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      setError('Geçerli bir saat gir (00–23 / 00–59).');
      return;
    }
    addReminderTime(`${pad2(h)}:${pad2(m)}`);
    setCustomHour('');
    setCustomMinute('');
  }

  function validate(): string | null {
    const amount = parseFloat(doseAmount.replace(',', '.'));
    if (!doseAmount || Number.isNaN(amount) || amount <= 0) {
      return 'Doz miktarı girilmeli.';
    }
    if (frequencyType === 'weekly' && weeklyDays.length === 0) {
      return 'En az bir gün seçilmeli.';
    }
    if (reminderEnabled && reminderTimes.length === 0) {
      return 'Hatırlatıcı açıksa en az bir saat eklenmeli.';
    }
    return null;
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createStackItem({
        compoundId: compound!.id,
        doseAmount: parseFloat(doseAmount.replace(',', '.')),
        doseUnit,
        frequency,
        route,
        startDate: todayIso(),
        active: true,
        reminderEnabled,
        reminderTimes: reminderEnabled ? reminderTimes : [],
      });
      router.dismissTo('/');
    } catch (e) {
      setError('Kaydedilemedi, tekrar dene.');
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.huge }}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </Pressable>

      <View style={[styles.categoryBadge, { backgroundColor: categoryColor[compound.category] + '22' }]}>
        <Text style={[styles.categoryBadgeText, { color: categoryColor[compound.category] }]}>
          {categoryLabel[compound.category]}
        </Text>
      </View>
      <Text style={styles.heading}>Stack'e ekle</Text>
      <Text style={styles.compoundName}>{compound.name}</Text>
      <Text style={styles.compoundTagline}>{compound.tagline}</Text>
      <Text style={styles.referenceHint}>
        Referans doz: {compound.typicalDoseRange} · {compound.typicalFrequency}
      </Text>

      <Field label="Doz">
        <View style={styles.doseRow}>
          <TextInput
            style={styles.doseInput}
            value={doseAmount}
            onChangeText={setDoseAmount}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
          />
          <View style={styles.unitChips}>
            {DOSE_UNITS.map((u) => (
              <Chip key={u} label={u} selected={doseUnit === u} onPress={() => setDoseUnit(u)} />
            ))}
          </View>
        </View>
      </Field>

      <Field label="Sıklık">
        <View style={styles.chipWrap}>
          {FREQUENCY_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={frequencyType === opt.value}
              onPress={() => setFrequencyType(opt.value)}
            />
          ))}
        </View>

        {frequencyType === 'everyNDays' && (
          <View style={styles.inlineRow}>
            <Text style={styles.inlineLabel}>Her</Text>
            <TextInput
              style={styles.smallInput}
              value={everyNDays}
              onChangeText={setEveryNDays}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.inlineLabel}>günde bir</Text>
          </View>
        )}

        {frequencyType === 'weekly' && (
          <View style={[styles.chipWrap, { marginTop: spacing.sm }]}>
            {WEEKDAYS.map((d) => (
              <Chip
                key={d.value}
                label={d.label}
                selected={weeklyDays.includes(d.value)}
                onPress={() => toggleWeeklyDay(d.value)}
              />
            ))}
          </View>
        )}
      </Field>

      <Field label="Uygulama Yolu">
        <View style={styles.chipWrap}>
          {ROUTE_OPTIONS.map((opt) => (
            <Chip key={opt.value} label={opt.label} selected={route === opt.value} onPress={() => setRoute(opt.value)} />
          ))}
        </View>
      </Field>

      <Field label="Hatırlatıcılar">
        <View style={styles.reminderToggleRow}>
          <Text style={styles.reminderToggleLabel}>Bildirim ile hatırlat</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: colors.border, true: colors.goldMuted }}
            thumbColor={reminderEnabled ? colors.gold : colors.textTertiary}
          />
        </View>

        {reminderEnabled && (
          <>
            {reminderTimes.length > 0 && (
              <View style={[styles.chipWrap, { marginTop: spacing.md }]}>
                {reminderTimes.map((t) => (
                  <Pressable key={t} style={styles.timeChip} onPress={() => removeReminderTime(t)}>
                    <Text style={styles.timeChipText}>{t}</Text>
                    <Ionicons name="close" size={13} color={colors.gold} />
                  </Pressable>
                ))}
              </View>
            )}

            <View style={[styles.chipWrap, { marginTop: spacing.md }]}>
              {REMINDER_PRESETS.filter((p) => !reminderTimes.includes(p)).map((p) => (
                <Chip key={p} label={p} selected={false} onPress={() => addReminderTime(p)} />
              ))}
            </View>

            <View style={styles.inlineRow}>
              <TextInput
                style={styles.smallInput}
                value={customHour}
                onChangeText={setCustomHour}
                placeholder="SS"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.inlineLabel}>:</Text>
              <TextInput
                style={styles.smallInput}
                value={customMinute}
                onChangeText={setCustomMinute}
                placeholder="DD"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Pressable style={styles.addTimeBtn} onPress={addCustomReminderTime}>
                <Ionicons name="add" size={16} color={colors.bg} />
                <Text style={styles.addTimeBtnText}>Saat ekle</Text>
              </Pressable>
            </View>
          </>
        )}
      </Field>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor…' : "Stack'e ekle"}</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.xl },
  backBtn: { marginTop: spacing.huge, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, marginTop: spacing.lg },
  categoryBadgeText: { ...type.micro, textTransform: 'uppercase' },
  heading: { ...type.caption, color: colors.textTertiary, textTransform: 'uppercase', marginTop: spacing.lg },
  compoundName: { ...type.h1, color: colors.textPrimary, marginTop: spacing.xs },
  compoundTagline: { ...type.body, color: colors.textSecondary, marginTop: spacing.xs },
  referenceHint: { ...type.caption, color: colors.textTertiary, marginTop: spacing.sm },

  field: { marginTop: spacing.xxl },
  fieldLabel: { ...type.h3, color: colors.textPrimary, marginBottom: spacing.md },

  doseRow: { gap: spacing.md },
  doseInput: {
    ...type.numeric,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  unitChips: { flexDirection: 'row', gap: spacing.sm },

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

  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  inlineLabel: { ...type.body, color: colors.textSecondary },
  smallInput: {
    ...type.bodyMedium,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 48,
    textAlign: 'center',
  },

  reminderToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reminderToggleLabel: { ...type.body, color: colors.textPrimary },

  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  timeChipText: { ...type.captionMedium, color: colors.gold },

  addTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
  addTimeBtnText: { ...type.captionMedium, color: colors.bg },

  errorText: { ...type.caption, color: colors.danger, marginTop: spacing.xl },

  saveBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  saveBtnText: { ...type.bodyMedium, color: colors.bg, fontWeight: '700' },
});
