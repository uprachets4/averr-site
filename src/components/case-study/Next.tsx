import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { ease } from "../../lib/motion";
import { ReadFill } from "./ReadFill";

export default function Next({ text, tint }: { text: string; tint?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  return (
    <section
      id={SECTIONS.next.id}
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 0",
        borderTop: "1px solid var(--hair)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: "var(--container-wide)",
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
          data-section-heading
          style={{ color: "var(--color-muted)" }}
        >
          {eyebrowFor(SECTIONS.next)}
        </motion.div>

        <div ref={ref}>
          <ReadFill
            text={text}
            progress={scrollYProgress}
            reduce={!!reduce}
            tint={tint}
            className="type-body-lg"
            style={{ color: "var(--color-ink-soft)", maxWidth: 900 }}
          />
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
