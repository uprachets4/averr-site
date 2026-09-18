import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";


export default function Next({ text }: { text: string }) {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 80,
          alignItems: "start",
        }}
        className="next-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
          }}
        >
          //_06 · what's next
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-body-lg"
          style={{
            color: "var(--color-ink-soft)",
            maxWidth: 900,
          }}
        >
          {text}
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .next-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
