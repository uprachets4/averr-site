import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease, spring } from "../lib/motion";

type Variant = "nav" | "footer";

type Props = {
  variant?: Variant;
  className?: string;
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
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AverrGlyph reduce={!!reduce} hovered={hovered} />
        <span
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: isFooter ? 28 : 22,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1,
            color: "inherit",
          }}
        >
          Averr
        </span>
      </div>
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

function AverrGlyph({
  reduce,
  hovered,
}: {
  reduce: boolean;
  hovered: boolean;
}) {
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        width: 18,
        height: 18,
        flexShrink: 0,
      }}
    >
      {/* Outer filled disc */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: "currentColor",
          borderRadius: "50%",
        }}
      />
      {/* Inner cream dot — spring-scale entrance, brief hover pulse */}
      <motion.span
        initial={{ scale: reduce ? 1 : 0 }}
        animate={{
          scale: reduce ? 1 : hovered ? [1, 1.25, 1] : 1,
        }}
        transition={
          hovered && !reduce
            ? { duration: 0.5, ease: ease.outQuart }
            : { ...spring.snappy, delay: reduce ? 0 : 0.35 }
        }
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 6,
          height: 6,
          marginTop: -3,
          marginLeft: -3,
          background: "var(--color-bg)",
          borderRadius: "50%",
          transformOrigin: "center center",
        }}
      />
    </span>
  );
}
