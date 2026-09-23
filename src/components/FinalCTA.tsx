import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import PillHl from "./PillHl";
import { CharRevealInView } from "./CharReveal";



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
      <div className="grain-light" aria-hidden="true" style={{ opacity: 0.05 }} />

      {/* Ambient marks — echo /about closing rhythm */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "18%",
          left: "10%",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid var(--color-ink)",
          opacity: 0.22,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, 18, 0, -14, 0], y: [0, -12, 10, 0, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "16%",
          right: "10%",
          width: 22,
          height: 22,
          border: "1px solid var(--color-parch)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, -18, 0, 14, 0], y: [0, 14, -10, 0, 0] }}
        transition={{ duration: 55, repeat: Infinity, ease: ease.inOut }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Section marker */}
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            display: "inline-block",
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          {`//_${markerNumber} · ready when you are`}
        </motion.div>

        {/* Headline: char reveal on the flat portions, PillHl still self-animates */}
        <h2
          className="type-display-xl"
          style={{
            maxWidth: 900,
            margin: "0 auto 48px",
            color: "var(--color-ink)",
          }}
        >
          <CharRevealInView
            text="Build something that"
            style={{ color: "var(--color-ink)" }}
          />{" "}
          <motion.span
            initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              ease: ease.bounce,
              delay: reduce ? 0 : 0.4,
            }}
            style={{ display: "inline-block" }}
          >
            <PillHl>actually</PillHl>
          </motion.span>{" "}
          <CharRevealInView
            text="looks like you meant it."
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: 0.5 }}
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <MagneticCTA
            to="/contact"
            variant="primary"
          >
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA to="/work" variant="ghost">
            See our work
          </MagneticCTA>
        </motion.div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.9 }}
          style={{ marginTop: 72 }}
        >
          <button
            type="button"
            onClick={function toTop() {
              window.scrollTo({
                top: 0,
                behavior: reduce ? "auto" : "smooth",
              });
            }}
            className="type-eyebrow"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-ink-soft)",
              padding: "8px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ↑ Back to top
          </button>
        </motion.div>
      </div>
    </section>
  );
}
