import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import { Link } from "react-router-dom";
import { CharRevealInView } from "./CharReveal";

export default function Manifesto() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        minHeight: "100vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
      }}
      className="manifesto-band"
    >
      <div className="grain-dark" aria-hidden style={{ opacity: 0.55 }} />

      {/* Warm ember drift */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vmin",
          height: "80vmin",
          marginTop: "-40vmin",
          marginLeft: "-40vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.12), transparent 60%)",
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [-24, 24, -24], y: [-16, 16, -16] }
        }
        transition={{ duration: 60, repeat: Infinity, ease: ease.inOut }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-parch)",
            opacity: 0.7,
            marginBottom: 32,
          }}
        >
          Philosophy
        </motion.div>

        <div
          className="type-display-xl measure-wide"
          style={{ color: "var(--color-parch)", marginBottom: 40 }}
        >
          <CharRevealInView
            segments={[
              { text: "Every site we ship gets its own" },
              { text: "signature moment.", accent: true },
            ]}
            style={{ color: "var(--color-parch)" }}
          />
        </div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.4,
          }}
          className="type-body-lg measure-body"
          style={{
            color: "var(--color-muted-l)",
            marginBottom: 40,
          }}
        >
          Not template patterns dressed up in your colors. Not another Framer
          bento. A designed system that answers to your brand and no one
          else's.
        </motion.p>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.8,
          }}
        >
          <Link
            to="/about"
            className="type-eyebrow"
            style={{
              color: "var(--color-parch)",
              opacity: 0.8,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            See how we work →
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .manifesto-band { min-height: 90vh; padding: 128px 24px; }
        }
      `}</style>
    </section>
  );
}
