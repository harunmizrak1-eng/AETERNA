import { getDb } from './client';
import { DailyMetric } from '../types/models';

function rowToMetric(row: any): DailyMetric {
  return {
    id: row.id,
    date: row.date,
    weightKg: row.weight_kg ?? undefined,
    sleepHours: row.sleep_hours ?? undefined,
    sleepQuality: row.sleep_quality ?? undefined,
    whoopRecovery: row.whoop_recovery ?? undefined,
    whoopDeepSleepMin: row.whoop_deep_sleep_min ?? undefined,
    energyLevel: row.energy_level ?? undefined,
    mood: row.mood ?? undefined,
    notes: row.notes ?? undefined,
  };
}

/** Upsert by date — one metric row per day, re-saving the same day updates it. */
export async function upsertDailyMetric(metric: Omit<DailyMetric, 'id'>): Promise<DailyMetric> {
  const db = await getDb();
  const existing = await db.getFirstAsync(
    'SELECT id FROM daily_metrics WHERE date = ?',
    [metric.date]
  ) as { id: string } | null;

  const id = existing?.id ?? `metric_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await db.runAsync(
    `INSERT INTO daily_metrics
      (id, date, weight_kg, sleep_hours, sleep_quality, whoop_recovery, whoop_deep_sleep_min, energy_level, mood, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       weight_kg = excluded.weight_kg,
       sleep_hours = excluded.sleep_hours,
       sleep_quality = excluded.sleep_quality,
       whoop_recovery = excluded.whoop_recovery,
       whoop_deep_sleep_min = excluded.whoop_deep_sleep_min,
       energy_level = excluded.energy_level,
       mood = excluded.mood,
       notes = excluded.notes`,
    [
      id,
      metric.date,
      metric.weightKg ?? null,
      metric.sleepHours ?? null,
      metric.sleepQuality ?? null,
      metric.whoopRecovery ?? null,
      metric.whoopDeepSleepMin ?? null,
      metric.energyLevel ?? null,
      metric.mood ?? null,
      metric.notes ?? null,
    ]
  );

  return { ...metric, id };
}

export async function getDailyMetric(date: string): Promise<DailyMetric | null> {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT * FROM daily_metrics WHERE date = ?', [date]);
  return row ? rowToMetric(row) : null;
}

export async function listDailyMetrics(startIso: string, endIso: string): Promise<DailyMetric[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM daily_metrics WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [startIso, endIso]
  );
  return rows.map(rowToMetric);
}

export async function listRecentMetrics(limit = 30): Promise<DailyMetric[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM daily_metrics ORDER BY date DESC LIMIT ?',
    [limit]
  );
  return rows.map(rowToMetric).reverse();
}
