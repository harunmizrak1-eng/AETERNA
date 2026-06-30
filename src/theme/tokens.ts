/**
 * ÆTERNA — Design tokens
 *
 * Design intent: app-grade, NOT the Instagram brand sheet.
 * Surfaces are neutral charcoal (not pure black, not the marketing gold-on-black).
 * Gold is reserved for accents, active states and key data points only.
 * This keeps dense data screens (logs, charts, dosing tables) legible —
 * a fully gold/serif treatment would be unreadable at app density.
 */

export const colors = {
  // Surfaces — neutral, layered charcoal (distinct from the pure #0A0A0A marketing bg)
  bg: '#121212',
  bgElevated: '#1A1A1A',
  bgCard: '#1E1E1E',
  bgCardPressed: '#262626',
  border: '#2A2A2A',
  borderSubtle: '#222222',

  // Text
  textPrimary: '#F2F0EC',
  textSecondary: '#A8A29A',
  textTertiary: '#6E6A62',
  textDisabled: '#454340',

  // Brand accent — used sparingly: active tab, CTA, key metrics
  gold: '#C9A24B',
  goldMuted: '#8A7138',
  goldSoft: 'rgba(201,162,75,0.12)',

  // Semantic
  success: '#5FA876',
  successSoft: 'rgba(95,168,118,0.14)',
  warning: '#C98B4B',
  warningSoft: 'rgba(201,139,75,0.14)',
  danger: '#C2614F',
  dangerSoft: 'rgba(194,97,79,0.14)',
  info: '#5B8DB8',
  infoSoft: 'rgba(91,141,184,0.14)',

  // Evidence-tier colors (maps to Gomez's 3-tier claim framework)
  tierProven: '#5FA876',      // Phase 3 / clinical
  tierMechanistic: '#C9A24B', // mechanism-based reasoning
  tierSpeculative: '#8A7D6B', // preclinical / animal

  // Category colors (compound classes)
  catMetabolic: '#C2614F',
  catGrowth: '#5B8DB8',
  catRepair: '#5FA876',
  catLongevity: '#C9A24B',
  catCognitive: '#9B7FBF',
  catAesthetic: '#C98B4B',

  overlay: 'rgba(0,0,0,0.6)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

// Type scale — system font for UI density; serif reserved for headlines/editorial only
export const type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -0.3 },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.2 },
  h2: { fontSize: 21, lineHeight: 27, fontWeight: '600' as const, letterSpacing: -0.1 },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionMedium: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const, letterSpacing: 0.4 },
  mono: { fontSize: 14, lineHeight: 18, fontWeight: '500' as const, fontFamily: 'monospace' },
  numeric: { fontSize: 28, lineHeight: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export type EvidenceTier = 'proven' | 'mechanistic' | 'speculative';

export const evidenceTierLabel: Record<EvidenceTier, string> = {
  proven: 'Klinik Kanıt',
  mechanistic: 'Mekanizma Bazlı',
  speculative: 'Preklinik / Spekülatif',
};

export const evidenceTierColor: Record<EvidenceTier, string> = {
  proven: colors.tierProven,
  mechanistic: colors.tierMechanistic,
  speculative: colors.tierSpeculative,
};

export type CompoundCategory =
  | 'metabolic'
  | 'growth'
  | 'repair'
  | 'longevity'
  | 'cognitive'
  | 'aesthetic';

export const categoryLabel: Record<CompoundCategory, string> = {
  metabolic: 'Metabolik',
  growth: 'Büyüme / GH',
  repair: 'Doku Onarımı',
  longevity: 'Longevity',
  cognitive: 'Kognitif',
  aesthetic: 'Estetik',
};

export const categoryColor: Record<CompoundCategory, string> = {
  metabolic: colors.catMetabolic,
  growth: colors.catGrowth,
  repair: colors.catRepair,
  longevity: colors.catLongevity,
  cognitive: colors.catCognitive,
  aesthetic: colors.catAesthetic,
};
