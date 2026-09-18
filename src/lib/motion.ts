/**
 * Motion tokens — durations, easings, and springs.
 *
 * Phase 2 Session 1 defines these as the shared source of truth.
 * Consumers land in Session 2 (MagneticCTA, hover states, entrance system).
 */

export const ease = {
  outQuart: [0.25, 1, 0.5, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  hero: 0.8,
};

export const spring = {
  soft: { type: "spring" as const, stiffness: 100, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 200, damping: 25 },
};
