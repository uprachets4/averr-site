import { motion, useReducedMotion } from "motion/react";
import type { Pillar } from "../../data/caseStudies";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Entry = { pillar: Pillar; body: string };

export default function Approach({ entries }: { entries: Entry[] }) {
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
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_02 · approach
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            color: "var(--color-ink)",
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          Three pillars, <span className="fade-h">one plan.</span>
        </motion.h2>

        <div
          className="approach-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(1, entries.length)}, minmax(0, 1fr))`,
            gap: 16,
          }}
        >
          {entries.map((entry, i) => (
            <motion.article
              key={`${entry.pillar}-${i}`}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.15 + i * 0.1,
              }}
              style={{
                padding: "36px 32px",
                background: "var(--color-bg)",
                border: "1px solid rgba(20,20,18,0.08)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    color: "var(--color-ink)",
                    fontWeight: 500,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(20,20,18,0.18)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-soft)",
                    background: "transparent",
                  }}
                >
                  {entry.pillar}
                </span>
              </div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--color-ink-soft)",
                }}
              >
                {entry.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .approach-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
