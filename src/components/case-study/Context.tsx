import { motion, useReducedMotion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Context({ paragraphs }: { paragraphs: string[] }) {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
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
          gridTemplateColumns: "140px 1fr",
          gap: 40,
          alignItems: "start",
        }}
        className="context-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
          }}
        >
          //_01 · context
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.1 + i * 0.1,
              }}
              className="type-body-lg"
              style={{
                color: "var(--color-ink-soft)",
                maxWidth: 780,
              }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .context-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
