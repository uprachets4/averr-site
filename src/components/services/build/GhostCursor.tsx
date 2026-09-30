import { motion, useTransform, type MotionValue } from "motion/react";
import { easing } from "../../../lib/motion";
import { useScrollStyle } from "../../../lib/useScrollStyle";

/**
 * A pointer that uses the software on screen.
 *
 * Choreographed from the SAME scroll value as everything else — the
 * cursor is not a timer-driven animation that happens to look
 * synchronised. A keyframe is a position at a local beat progress, and
 * the scene reads that same progress to decide when a field is filled or
 * a toggle is on. One source of truth, so the click and the response can
 * never drift apart the way the /work film's index and content did.
 *
 * Positions are percentages of the screen area, so a beat's
 * choreography survives the window being resized.
 */

export type CursorKey = {
  /** Local beat progress, 0–1. */
  at: number;
  /** Percent of the screen area. */
  x: number;
  y: number;
  /** Renders a press ring and a click ripple at this keyframe. */
  press?: boolean;
};

function interp(keys: CursorKey[], t: number, axis: "x" | "y") {
  if (!keys.length) return 50;
  if (t <= keys[0].at) return keys[0][axis];
  const last = keys[keys.length - 1];
  if (t >= last.at) return last[axis];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.at && t <= b.at) {
      const raw = (t - a.at) / (b.at - a.at || 1);
      // ease each hop so the pointer accelerates and settles rather than
      // sliding linearly, which is the thing that reads as "not a person"
      const e = easing.inOut(raw);
      return a[axis] + (b[axis] - a[axis]) * e;
    }
  }
  return last[axis];
}

/** How close, in local progress, a press keyframe counts as "pressing". */
const PRESS_WINDOW = 0.035;

function pressAmount(keys: CursorKey[], t: number) {
  let best = 0;
  for (const k of keys) {
    if (!k.press) continue;
    const d = Math.abs(t - k.at);
    if (d < PRESS_WINDOW) best = Math.max(best, 1 - d / PRESS_WINDOW);
  }
  return best;
}

export default function GhostCursor({
  local,
  keys,
  hidden,
}: {
  /** 0–1 within the beat. */
  local: MotionValue<number>;
  keys: CursorKey[];
  /** Reduced motion, or a beat with no choreography. */
  hidden?: boolean;
}) {
  const xPct = useTransform(local, (t) => interp(keys, t, "x"));
  const yPct = useTransform(local, (t) => interp(keys, t, "y"));
  // a slow, small wobble so the path is not mechanically straight
  const wobbleX = useTransform(local, (t) => Math.sin(t * 34) * 0.32);
  const wobbleY = useTransform(local, (t) => Math.cos(t * 27) * 0.26);
  const left = useTransform(
    [xPct, wobbleX] as MotionValue<number>[],
    ([a, b]) => `${(a as number) + (b as number)}%`
  );
  const top = useTransform(
    [yPct, wobbleY] as MotionValue<number>[],
    ([a, b]) => `${(a as number) + (b as number)}%`
  );

  const press = useTransform(local, (t) => pressAmount(keys, t));
  const pressScale = useTransform(press, [0, 1], [1, 0.82]);
  const rippleScale = useTransform(press, [0, 1], [0.2, 2.6]);
  const rippleFade = useTransform(press, [0, 0.25, 1], [0, 0.5, 0]);

  // the cursor itself only appears once the beat is under way
  const appear = useTransform(local, [0.04, 0.12, 0.92, 1], [0, 1, 1, 0]);
  const appearRef = useScrollStyle<HTMLDivElement>(appear);
  const rippleRef = useScrollStyle<HTMLSpanElement>(rippleFade);

  if (hidden || keys.length === 0) return null;

  return (
    <div
      ref={appearRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <motion.div style={{ position: "absolute", left, top }}>
        {/* click ripple */}
        <motion.span
          ref={rippleRef}
          style={{
            position: "absolute",
            left: -13,
            top: -13,
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "1.5px solid var(--color-ink)",
            scale: rippleScale,
          }}
        />
        <motion.span style={{ display: "block", scale: pressScale }}>
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            style={{
              display: "block",
              filter: "drop-shadow(0 2px 4px rgba(20,20,18,0.35))",
            }}
          >
            <path
              d="M3 2 L3 18.2 L7.1 14.4 L9.8 20.6 L12.6 19.4 L10 13.3 L15.6 13.1 Z"
              fill="#FFFFFF"
              stroke="#141412"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  );
}
