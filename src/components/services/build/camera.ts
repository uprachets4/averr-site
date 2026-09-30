import { useTransform, type MotionValue } from "motion/react";
import { easing } from "../../../lib/motion";

/**
 * Per-beat focus moves.
 *
 * 17c-2's first pass pushed in hard (1.5–1.6) toward a point, which read
 * as a broken layout: text cropped mid-word at the window edge and a lot
 * of empty frame. A camera does not work that way. This is a *focus*
 * move — a gentle push (1.35 max) plus a spotlight that dims and blurs
 * everything outside the focus rect, so the cropped surroundings read as
 * out-of-focus background rather than as damage.
 *
 * The focal point is the transform origin, so the focused element stays
 * exactly where it is on screen by construction and can never be pushed
 * out of view. The chrome sits outside this transform: scaling the
 * window edges is what makes a mockup look like a zoomed screenshot.
 *
 * Transforms only — no animated width/height, no animated calc() (§5.3).
 */

/**
 * There is no scale any more.
 *
 * Every push-in, at every value tried (1.6, 1.35, 1.22), cropped the
 * frame's edges — that is arithmetic, not tuning: scaling content inside
 * a fixed window always pushes some of it out. The veil made the cut
 * edges *excusable* but never made them right, and text was still being
 * sliced mid-word behind it. Ruled out in 17c-3: the focus is carried
 * entirely by the spotlight. The focused element stays sharp at its
 * natural size, everything else dims, and nothing is ever cropped.
 */

export type FocusMove = {
  /** Local beat progress where the veil starts coming up. */
  from: number;
  /** Fully up. */
  hold: number;
  /** Released. */
  to: number;
  /** The rect to keep sharp, in percent of the content box. */
  rect: { x: number; y: number; w: number; h: number };
};

export type Focus = {
  /** 0 → 1 as the spotlight comes up. */
  dim: MotionValue<number>;
  rect: FocusMove["rect"] | null;
};

export function useFocus(
  local: MotionValue<number>,
  move: FocusMove | null
): Focus {
  const amount = useTransform(local, function ramp(t) {
    if (!move) return 0;
    if (t <= move.from || t >= move.to) return 0;
    if (t < move.hold) {
      return easing.outQuart((t - move.from) / (move.hold - move.from || 1));
    }
    return 1 - easing.inOut((t - move.hold) / (move.to - move.hold || 1));
  });

  return { dim: amount, rect: move ? move.rect : null };
}
