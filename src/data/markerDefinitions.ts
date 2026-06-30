/**
 * Reference ranges for common longevity/performance biomarkers.
 *
 * IMPORTANT: `optimalLow/High` reflects ranges commonly discussed in the
 * longevity literature (Attia, InsideTracker-style optimal bands) — NOT a
 * medical diagnosis tool. Always render with a disclaimer in the UI:
 * "Referans aralık bilgilendirme amaçlıdır, tanı koymaz."
 */
export interface MarkerDefinition {
  key: string;
  label: string;
  unit: string;
  labLow?: number;
  labHigh?: number;
  optimalLow?: number;
  optimalHigh?: number;
  category: 'metabolic' | 'lipid' | 'hormone' | 'liver' | 'inflammation' | 'thyroid' | 'other';
}

export const markerDefinitions: MarkerDefinition[] = [
  { key: 'glucose_fasting', label: 'Açlık Glukoz', unit: 'mg/dL', labLow: 70, labHigh: 100, optimalLow: 75, optimalHigh: 90, category: 'metabolic' },
  { key: 'hba1c', label: 'HbA1c', unit: '%', labLow: 4.0, labHigh: 5.6, optimalLow: 4.5, optimalHigh: 5.2, category: 'metabolic' },
  { key: 'apob', label: 'ApoB', unit: 'mg/dL', labHigh: 100, optimalHigh: 80, category: 'lipid' },
  { key: 'ldl', label: 'LDL Kolesterol', unit: 'mg/dL', labHigh: 130, optimalHigh: 100, category: 'lipid' },
  { key: 'hdl', label: 'HDL Kolesterol', unit: 'mg/dL', labLow: 40, optimalLow: 55, category: 'lipid' },
  { key: 'triglycerides', label: 'Trigliserit', unit: 'mg/dL', labHigh: 150, optimalHigh: 80, category: 'lipid' },
  { key: 'testosterone_total', label: 'Total Testosteron', unit: 'ng/dL', labLow: 264, labHigh: 916, category: 'hormone' },
  { key: 'testosterone_free', label: 'Serbest Testosteron', unit: 'pg/mL', labLow: 8.7, labHigh: 25.1, category: 'hormone' },
  { key: 'estradiol', label: 'Estradiol', unit: 'pg/mL', labLow: 10, labHigh: 40, category: 'hormone' },
  { key: 'shbg', label: 'SHBG', unit: 'nmol/L', labLow: 10, labHigh: 57, category: 'hormone' },
  { key: 'igf1', label: 'IGF-1', unit: 'ng/mL', labLow: 88, labHigh: 209, category: 'hormone' },
  { key: 'alt', label: 'ALT', unit: 'U/L', labLow: 7, labHigh: 56, optimalHigh: 30, category: 'liver' },
  { key: 'ast', label: 'AST', unit: 'U/L', labLow: 10, labHigh: 40, optimalHigh: 25, category: 'liver' },
  { key: 'tsh', label: 'TSH', unit: 'mIU/L', labLow: 0.4, labHigh: 4.0, optimalLow: 1.0, optimalHigh: 2.5, category: 'thyroid' },
  { key: 'hscrp', label: 'hsCRP', unit: 'mg/L', labHigh: 3.0, optimalHigh: 1.0, category: 'inflammation' },
  { key: 'vitamin_d', label: 'Vitamin D (25-OH)', unit: 'ng/mL', labLow: 30, labHigh: 100, optimalLow: 40, optimalHigh: 60, category: 'other' },
  { key: 'resting_hr', label: 'Dinlenik Nabız', unit: 'bpm', optimalLow: 45, optimalHigh: 65, category: 'other' },
  { key: 'hrv', label: 'HRV', unit: 'ms', category: 'other' },
];

export const getMarkerDefinition = (key: string) => markerDefinitions.find((m) => m.key === key);
