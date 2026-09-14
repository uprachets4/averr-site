import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import PillHl from "../components/PillHl";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

const EMAIL_ADDR = "prachets@averrstudios.com";

function CTAButton({
  to,
  variant,
  children,
}: {
  to: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  function handleMove(e: React.MouseEvent<HTMLElement>) {
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
    <motion.div
      style={{ x: springX, y: springY, display: "inline-block" }}
      whileHover={{ scale: variant === "primary" ? 1.03 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Link
        ref={ref}
        to={to}
        style={finalStyle}
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
        className="group"
      >
        {children}
        <span
          style={{ display: "inline-block", transition: "transform 0.3s ease" }}
          className="group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

export default function ComingSoon() {
  const reduce = useReducedMotion();

  useEffect(function updateTitle() {
    const prev = document.title;
    document.title = "In production — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  useEffect(function scrollTop() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        padding: "160px 40px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 30%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 70%, rgba(232,225,208,0.35), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_in_production
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(42px, 5.6vw, 76px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
          }}
        >
          This case study{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: BOUNCE, delay: 0.9 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>isn't live</PillHl>
          </motion.span>{" "}
          yet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.2 }}
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: 680,
            marginBottom: 56,
          }}
        >
          The project is real and the work is done — the write-up is still in
          the queue. If you want the story now, easiest way is a 20-minute call.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.5 }}
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 56,
          }}
        >
          <CTAButton to="/contact" variant="primary">
            Book a discovery call
          </CTAButton>
          <CTAButton to="/work" variant="ghost">
            See other case studies
          </CTAButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.8 }}
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--color-muted-2)",
            maxWidth: 720,
          }}
        >
          Or if you want context on this specific project by email —{" "}
          <a
            href={`mailto:${EMAIL_ADDR}`}
            style={{
              color: "var(--color-muted)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {EMAIL_ADDR}
          </a>
          .
        </motion.p>
      </div>
    </section>
  );
}
