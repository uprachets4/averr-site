import { motion, useReducedMotion } from "motion/react";
import { duration as D, ease } from "../lib/motion";

/**
 * `paint` is the hero mode.
 *
 * The default is a mask: the line starts a full line-height below its own
 * clipping box, so nothing is on screen until the animation runs. That is
 * exactly what an above-the-fold line must not do — a largest contentful
 * paint cannot be measured before the pixels exist, so the delay becomes
 * the LCP.
 *
 * In paint mode the text is at opacity 1 in the first frame and only the
 * transform animates: y 12 → 0 over `duration.base`. The clip is dropped
 * with it, because a clipped box would crop the painted line. The delay is
 * kept, so a hero still reads top → bottom — the lines travel in order
 * instead of appearing in order.
 */
export default function LineReveal({
  delay,
  duration = 0.8,
  paint,
  children,
}: {
  delay: number;
  duration?: number;
  paint?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <span
      style={{ display: "block", overflow: paint ? "visible" : "hidden" }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        initial={{
          y: reduce ? 0 : paint ? 12 : "100%",
          opacity: reduce || paint ? 1 : 0,
        }}
        animate={paint ? { y: 0 } : { y: 0, opacity: 1 }}
        transition={{
          delay: reduce ? 0 : delay,
          duration: reduce ? 0 : paint ? D.base : duration,
          ease: paint ? ease.outQuart : ease.outExpo,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
