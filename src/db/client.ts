import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync('aeterna.db');
  await migrate(dbInstance);
  return dbInstance;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS stack_items (
      id TEXT PRIMARY KEY NOT NULL,
      compound_id TEXT NOT NULL,
      custom_name TEXT,
      dose_amount REAL NOT NULL,
      dose_unit TEXT NOT NULL,
      frequency_json TEXT NOT NULL,
      route TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      vial_concentration REAL,
      vial_volume REAL,
      remaining_doses REAL,
      notes TEXT,
      reminder_enabled INTEGER NOT NULL DEFAULT 0,
      reminder_times_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dose_logs (
      id TEXT PRIMARY KEY NOT NULL,
      stack_item_id TEXT NOT NULL,
      taken_at TEXT NOT NULL,
      dose_amount REAL NOT NULL,
      dose_unit TEXT NOT NULL,
      injection_site TEXT,
      skipped INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      FOREIGN KEY (stack_item_id) REFERENCES stack_items(id)
    );

    CREATE TABLE IF NOT EXISTS daily_metrics (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL UNIQUE,
      weight_kg REAL,
      sleep_hours REAL,
      sleep_quality INTEGER,
      whoop_recovery INTEGER,
      whoop_deep_sleep_min INTEGER,
      energy_level INTEGER,
      mood INTEGER,
      calories_consumed REAL,
      calories_burned REAL,
      water_ml REAL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS blood_panels (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      lab_name TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS blood_markers (
      id TEXT PRIMARY KEY NOT NULL,
      panel_id TEXT NOT NULL,
      key TEXT NOT NULL,
      label TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT NOT NULL,
      ref_range_low REAL,
      ref_range_high REAL,
      FOREIGN KEY (panel_id) REFERENCES blood_panels(id)
    );

    CREATE INDEX IF NOT EXISTS idx_dose_logs_item ON dose_logs(stack_item_id);
    CREATE INDEX IF NOT EXISTS idx_dose_logs_date ON dose_logs(taken_at);
    CREATE INDEX IF NOT EXISTS idx_blood_markers_panel ON blood_markers(panel_id);
  `);

  // daily_metrics gained calorie/water columns after the initial CREATE TABLE
  // shipped — ALTER TABLE them in for installs that already have the table.
  for (const column of ['calories_consumed REAL', 'calories_burned REAL', 'water_ml REAL']) {
    try {
      await db.execAsync(`ALTER TABLE daily_metrics ADD COLUMN ${column}`);
    } catch {
      // column already exists
    }
  }
}
