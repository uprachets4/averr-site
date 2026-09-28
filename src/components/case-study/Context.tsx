import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { FillWords, useFillVar } from "./ReadFill";
import { ease } from "../../lib/motion";

/**
 * Context — the paragraphs fill word by word as they cross the reading line.
 *
 * Performance contract: ONE scroll-derived custom property per paragraph
 * (--p, 0 → 1). Every word is a span carrying its index (--i) and the
 * paragraph's word count (--n); CSS derives each word's opacity from those
 * three numbers. No per-word MotionValues and no per-word listeners — a
 * whole paragraph costs a single style write per frame.
 *
 * The word spans are aria-hidden with the real sentence in a visually
 * hidden copy beside them, so assistive tech reads the paragraph once, as
 * prose, rather than word by word.
 */
export default function Context({
  paragraphs,
  tint,
}: {
  paragraphs: string[];
  tint?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id={SECTIONS.context.id}
      style={{
        backgroundColor: "var(--color-bg)",
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
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          data-section-heading
          style={{ color: "var(--color-muted)", marginBottom: 64 }}
        >
          {eyebrowFor(SECTIONS.context)}
        </motion.div>

        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {paragraphs.map(function row(p, i) {
            return (
              <ContextRow
                key={i}
                index={i}
                last={i === paragraphs.length - 1}
                paragraph={p}
                tint={tint || "var(--color-ink)"}
                reduce={!!reduce}
              />
            );
          })}
        </ol>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .context-row { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </section>
  );
}

function ContextRow({
  index,
  last,
  paragraph,
  tint,
  reduce,
}: {
  index: number;
  last: boolean;
  paragraph: string;
  tint: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // the reading line sits around 60% of the viewport: a paragraph starts
    // filling as its top passes it and completes as its last line does
    offset: ["start 0.8", "end 0.45"],
  });
  const attach = useFillVar(scrollYProgress, reduce);

  return (
    <li
      ref={ref}
      className="context-row read-fill"
      style={
        {
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 60,
          alignItems: "start",
          padding: "56px 0",
          borderBottom: last ? "none" : "1px solid var(--hair)",
          ["--tint" as string]: tint,
        } as React.CSSProperties
      }
    >
      <div
        className="type-display-l read-fill__num"
        style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1 }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <p
        className="type-body-lg"
        style={{ color: "var(--color-ink)", maxWidth: 780, margin: 0 }}
      >
        <FillWords text={paragraph} attach={attach} />
      </p>
    </li>
  );
}
