import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";

export default function Outcome({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "160px 40px",
        position: "relative",
        textAlign: "center",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 40 }}
        >
          //_05 · outcome
        </motion.div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: ease.outExpo,
            delay: reduce ? 0 : 0.1,
          }}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}
