import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import type { CaseStudy } from "../../data/caseStudies";

const REVEAL_STAGGER = 0.02;
const REVEAL_PER_CHAR_DURATION = 0.35;

function CharRevealInView({ text, style }: { text: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  const words = text.split(" ").map(function toChars(w) {
    return Array.from(w);
  });
  let gi = -1;
  return (
    <span style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {chars.map(function drawChar(ch, ci) {
                gi++;
                const idx = gi;
                return (
                  <motion.span
                    key={ci}
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: reduce ? 0 : REVEAL_PER_CHAR_DURATION,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : idx * REVEAL_STAGGER,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

export default function Outcome({ text }: { text: CaseStudy["outcome"] }) {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "160px 40px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1000,
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
          style={{ color: "var(--color-muted-l)", marginBottom: 40 }}
        >
          //_05 · outcome
        </motion.div>

        <h2
          className="type-display-l"
          style={{
            color: "var(--color-parch)",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <CharRevealInView
            text={text.headline}
            style={{ color: "var(--color-parch)" }}
          />
        </h2>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: ease.outExpo,
            delay: reduce ? 0 : 0.2,
          }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted-l)",
            maxWidth: 800,
            margin: "40px auto 0",
          }}
        >
          {text.body}
        </motion.p>
      </div>
    </section>
  );
}
