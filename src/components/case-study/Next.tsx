import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";

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
          gridTemplateColumns: "140px 1fr",
          gap: 40,
          alignItems: "start",
        }}
        className="next-grid"
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)" }}
        >
          //_06 · what's next
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.1,
            }}
            className="type-body-lg"
            style={{
              color: "var(--color-ink-soft)",
              maxWidth: 900,
              marginBottom: 40,
            }}
          >
            {text}
          </motion.p>

          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.25,
            }}
            style={{ display: "inline-flex", gap: 12, flexWrap: "wrap" }}
          >
            <MagneticCTA to="/contact" variant="primary">
              Book a discovery call
            </MagneticCTA>
            <MagneticCTA to="/work" variant="ghost">
              See related work
            </MagneticCTA>
          </motion.div>
        </div>
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
