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
 * The hardest push that still reads as focus rather than a zoom.
 *
 * Any scale above 1 crops the frame's edges, and at 1.35 the cropped text
 * was landing mid-word and reading as a broken layout even with the
 * spotlight up. 1.22 keeps the move legible while leaving far less cut
 * content at the edge for the veil to have to explain away.
 */
export const MAX_FOCUS_SCALE = 1.22;

export type FocusMove = {
  /** Local beat progress where the move starts. */
  from: number;
  /** Fully in. */
  hold: number;
  /** Released. */
  to: number;
  /**
   * The rect to focus, in percent of the content box. The spotlight
   * keeps this fully visible; the transform origin is its centre.
   */
  rect: { x: number; y: number; w: number; h: number };
  /** Clamped to MAX_FOCUS_SCALE. */
  scale?: number;
};

export type Focus = {
  scale: MotionValue<number>;
  /** 0 → 1 as the spotlight comes up. */
  dim: MotionValue<number>;
  origin: string;
  rect: FocusMove["rect"] | null;
};

export function useFocus(
  local: MotionValue<number>,
  move: FocusMove | null
): Focus {
  const target = move
    ? Math.min(MAX_FOCUS_SCALE, move.scale ?? MAX_FOCUS_SCALE)
    : 1;

  const amount = useTransform(local, function ramp(t) {
    if (!move) return 0;
    if (t <= move.from || t >= move.to) return 0;
    if (t < move.hold) {
      return easing.outQuart((t - move.from) / (move.hold - move.from || 1));
    }
    return 1 - easing.inOut((t - move.hold) / (move.to - move.hold || 1));
  });

  const scale = useTransform(amount, (a) => 1 + (target - 1) * a);

  return {
    scale,
    dim: amount,
    origin: move
      ? `${move.rect.x + move.rect.w / 2}% ${move.rect.y + move.rect.h / 2}%`
      : "50% 50%",
    rect: move ? move.rect : null,
  };
}
