import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import type { Pillar } from "../../data/caseStudies";


type Entry = { pillar: Pillar; body: string };

function pillarChipStyle(pillar: Pillar): React.CSSProperties {
  const accent =
    pillar === "Design"
      ? "var(--accent-design)"
      : pillar === "Automate"
      ? "var(--accent-automate)"
      : "var(--accent-grow)";
  const rgb =
    pillar === "Design"
      ? "139, 92, 246"
      : pillar === "Automate"
      ? "59, 130, 246"
      : "16, 185, 129";
  return {
    padding: "6px 14px",
    borderRadius: 999,
    border: `1px solid ${accent}`,
    background: `rgba(${rgb}, 0.08)`,
    color: accent,
  };
}

export default function Approach({ entries }: { entries: Entry[] }) {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(245,245,247,0.10)",
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
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
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
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
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
                ease: ease.outQuart,
                delay: reduce ? 0 : 0.15 + i * 0.1,
              }}
              style={{
                padding: "36px 32px",
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
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
                  className="type-eyebrow"
                  style={{
                    color: "var(--text-primary)",
                    textTransform: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="type-eyebrow"
                  style={pillarChipStyle(entry.pillar)}
                >
                  {entry.pillar}
                </span>
              </div>
              <p
                className="type-body"
                style={{
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
