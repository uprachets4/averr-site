import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import PillHl from "./PillHl";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

function MagneticCTA({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "14px 24px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "var(--color-ink)",
    color: "var(--color-bg)",
    border: "1px solid var(--color-ink)",
  };

  const ghostStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "transparent",
    color: "var(--color-ink)",
    border: "1px solid rgba(20,20,18,0.18)",
  };

  const finalStyle = variant === "primary" ? primaryStyle : ghostStyle;

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY, ...finalStyle }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink-soft)";
        } else {
          e.currentTarget.style.backgroundColor = "rgba(20,20,18,0.04)";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.32)";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink)";
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.18)";
        }
      }}
      whileHover={{ scale: variant === "primary" ? 1.03 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      {children}
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.3s ease",
        }}
        className="group-hover:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}

export default function FinalCTA({ markerNumber }: { markerNumber: string }) {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "160px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1000px 600px at 50% 50%, rgba(232,225,208,0.6), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Section marker */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          {`//_${markerNumber} · ready when you are`}
        </motion.div>

        {/* Headline with pill highlight */}
        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          className="type-display-xl"
          style={{
            maxWidth: 900,
            margin: "0 auto 48px",
            color: "var(--color-ink)",
          }}
        >
          Build something that{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduce ? 0.01 : 0.5,
              ease: BOUNCE,
              delay: reduce ? 0 : 0.4,
            }}
            style={{ display: "inline-block" }}
          >
            <PillHl>actually</PillHl>
          </motion.span>{" "}
          looks like you meant it.
        </motion.h2>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.5 }}
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <MagneticCTA
            href="/contact"
            variant="primary"
          >
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA href="/work" variant="ghost">
            See our work
          </MagneticCTA>
        </motion.div>
      </div>
    </section>
  );
}
