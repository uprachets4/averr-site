import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease, spring } from "../lib/motion";

type Variant = "nav" | "footer";

type Props = {
  variant?: Variant;
  className?: string;
  /** Ground the mark sits on. "light" (default) is byte-identical; "dark"
   *  swaps the inner dot so it reads as a hole in a parch disc. The outer
   *  disc already follows currentColor. */
  tone?: "light" | "dark";
};

/**
 * Averr wordmark lockup: geometric mark (filled circle + cream inner dot)
 * + "Averr" wordmark in display face, with optional "STUDIOS" eyebrow in
 * the footer variant. The inner dot spring-scales in after the wordmark
 * mounts and briefly pulses on nav hover — the single delight moment on
 * the mark.
 */
export default function AverrMark({ variant = "nav", className }: Props) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const isFooter = variant === "footer";

  return (
    <div
      className={className}
      onMouseEnter={function h() {
        setHovered(true);
      }}
      onMouseLeave={function h() {
        setHovered(false);
      }}
      style={{
        display: "inline-flex",
        flexDirection: isFooter ? "column" : "row",
        alignItems: isFooter ? "flex-start" : "center",
        gap: isFooter ? 8 : 10,
        color: "inherit",
      }}
    >
      {/* The "averr." wordmark: the name in lowercase, the full stop in the
          brand gradient. Under 380px the word hides (index.css) and the
          gradient dot stays as the home link's mark. */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: isFooter ? 28 : 23,
          fontWeight: 600,
          letterSpacing: "-0.045em",
          lineHeight: 1,
          color: "inherit",
        }}
      >
        <span className={isFooter ? undefined : "averr-word"}>averr</span>
        <motion.i
          className="averr-dot"
          aria-hidden
          initial={{ scale: reduce ? 1 : 0 }}
          animate={{ scale: reduce ? 1 : hovered ? [1, 1.35, 1] : 1 }}
          transition={
            hovered && !reduce
              ? { duration: 0.5, ease: ease.outQuart }
              : { ...spring.snappy, delay: reduce ? 0 : 0.35 }
          }
        />
      </span>
      {isFooter ? (
        <span
          className="type-eyebrow"
          style={{
            color: "inherit",
            opacity: 0.7,
            letterSpacing: "0.18em",
          }}
        >
          Studios
        </span>
      ) : null}
    </div>
  );
}
