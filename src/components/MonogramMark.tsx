import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ease, spring } from "../lib/motion";

type Variant = "hero" | "mini";

type Props = {
  variant?: Variant;
  className?: string;
};

/**
 * PU monogram — inline SVG rendering the mark at /brand/pu-mark.svg.
 * Inline (not <img src>) so `currentColor` works, the mark stays sharp at
 * every size, and individual paths remain animatable for future work
 * (Session 8: stroke-draw via pathLength + strokeDasharray on the two
 * subpaths).
 *
 * "hero" runs a clip-path draw-from-top + scale-fade entrance, then a
 * subtle breathing loop with cursor parallax on the whole mark.
 * "mini" renders the settled state at card scale — no ambient.
 * All motion gated by useReducedMotion.
 */

const MARK_PATH_D =
  "M135.00,394.43 C120.31,391.89 112.01,389.20 100.97,383.37 C81.86,373.30 68.39,356.37 62.46,335.00 C60.88,329.32 60.60,322.98 60.23,284.50 C60.00,260.30 60.13,221.94 60.52,199.25 C61.24,158.00 61.24,158.00 104.57,158.00 C132.84,158.00 149.74,157.61 153.20,156.88 C169.04,153.51 177.06,143.65 175.75,129.14 C175.13,122.36 173.42,118.64 168.82,114.10 C159.57,104.97 153.13,104.00 101.89,104.00 C60.96,104.00 60.96,104.00 61.23,82.25 C61.50,60.50 61.50,60.50 110.00,60.51 C157.62,60.52 158.65,60.57 167.00,62.85 C191.35,69.50 206.49,80.72 214.99,98.42 C217.12,102.86 219.57,109.97 220.43,114.21 C222.83,126.02 222.35,144.91 219.42,154.25 C218.92,155.83 219.77,156.00 228.31,156.00 C235.18,156.00 238.07,156.38 238.91,157.40 C239.78,158.44 239.99,180.60 239.76,244.65 C239.44,330.50 239.44,330.50 237.16,337.97 C232.32,353.79 222.19,368.55 210.09,377.43 C202.56,382.96 189.95,388.75 179.26,391.59 C171.13,393.75 166.82,394.24 153.50,394.52 C144.70,394.71 136.38,394.67 135.00,394.43 Z M160.51,349.53 C174.92,346.77 185.38,339.87 190.84,329.54 C193.50,324.50 193.50,324.50 193.78,256.66 C193.93,219.34 193.70,188.99 193.28,189.21 C183.31,194.23 174.65,197.71 167.00,199.78 C158.22,202.15 155.54,202.38 131.72,202.76 C105.94,203.17 105.94,203.17 106.22,261.84 C106.50,320.50 106.50,320.50 109.69,327.22 C115.23,338.93 125.14,346.43 139.06,349.44 C147.53,351.28 151.28,351.30 160.51,349.53 Z";

export default function MonogramMark({ variant = "hero", className }: Props) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const [entered, setEntered] = useState(reduce ? true : false);
  useEffect(
    function scheduleBreathing() {
      if (reduce) {
        setEntered(true);
        return;
      }
      const t = window.setTimeout(function done() {
        setEntered(true);
      }, 1500);
      return function cleanup() {
        window.clearTimeout(t);
      };
    },
    [reduce]
  );

  const sizeStyle: React.CSSProperties =
    variant === "hero"
      ? {
          width: "clamp(320px, 45vw, 560px)",
          height: "auto",
        }
      : { width: 160, height: "auto" };

  const applyParallax = !reduce && variant === "hero";
  const applyBreathing = !reduce && variant === "hero" && entered;

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        display: "inline-block",
        color: "var(--color-ink)",
        ...sizeStyle,
      }}
    >
      <motion.div
        style={{
          x: applyParallax ? sX : 0,
          y: applyParallax ? sY : 0,
          width: "100%",
        }}
        animate={
          applyBreathing
            ? { scale: [1, 1.008, 1] }
            : undefined
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: ease.inOut,
        }}
      >
        <motion.div
          initial={{
            opacity: reduce ? 1 : 0,
            scale: reduce ? 1 : 0.92,
            clipPath: reduce ? "inset(0%)" : "inset(100% 0 0 0)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            clipPath: "inset(0%)",
          }}
          transition={{
            duration: reduce ? 0 : 1.4,
            ease: ease.outQuart,
          }}
          style={{
            display: "block",
            width: "100%",
          }}
        >
          <svg
            viewBox="0 0 327 454"
            fill="none"
            role="img"
            aria-label="Prachets Upadhyay monogram"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              color: "inherit",
            }}
          >
            <path
              d={MARK_PATH_D}
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
