import { getDb } from './client';
import { StackItem, DoseLog, FrequencyRule, AdministrationRoute, InjectionSite } from '../types/models';

function rowToStackItem(row: any): StackItem {
  return {
    id: row.id,
    compoundId: row.compound_id,
    customName: row.custom_name ?? undefined,
    doseAmount: row.dose_amount,
    doseUnit: row.dose_unit,
    frequency: JSON.parse(row.frequency_json),
    route: row.route,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    active: !!row.active,
    vialConcentration: row.vial_concentration ?? undefined,
    vialVolume: row.vial_volume ?? undefined,
    remainingDoses: row.remaining_doses ?? undefined,
    notes: row.notes ?? undefined,
    reminderEnabled: !!row.reminder_enabled,
    reminderTimes: JSON.parse(row.reminder_times_json ?? '[]'),
  };
}

export async function listStackItems(activeOnly = true): Promise<StackItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    activeOnly ? 'SELECT * FROM stack_items WHERE active = 1 ORDER BY created_at DESC'
               : 'SELECT * FROM stack_items ORDER BY created_at DESC'
  );
  return rows.map(rowToStackItem);
}

export async function getStackItem(id: string): Promise<StackItem | null> {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT * FROM stack_items WHERE id = ?', [id]);
  return row ? rowToStackItem(row) : null;
}

export async function createStackItem(item: Omit<StackItem, 'id'>): Promise<StackItem> {
  const db = await getDb();
  const id = `stack_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.runAsync(
    `INSERT INTO stack_items
      (id, compound_id, custom_name, dose_amount, dose_unit, frequency_json, route,
       start_date, end_date, active, vial_concentration, vial_volume, remaining_doses,
       notes, reminder_enabled, reminder_times_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      item.compoundId,
      item.customName ?? null,
      item.doseAmount,
      item.doseUnit,
      JSON.stringify(item.frequency),
      item.route,
      item.startDate,
      item.endDate ?? null,
      item.active ? 1 : 0,
      item.vialConcentration ?? null,
      item.vialVolume ?? null,
      item.remainingDoses ?? null,
      item.notes ?? null,
      item.reminderEnabled ? 1 : 0,
      JSON.stringify(item.reminderTimes ?? []),
    ]
  );
  return { ...item, id };
}

export async function updateStackItem(id: string, patch: Partial<StackItem>): Promise<void> {
  const db = await getDb();
  const existing = await getStackItem(id);
  if (!existing) throw new Error('Stack item not found');
  const merged = { ...existing, ...patch };
  await db.runAsync(
    `UPDATE stack_items SET
      compound_id = ?, custom_name = ?, dose_amount = ?, dose_unit = ?, frequency_json = ?,
      route = ?, start_date = ?, end_date = ?, active = ?, vial_concentration = ?,
      vial_volume = ?, remaining_doses = ?, notes = ?, reminder_enabled = ?, reminder_times_json = ?
     WHERE id = ?`,
    [
      merged.compoundId,
      merged.customName ?? null,
      merged.doseAmount,
      merged.doseUnit,
      JSON.stringify(merged.frequency),
      merged.route,
      merged.startDate,
      merged.endDate ?? null,
      merged.active ? 1 : 0,
      merged.vialConcentration ?? null,
      merged.vialVolume ?? null,
      merged.remainingDoses ?? null,
      merged.notes ?? null,
      merged.reminderEnabled ? 1 : 0,
      JSON.stringify(merged.reminderTimes ?? []),
      id,
    ]
  );
}

export async function deleteStackItem(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM stack_items WHERE id = ?', [id]);
  await db.runAsync('DELETE FROM dose_logs WHERE stack_item_id = ?', [id]);
}

// ── Dose logs ────────────────────────────────────────────────────────────

function rowToDoseLog(row: any): DoseLog {
  return {
    id: row.id,
    stackItemId: row.stack_item_id,
    takenAt: row.taken_at,
    doseAmount: row.dose_amount,
    doseUnit: row.dose_unit,
    injectionSite: row.injection_site ?? undefined,
    skipped: !!row.skipped,
    notes: row.notes ?? undefined,
  };
}

export async function logDose(log: Omit<DoseLog, 'id'>): Promise<DoseLog> {
  const db = await getDb();
  const id = `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.runAsync(
    `INSERT INTO dose_logs (id, stack_item_id, taken_at, dose_amount, dose_unit, injection_site, skipped, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      log.stackItemId,
      log.takenAt,
      log.doseAmount,
      log.doseUnit,
      log.injectionSite ?? null,
      log.skipped ? 1 : 0,
      log.notes ?? null,
    ]
  );

  // Decrement remaining dose count if tracked
  const item = await getStackItem(log.stackItemId);
  if (item?.remainingDoses != null && !log.skipped) {
    await updateStackItem(item.id, { remainingDoses: Math.max(0, item.remainingDoses - 1) });
  }

  return { ...log, id };
}

export async function listDoseLogsForItem(stackItemId: string, limit = 50): Promise<DoseLog[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM dose_logs WHERE stack_item_id = ? ORDER BY taken_at DESC LIMIT ?',
    [stackItemId, limit]
  );
  return rows.map(rowToDoseLog);
}

export async function listDoseLogsForDateRange(startIso: string, endIso: string): Promise<DoseLog[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT * FROM dose_logs WHERE taken_at >= ? AND taken_at <= ? ORDER BY taken_at DESC',
    [startIso, endIso]
  );
  return rows.map(rowToDoseLog);
}

export async function getLastInjectionSiteForItem(stackItemId: string): Promise<InjectionSite | null> {
  const db = await getDb();
  const row = await db.getFirstAsync(
    `SELECT injection_site FROM dose_logs
     WHERE stack_item_id = ? AND injection_site IS NOT NULL
     ORDER BY taken_at DESC LIMIT 1`,
    [stackItemId]
  );
  return (row as any)?.injection_site ?? null;
}
