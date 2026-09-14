import { motion, useReducedMotion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

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
          //_03 · what we built
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
                ease: EASE,
                delay: reduce ? 0 : 0.05 * i,
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 20,
                alignItems: "start",
                padding: "22px 0",
                borderBottom: "1px solid rgba(20,20,18,0.08)",
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
              transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
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
              transition={{ duration: reduce ? 0.01 : 0.55, ease: EASE, delay: 0.1 }}
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
                    border: "1px solid rgba(20,20,18,0.14)",
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
