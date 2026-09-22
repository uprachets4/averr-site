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
 * PU monogram — renders the deep-navy raster at /brand/pu-mark.png.
 * "hero" runs a clip-path draw-from-top + scale-fade entrance,
 * then a subtle breathing loop with cursor parallax on the whole mark.
 * "mini" renders the settled state at card scale — no ambient.
 * All motion gated by useReducedMotion.
 */
export default function MonogramMark({ variant = "hero", className }: Props) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cursor parallax — hero only.
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

  // After the clip-path draw-in completes, kick off the breathing loop.
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
        <motion.img
          src="/brand/pu-mark.png"
          alt="Prachets Upadhyay monogram"
          draggable={false}
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
            height: "auto",
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </motion.div>
    </div>
  );
}
