/**
 * Motion tokens — durations, easings, and springs.
 *
 * Phase 2 Session 1 defines these as the shared source of truth.
 * Consumers land in Session 2 (MagneticCTA, hover states, entrance system).
 */

import { cubicBezier } from "motion/react";

export const ease = {
  outQuart: [0.25, 1, 0.5, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
};

/**
 * The same curves as `ease`, as callables.
 *
 * `transition` accepts the bezier tuples above, but `useTransform`'s `ease`
 * option calls what it is given — hand it a tuple and motion throws
 * "a is not a function" at runtime, which TypeScript does not catch.
 */
export const easing = {
  outQuart: cubicBezier(...ease.outQuart),
  outExpo: cubicBezier(...ease.outExpo),
  inOut: cubicBezier(...ease.inOut),
  bounce: cubicBezier(...ease.bounce),
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
