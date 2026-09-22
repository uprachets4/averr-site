import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";

type Variant = "hero" | "mini";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * PU monogram.
 * "hero" runs the stroke-then-fill entrance + breathing + per-letter cursor
 * parallax. "mini" renders the settled filled state at small size for reuse
 * inside cards.
 * Every animated bit is gated by useReducedMotion.
 */
export default function MonogramMark({ variant = "hero", className }: Props) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cursor parallax — hero variant only.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sX = useSpring(rawX, spring.soft);
  const sY = useSpring(rawY, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || variant !== "hero" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 24);
    rawY.set(py * 24);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  // Entrance phase tracker — 0: stroke drawing, 1: fill filling, 2: settled.
  const [phase, setPhase] = useState<0 | 1 | 2>(reduce ? 2 : 0);

  useEffect(
    function orchestrate() {
      if (reduce) {
        setPhase(2);
        return;
      }
      const t1 = window.setTimeout(function toFill() {
        setPhase(1);
      }, 1400);
      const t2 = window.setTimeout(function settle() {
        setPhase(2);
      }, 2000);
      return function cleanup() {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    },
    [reduce]
  );

  // Sizing per variant.
  const sizeStyle =
    variant === "hero"
      ? {
          width: "clamp(280px, 40vw, 480px)",
          height: "clamp(240px, 34vw, 400px)",
        }
      : { width: 160, height: 140 };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        ...sizeStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.svg
        viewBox="0 0 400 320"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        aria-label="Prachets Upadhyay monogram"
        role="img"
        animate={
          reduce || variant !== "hero"
            ? undefined
            : { scale: [1, 1.008, 1] }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: ease.inOut,
        }}
      >
        {/* P */}
        <Letter
          character="P"
          x={120}
          phase={phase}
          reduce={!!reduce}
          parallaxWeight={0.7}
          parallaxX={sX}
          parallaxY={sY}
          variant={variant}
        />
        {/* U */}
        <Letter
          character="U"
          x={280}
          phase={phase}
          reduce={!!reduce}
          parallaxWeight={1.0}
          parallaxX={sX}
          parallaxY={sY}
          variant={variant}
        />
      </motion.svg>
    </div>
  );
}

function Letter({
  character,
  x,
  phase,
  reduce,
  parallaxWeight,
  parallaxX,
  parallaxY,
  variant,
}: {
  character: string;
  x: number;
  phase: 0 | 1 | 2;
  reduce: boolean;
  parallaxWeight: number;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  variant: Variant;
}) {
  // Per-letter weighted parallax so P (0.7) drifts less than U (1.0).
  const weightedX = useTransform(parallaxX, (v) => v * parallaxWeight);
  const weightedY = useTransform(parallaxY, (v) => v * parallaxWeight);

  // Base font sizing to fill the viewBox height.
  const fontSize = variant === "hero" ? 320 : 260;

  const strokeOpacity =
    phase === 0 ? 1 : phase === 1 ? 0.6 : 0;
  const fillOpacity = phase === 0 ? 0 : 1;
  const strokeOffset =
    phase === 0
      ? 2400 // start fully hidden
      : 0; // settled/settling revealed

  const shared = {
    x,
    y: 260,
    textAnchor: "middle" as const,
    fontFamily: "var(--font-display), Georgia, serif",
    fontWeight: 700,
    fontSize,
    letterSpacing: "-0.06em",
  };

  const applyParallax = !reduce && variant === "hero";

  return (
    <motion.g
      style={{
        x: applyParallax ? weightedX : 0,
        y: applyParallax ? weightedY : 0,
      }}
    >
      {/* Stroke layer — draws in via strokeDashoffset. */}
      <motion.text
        {...shared}
        fill="transparent"
        stroke="var(--color-ink)"
        strokeWidth={2}
        strokeLinejoin="round"
        style={{
          strokeDasharray: 2400,
        }}
        initial={{ strokeDashoffset: reduce ? 0 : 2400, opacity: reduce ? 0 : 1 }}
        animate={{ strokeDashoffset: strokeOffset, opacity: strokeOpacity }}
        transition={{
          duration: reduce ? 0 : phase === 0 ? 1.4 : duration.slow,
          ease: ease.outQuart,
        }}
      >
        {character}
      </motion.text>
      {/* Fill layer — fades in after stroke completes. */}
      <motion.text
        {...shared}
        fill="var(--color-ink)"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: fillOpacity }}
        transition={{
          duration: reduce ? 0 : duration.slow,
          ease: ease.outQuart,
        }}
      >
        {character}
      </motion.text>
    </motion.g>
  );
}

/**
 * Uses per-letter weighted parallax to build depth. Consumers of the mini
 * variant get static rendering — the mini isn't the signature moment.
 */

// Reduce noise: intentionally casts spring motion values via unknown to number
// for x/y style channels; motion accepts MotionValues on transform channels.
