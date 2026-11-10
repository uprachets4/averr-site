import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";

/**
 * Persistent ambient environment — mounts once at the app root, sits behind
 * every page. Fixed positioning, pointer-events none, so it never blocks
 * interaction and never scrolls with content.
 *
 * Layer stack (behind everything else):
 *   1. Two slow-drifting gradient orbs anchored at fixed viewport corners
 *   2. Small particle field of ink dots on independent drift loops
 *   3. Grain overlay via the existing .grain-light class
 *
 * Under useReducedMotion: drift disabled but the static composition still
 * renders — the environment reads as intentional atmosphere, not motion for
 * its own sake.
 */
export default function AmbientEnvironment() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Gradient orbs — anchored to viewport corners, gentle drift */}
      <motion.div
        style={{
          position: "absolute",
          top: "-10vh",
          left: "-10vw",
          width: "60vmin",
          height: "60vmin",
          background:
            "radial-gradient(circle, rgba(237,233,226,0.12), transparent 60%)",
          borderRadius: "50%",
          willChange: reduce ? undefined : "transform",
        }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, 30, -20, 0],
                y: [0, 20, -30, 0],
              }
        }
        transition={{ duration: 110, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-15vh",
          right: "-10vw",
          width: "70vmin",
          height: "70vmin",
          background:
            "radial-gradient(circle, rgba(237,233,226,0.10), transparent 60%)",
          borderRadius: "50%",
          willChange: reduce ? undefined : "transform",
        }}
        animate={
          reduce
            ? undefined
            : {
                x: [0, -40, 20, 0],
                y: [0, -30, 25, 0],
              }
        }
        transition={{ duration: 130, repeat: Infinity, ease: ease.inOut }}
      />

      {/* Particle field — 10 ink dots at fixed viewport % coords, each on its
          own drift so the field never feels like a synced grid. */}
      {PARTICLES.map(function drawDot(p, i) {
        return (
          <motion.span
            key={i}
            style={{
              position: "absolute",
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "var(--color-ink)",
              opacity: p.opacity,
            }}
            animate={
              reduce
                ? undefined
                : {
                    x: p.driftX,
                    y: p.driftY,
                  }
            }
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: ease.inOut,
            }}
          />
        );
      })}

      {/* Grain */}
      <div
        className="grain-light"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

type Particle = {
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  driftX: number[];
  driftY: number[];
};

const PARTICLES: Particle[] = [
  { top: 12, left: 22, size: 3, opacity: 0.15, duration: 80, driftX: [0, 12, -8, 0], driftY: [0, -10, 6, 0] },
  { top: 28, left: 64, size: 4, opacity: 0.18, duration: 95, driftX: [0, -14, 10, 0], driftY: [0, 8, -12, 0] },
  { top: 44, left: 12, size: 3, opacity: 0.20, duration: 105, driftX: [0, 16, -12, 0], driftY: [0, -6, 10, 0] },
  { top: 55, left: 82, size: 2, opacity: 0.16, duration: 72, driftX: [0, -10, 14, 0], driftY: [0, 12, -8, 0] },
  { top: 68, left: 38, size: 4, opacity: 0.17, duration: 88, driftX: [0, 8, -14, 0], driftY: [0, -14, 4, 0] },
  { top: 76, left: 70, size: 3, opacity: 0.15, duration: 100, driftX: [0, -12, 10, 0], driftY: [0, 6, -12, 0] },
  { top: 85, left: 18, size: 2, opacity: 0.18, duration: 70, driftX: [0, 14, -6, 0], driftY: [0, -8, 12, 0] },
  { top: 20, left: 48, size: 3, opacity: 0.16, duration: 115, driftX: [0, -8, 14, 0], driftY: [0, 10, -6, 0] },
  { top: 62, left: 55, size: 2, opacity: 0.20, duration: 92, driftX: [0, 10, -14, 0], driftY: [0, -12, 8, 0] },
  { top: 38, left: 88, size: 3, opacity: 0.14, duration: 78, driftX: [0, -14, 8, 0], driftY: [0, 6, -10, 0] },
];
