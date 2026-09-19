import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";


export default function Inventory({
  items,
  stack,
}: {
  items: string[];
  stack: string[];
}) {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
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
          //_03 · what we built
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
          What <span className="fade-h">actually shipped.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 64px" }}>
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reduce ? 0.01 : 0.55,
                ease: ease.outQuart,
                delay: reduce ? 0 : 0.05 * i,
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 20,
                alignItems: "start",
                padding: "22px 0",
                borderBottom: "1px solid rgba(245,245,247,0.08)",
                fontSize: 17,
                lineHeight: 1.55,
                color: "var(--color-ink)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "var(--color-muted-2)",
                  paddingTop: 5,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>

        {stack.length > 0 ? (
          <div>
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
              className="type-eyebrow"
              style={{
                color: "var(--color-muted-2)",
                marginBottom: 20,
              }}
            >
              Stack
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: reduce ? 0.01 : 0.55, ease: ease.outQuart, delay: 0.1 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
            >
              {stack.map((label) => (
                <span
                  key={label}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--color-ink-soft)",
                    border: "1px solid rgba(245,245,247,0.14)",
                    background: "transparent",
                  }}
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
