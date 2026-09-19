import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import PillHl from "./PillHl";


const TRUST = ["CG Walls & Floors", "CareerClarity AI", "SIFT", "CadenceStack"];
const HEADLINE_WORDS = "The studio for businesses that want to look".split(" ");

const WORD_STAGGER = 0.09;
const WORD_START = 0.5;
const PILL_DELAY = WORD_START + HEADLINE_WORDS.length * WORD_STAGGER + 0.05;
const SUBHEAD_DELAY = PILL_DELAY + 0.35;
const CTA_DELAY = SUBHEAD_DELAY + 0.2;
const TRUST_DELAY = CTA_DELAY + 0.2;


export default function Hero() {
  const reduce = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.01 : 0.55,
        ease: ease.outQuart,
        delay: reduce ? 0 : WORD_START + i * WORD_STAGGER,
      },
    }),
  };

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-36 text-center sm:px-10 sm:pt-40"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(245,245,247,0.03), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(245,245,247,0.03), transparent 60%)",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div className="relative z-10 max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: reduce ? 0 : 0.4 }}
          className="mb-10 inline-flex items-center gap-2.5 font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--color-muted)",
          }}
        >
          <span
            className="h-px w-5"
            style={{ backgroundColor: "currentColor", opacity: 0.6 }}
          />
          A boutique studio · Toronto
          <span
            className="h-px w-5"
            style={{ backgroundColor: "currentColor", opacity: 0.6 }}
          />
        </motion.div>

        <h1
          className="type-display-xl mx-auto max-w-[1000px]"
          style={{
            marginBottom: 56,
            lineHeight: 1.0,
            color: "var(--text-primary)",
          }}
        >
          {HEADLINE_WORDS.map((w, i) => (
            <motion.span
              key={w + i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="inline-block whitespace-pre"
            >
              {w + " "}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduce ? 0.01 : 0.5,
              ease: ease.bounce,
              delay: reduce ? 0 : PILL_DELAY,
            }}
            className="inline-block"
          >
            <PillHl>serious</PillHl>
          </motion.span>
          .
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : SUBHEAD_DELAY }}
          className="mx-auto max-w-[620px]"
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--text-muted)",
            marginBottom: 72,
          }}
        >
          Averr Studios designs premium websites, builds AI automations, and runs
          the marketing engines for small and mid-market businesses across the GTA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : CTA_DELAY }}
          className="inline-flex flex-wrap justify-center gap-3"
        >
          <MagneticCTA to="/contact" variant="primary">
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA to="/work" variant="ghost">
            See our work
          </MagneticCTA>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : TRUST_DELAY }}
          className="relative z-10 flex max-w-[800px] flex-wrap items-center justify-center gap-10 pt-10"
          style={{
            marginTop: 96,
            borderTop: "1px solid var(--border)",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
            }}
          >
            Recent work
          </span>
          {TRUST.map((name) => (
            <span
              key={name}
              className="font-display font-medium transition-opacity duration-300 hover:opacity-100"
              style={{
                fontSize: 15,
                letterSpacing: "-0.01em",
                color: "var(--color-ink-soft)",
                opacity: 0.6,
              }}
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
