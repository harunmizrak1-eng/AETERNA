import { CompoundCategory, EvidenceTier } from '../theme/tokens';

/** A reference compound in the knowledge library (peptide, hormone, etc.) */
export interface Compound {
  id: string;
  name: string;
  shortName?: string;
  category: CompoundCategory;
  tagline: string;
  mechanism: string;
  evidenceTier: EvidenceTier;
  evidenceSummary: string;
  typicalDoseRange: string;
  typicalFrequency: string;
  administrationRoute: string;
  halfLife?: string;
  timeToEffect?: string;
  sources: SourceRef[];
  cautionNotes?: string;
}

export interface SourceRef {
  label: string;
  detail: string; // e.g. "TRIUMPH-1, Faz 3, Mayıs 2026"
  url?: string;
}

/** A compound the user has added to their active stack */
export interface StackItem {
  id: string;
  compoundId: string;
  customName?: string;
  doseAmount: number;
  doseUnit: 'mg' | 'mcg' | 'iu' | 'ml';
  frequency: FrequencyRule;
  route: AdministrationRoute;
  startDate: string; // ISO date
  endDate?: string;
  active: boolean;
  vialConcentration?: number; // mg/ml — for reconstitution calc
  vialVolume?: number; // total ml in vial
  remainingDoses?: number;
  notes?: string;
  reminderEnabled: boolean;
  reminderTimes: string[]; // ["08:00", "20:00"]
}

export type AdministrationRoute = 'subq' | 'im' | 'oral' | 'nasal' | 'topical' | 'sublingual';

export type FrequencyRule =
  | { type: 'daily' }
  | { type: 'everyNDays'; n: number }
  | { type: 'weekly'; days: number[] } // 0=Sun..6=Sat
  | { type: 'asNeeded' };

/** A single logged dose event */
export interface DoseLog {
  id: string;
  stackItemId: string;
  takenAt: string; // ISO datetime
  doseAmount: number;
  doseUnit: string;
  injectionSite?: InjectionSite;
  skipped: boolean;
  notes?: string;
}

export type InjectionSite =
  | 'abdomen_l' | 'abdomen_r'
  | 'thigh_l' | 'thigh_r'
  | 'glute_l' | 'glute_r'
  | 'delt_l' | 'delt_r';

/** Biometric/wellness daily entry */
export interface DailyMetric {
  id: string;
  date: string; // ISO date
  weightKg?: number;
  sleepHours?: number;
  sleepQuality?: number; // 1-10
  whoopRecovery?: number; // 0-100
  whoopDeepSleepMin?: number;
  energyLevel?: number; // 1-10
  mood?: number; // 1-10
  caloriesConsumed?: number;
  caloriesBurned?: number;
  waterMl?: number;
  notes?: string;
}

/** Blood panel entry — supports arbitrary markers */
export interface BloodPanel {
  id: string;
  date: string;
  labName?: string;
  markers: BloodMarker[];
  notes?: string;
}

export interface BloodMarker {
  key: string; // e.g. "igf1", "hba1c", "hscrp", "testosterone_total"
  label: string;
  value: number;
  unit: string;
  refRangeLow?: number;
  refRangeHigh?: number;
}

/** Educational content article */
export interface Article {
  id: string;
  title: string;
  category: 'longevity' | 'biohacking' | 'peptide-science' | 'protocol';
  summary: string;
  bodyMarkdown: string;
  relatedCompoundIds: string[];
  evidenceTier: EvidenceTier;
  publishedAt: string;
  readMinutes: number;
}
