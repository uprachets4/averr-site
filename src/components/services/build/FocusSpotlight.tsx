import { type MotionValue } from "motion/react";
import { useScrollStyle } from "../../../lib/useScrollStyle";
import type { FocusMove } from "./camera";
import type { ChromeTone } from "./WindowChrome";

/**
 * Dims everything outside the focus rect.
 *
 * Built as four bands rather than one masked overlay because the effect
 * needed is the inverse of what a single rect gives you: an overlay over
 * the focus area would cover the thing we want sharp. Four bands around
 * the rect dim the surroundings and never touch the focus.
 *
 * The bands are positioned in the same percentage space as the rect and
 * extend far past the content box so nothing leaks at the edges.
 *
 * TWO THINGS WERE WRONG, both fixed in 17d.
 *
 * 1. `backdrop-filter: blur(2px)`. The old comment said it was "kept
 *    because it costs nothing where it works" — inside a transformed
 *    ancestor, which this is, it does not merely fail: Chromium falls
 *    back to compositing the band as an opaque fill. That is the white
 *    box over the Approvals diff in the recording. A filter that is
 *    documented as unreliable in the exact context it runs in is not
 *    free, and it is gone.
 *
 * 2. One fixed near-black tint over every screen. On the light screens
 *    that is a grey wash over cream — the "murky" veil. The scrim is now
 *    the screen's OWN surface colour, so dimming a light screen lightens
 *    it toward its own paper and dimming a dark screen deepens it toward
 *    its own ink. No grey, no colour that is not already on screen.
 */

/** Far enough past the content box that nothing leaks once laid out. */
const OUT = "-300%";

/** Each tone veils toward its own window body (see WindowChrome TONES). */
const VEIL: Record<ChromeTone, string> = {
  light: "rgba(244,240,230,0.55)",
  dark: "rgba(16,18,21,0.5)",
};

export default function FocusSpotlight({
  rect,
  amount,
  tone,
}: {
  rect: FocusMove["rect"];
  /** 0 → 1, the ramp the focus move defines. */
  amount: MotionValue<number>;
  tone: ChromeTone;
}) {
  // opacity inside a sticky frame — written by hand, never by motion (§5.1)
  const ref = useScrollStyle<HTMLDivElement>(amount);
  const { x, y, w, h } = rect;
  const band: React.CSSProperties = {
    position: "absolute",
    background: VEIL[tone],
    pointerEvents: "none",
  };

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6 }}
    >
      <div style={{ ...band, inset: `${OUT} ${OUT} ${100 - y}% ${OUT}` }} />
      <div style={{ ...band, inset: `${y + h}% ${OUT} ${OUT} ${OUT}` }} />
      <div style={{ ...band, inset: `${y}% ${100 - x}% ${100 - (y + h)}% ${OUT}` }} />
      <div style={{ ...band, inset: `${y}% ${OUT} ${100 - (y + h)}% ${x + w}%` }} />
    </div>
  );
}
