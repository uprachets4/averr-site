import { type MotionValue } from "motion/react";
import { useScrollStyle } from "../../../lib/useScrollStyle";
import type { FocusMove } from "./camera";

/**
 * Dims and blurs everything outside the focus rect.
 *
 * Built as four bands rather than one masked overlay because the effect
 * needed is the inverse of what `backdrop-filter` gives you on a single
 * element: a filter applies to what is behind THAT element, so a single
 * rect over the focus area would blur the thing we want sharp. Four
 * bands around the rect blur the surroundings and leave the focus alone.
 *
 * The bands live inside the scaled content layer and are positioned in
 * the same percentage space as the rect, so they stay aligned at every
 * scale without any coordinate maths. They extend far past the content
 * box so nothing leaks at the edges once the content is scaled up.
 */

const OUT = "-300%";
const TINT = "rgba(16,18,21,0.55)";
const BAND: React.CSSProperties = {
  position: "absolute",
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
  background: TINT,
  pointerEvents: "none",
};

export default function FocusSpotlight({
  rect,
  amount,
}: {
  rect: FocusMove["rect"];
  /** 0 → 1, the same ramp the scale uses. */
  amount: MotionValue<number>;
}) {
  // opacity inside a sticky frame — written by hand, never by motion (§5.1)
  const ref = useScrollStyle<HTMLDivElement>(amount);
  const { x, y, w, h } = rect;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6 }}
    >
      <div style={{ ...BAND, inset: `${OUT} ${OUT} ${100 - y}% ${OUT}` }} />
      <div style={{ ...BAND, inset: `${y + h}% ${OUT} ${OUT} ${OUT}` }} />
      <div style={{ ...BAND, inset: `${y}% ${100 - x}% ${100 - (y + h)}% ${OUT}` }} />
      <div style={{ ...BAND, inset: `${y}% ${OUT} ${100 - (y + h)}% ${x + w}%` }} />
    </div>
  );
}
