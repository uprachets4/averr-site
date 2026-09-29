import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import { NOT_DOING, splitRefusal } from "../../data/servicesProcess";

/**
 * "Some things we say no to" — struck as you read.
 *
 * Each line enters as it crosses the reading line; a 2px parch rule then
 * draws left → right across the phrase being refused, and that phrase alone
 * drops to 0.45. The rest of the sentence stays at full weight, so the
 * sentence still reads as a sentence and the strike is emphasis, not damage.
 *
 * Accessibility: the three spans concatenate back to the exact source
 * sentence, so the accessible text is unchanged. Only the rule itself is
 * decorative and hidden — a screen reader never hears about a strike.
 *
 * Runs once. `viewport={{ once: true }}` on the row drives both the entrance
 * and the strike, so scrolling back up does not redraw it.
 */
export default function NoList() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "140px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

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
          style={{ color: "var(--color-muted-l)", marginBottom: 24 }}
        >
          //_04 · what we don't do
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0.01 : 0.7,
            ease: ease.outQuart,
            delay: 0.1,
          }}
          className="type-h2"
          style={{ marginBottom: 64, maxWidth: 900 }}
        >
          Some <span className="fade-h-dark">things we say no to.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NOT_DOING.map(function line(refusal, i) {
            return (
              <RefusalRow
                key={refusal.text}
                refusal={refusal}
                index={i}
                reduce={reduce ?? false}
              />
            );
          })}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: 0.5,
          }}
          className="type-body"
          style={{
            marginTop: 48,
            color: "var(--color-muted-l)",
            maxWidth: 560,
          }}
        >
          Averr is a boutique studio. We take a small number of projects each
          quarter and finish them.
        </motion.p>
      </div>
    </section>
  );
}

function RefusalRow({
  refusal,
  index,
  reduce,
}: {
  refusal: (typeof NOT_DOING)[number];
  index: number;
  reduce: boolean;
}) {
  const { before, struck, after } = splitRefusal(refusal);
  // The rule waits for the line to have arrived before it draws.
  const strikeDelay = reduce ? 0 : 0.35 + index * 0.1;

  return (
    <motion.li
      initial="rest"
      whileInView="struck"
      viewport={{ once: true, amount: 0.6 }}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(24px, 2.6vw, 36px)",
        fontWeight: 500,
        letterSpacing: "-0.018em",
        lineHeight: 1.25,
        padding: "28px 0",
        borderTop: "1px solid rgba(237,231,218,0.14)",
        color: "var(--color-parch)",
      }}
      variants={{
        rest: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 },
        struck: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.1 + index * 0.1,
          },
        },
      }}
    >
      {before}
      {/*
        The rule is painted as a background on the phrase itself rather than
        as an absolutely-positioned bar. A bar can only ever draw one line,
        and these phrases wrap at narrow widths — "projects we can't ship in
        90 days" takes three lines at 375. `box-decoration-break: clone`
        gives every wrapped fragment its own full-width rule.

        It costs a paint-driven property instead of a transform, which for a
        one-shot 600ms draw on three short spans is the right trade against
        being visibly wrong on mobile.
      */}
      <motion.span
        style={{
          display: "inline",
          backgroundImage:
            "linear-gradient(var(--color-parch), var(--color-parch))",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0.62em",
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
        variants={{
          rest: {
            opacity: 1,
            backgroundSize: reduce ? "100% 2px" : "0% 2px",
          },
          struck: {
            opacity: 0.45,
            backgroundSize: "100% 2px",
            transition: {
              duration: reduce ? 0.01 : duration.slow,
              ease: ease.outQuart,
              delay: strikeDelay,
            },
          },
        }}
      >
        {struck}
      </motion.span>
      {after}
    </motion.li>
  );
}
