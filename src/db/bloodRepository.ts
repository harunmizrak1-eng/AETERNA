import { getDb } from './client';
import { BloodPanel, BloodMarker } from '../types/models';

export async function createBloodPanel(
  panel: Omit<BloodPanel, 'id' | 'markers'>,
  markers: Omit<BloodMarker, 'id'>[] = []
): Promise<BloodPanel> {
  const db = await getDb();
  const panelId = `panel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  await db.runAsync(
    'INSERT INTO blood_panels (id, date, lab_name, notes) VALUES (?, ?, ?, ?)',
    [panelId, panel.date, panel.labName ?? null, panel.notes ?? null]
  );

  const savedMarkers: BloodMarker[] = [];
  for (const m of markers) {
    const markerId = `marker_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await db.runAsync(
      `INSERT INTO blood_markers (id, panel_id, key, label, value, unit, ref_range_low, ref_range_high)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [markerId, panelId, m.key, m.label, m.value, m.unit, m.refRangeLow ?? null, m.refRangeHigh ?? null]
    );
    savedMarkers.push({ ...m });
  }

  return { ...panel, id: panelId, markers: savedMarkers };
}

export async function listBloodPanels(): Promise<BloodPanel[]> {
  const db = await getDb();
  const panelRows = await db.getAllAsync('SELECT * FROM blood_panels ORDER BY date DESC') as any[];

  const panels: BloodPanel[] = [];
  for (const row of panelRows) {
    const markerRows = await db.getAllAsync(
      'SELECT * FROM blood_markers WHERE panel_id = ?',
      [row.id]
    ) as any[];

    panels.push({
      id: row.id,
      date: row.date,
      labName: row.lab_name ?? undefined,
      notes: row.notes ?? undefined,
      markers: markerRows.map((m) => ({
        key: m.key,
        label: m.label,
        value: m.value,
        unit: m.unit,
        refRangeLow: m.ref_range_low ?? undefined,
        refRangeHigh: m.ref_range_high ?? undefined,
      })),
    });
  }

  return panels;
}

/** History of a single marker across all panels — for trend charts */
export async function getMarkerHistory(markerKey: string): Promise<{ date: string; value: number; unit: string }[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT bp.date as date, bm.value as value, bm.unit as unit
     FROM blood_markers bm
     JOIN blood_panels bp ON bm.panel_id = bp.id
     WHERE bm.key = ?
     ORDER BY bp.date ASC`,
    [markerKey]
  ) as any[];
  return rows.map((r) => ({ date: r.date, value: r.value, unit: r.unit }));
}
