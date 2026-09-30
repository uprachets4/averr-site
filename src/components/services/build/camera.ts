import { useTransform, type MotionValue } from "motion/react";
import { easing } from "../../../lib/motion";

/**
 * Per-beat push-ins.
 *
 * The camera frames the moment that matters: it scales the window's
 * CONTENT toward a focal point and comes back out, so the reader is
 * looking at the KPI that changed rather than hunting for it. The chrome
 * is deliberately outside this transform — scaling the window edges is
 * what makes a mockup look like a zoomed screenshot instead of a camera
 * move.
 *
 * Transforms only, per the locked rules: scale and translate, never
 * width/height, and never an animated `calc()` (§5.3).
 */

export type CameraMove = {
  /** Local beat progress where the push-in starts. */
  from: number;
  /** Where it is fully in. */
  hold: number;
  /** Where it has returned to 1. */
  to: number;
  /** Focal point as a percentage of the content box. */
  x: number;
  y: number;
  /** 1.4–1.8 reads as a push-in; beyond that the content softens. */
  scale: number;
};

export type Camera = {
  scale: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
  origin: string;
};

/**
 * Scaling about a focal point is done with `transformOrigin` rather than
 * a translate, so the maths stays honest at any window size: the origin
 * is the focal point, and the content grows around it.
 */
export function useCamera(
  local: MotionValue<number>,
  move: CameraMove | null
): Camera {
  const scale = useTransform(local, function pushIn(t) {
    if (!move) return 1;
    if (t <= move.from || t >= move.to) return 1;
    if (t < move.hold) {
      const r = (t - move.from) / (move.hold - move.from || 1);
      return 1 + (move.scale - 1) * easing.outQuart(r);
    }
    const r = (t - move.hold) / (move.to - move.hold || 1);
    return move.scale + (1 - move.scale) * easing.inOut(r);
  });

  // kept as MotionValues so a caller can compose further if it needs to
  const x = useTransform(scale, () => "0%");
  const y = useTransform(scale, () => "0%");

  return {
    scale,
    x,
    y,
    origin: move ? `${move.x}% ${move.y}%` : "50% 50%",
  };
}
