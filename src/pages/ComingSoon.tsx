import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import PillHl from "../components/PillHl";

const EMAIL_ADDR = "prachets@averrstudios.com";

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
            "radial-gradient(ellipse 1400px 900px at 30% 30%, rgba(245,245,247,0.03), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 70%, rgba(245,245,247,0.03), transparent 60%)",
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
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: 0.1 }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_in_production
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
          }}
        >
          This case study{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.bounce, delay: 0.9 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>isn't live</PillHl>
          </motion.span>{" "}
          yet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.2 }}
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
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.5 }}
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 56,
          }}
        >
          <MagneticCTA size="md" to="/contact" variant="primary">
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA size="md" to="/work" variant="ghost">
            See other case studies
          </MagneticCTA>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.8 }}
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
