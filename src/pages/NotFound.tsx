import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function NotFound() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "160px 40px 120px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1000px 600px at 50% 40%, rgba(232,225,208,0.5), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_soon
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(40px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            marginBottom: 24,
            color: "var(--color-ink)",
          }}
        >
          Not yet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.2 }}
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          This page is on the roadmap but isn't live yet. In the meantime,
          the front door and the services page are.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.3 }}
          style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            to="/"
            style={{
              padding: "14px 24px",
              borderRadius: 999,
              backgroundColor: "var(--color-ink)",
              color: "var(--color-bg)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Back to home
            <span>→</span>
          </Link>
          <Link
            to="/services"
            style={{
              padding: "14px 24px",
              borderRadius: 999,
              backgroundColor: "transparent",
              color: "var(--color-ink)",
              border: "1px solid rgba(20,20,18,0.18)",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            See services
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
