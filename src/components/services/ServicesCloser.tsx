import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import { CharRevealInView } from "../CharReveal";

const EMAIL = "prachets@averrstudios.com";

/**
 * The /services closer.
 *
 * Replaces the shared `FinalCTA` on this route only. Two reasons: the
 * shared one carries the `PillHl` "actually", which locked rule 9 wants
 * confined to home and the 404; and a page that has just walked someone
 * through three services should close on "which of these is mine?", not on
 * the same line home closes with.
 *
 * Dark, because the calendar above it lands on cream-warm and the chapter
 * boundaries alternate. The page's end tone is declared dark to match, so
 * the footer reveals over the right ground.
 */
export default function ServicesCloser() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "160px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 900px 560px at 50% 45%, rgba(237,231,218,0.07), transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted-l)", marginBottom: 32 }}
        >
          //_06 · start here
        </motion.div>

        <CharRevealInView
          className="type-h2"
          style={{
            color: "var(--color-parch)",
            marginBottom: 28,
            display: "block",
          }}
          segments={[
            { text: "Not sure " },
            { text: "which one", accent: true },
            { text: " you need?" },
          ]}
        />

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: 0.15,
          }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted-l)",
            maxWidth: 620,
            margin: "0 auto 48px",
          }}
        >
          That's what the first call is for. Twenty minutes, no deck, an
          honest answer about where to start.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: 0.25,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <MagneticCTA to="/contact" variant="primary" tone="dark">
            Book a discovery call
          </MagneticCTA>

          <a
            href={`mailto:${EMAIL}`}
            className="type-small"
            style={{
              color: "var(--color-muted-l)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            {EMAIL}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
