import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";

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
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 64 }}
        >
          //_01 · context
        </motion.div>

        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {paragraphs.map((p, i) => (
            <ContextRow key={i} index={i} last={i === paragraphs.length - 1} paragraph={p} reduce={!!reduce} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ContextRow({
  index,
  last,
  paragraph,
  reduce,
}: {
  index: number;
  last: boolean;
  paragraph: string;
  reduce: boolean;
}) {
  return (
    <motion.li
      initial="rest"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={{
        rest: {},
        visible: {},
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 60,
        alignItems: "start",
        padding: "56px 0",
        borderBottom: last ? "none" : "1px solid rgba(20,20,18,0.10)",
      }}
      className="context-row"
    >
      <motion.div
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{
          duration: reduce ? 0 : 0.7,
          ease: ease.outExpo,
        }}
        className="type-display-l"
        style={{
          color: "var(--color-muted-2)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>
      <motion.p
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{
          duration: reduce ? 0 : 0.7,
          ease: ease.outQuart,
          delay: reduce ? 0 : 0.1,
        }}
        className="type-body-lg"
        style={{
          color: "var(--color-ink)",
          maxWidth: 780,
        }}
      >
        {paragraph}
      </motion.p>

      <style>{`
        @media (max-width: 720px) {
          .context-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </motion.li>
  );
}
