import { motion, useReducedMotion } from "motion/react";
import { ease, spring } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import PillHl from "./PillHl";
import HeroSignature from "./HeroSignature";

const TRUST = ["CG Walls & Floors", "CareerClarity AI", "SIFT", "CadenceStack"];

// Choreography timeline (seconds from mount)
const T = {
  eyebrow: 0.3,
  line1: 0.5,
  line2: 0.7,
  line3: 0.9,
  pillChip: 1.3,
  kicker: 1.5,
  ctaPrimary: 1.7,
  ctaSecondary: 1.78,
  tickerFade: 1.9,
  tickerUnderline: 2.0,
  tickerLabels: 2.1,
};

const LINE_1 = "The studio for";
const LINE_2 = "businesses that want";

function LineReveal({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 1 : 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: reduce ? 0 : delay,
          duration: reduce ? 0.01 : 0.8,
          ease: ease.outExpo,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function PillChipEmphasis({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      style={{ display: "inline-block", transformOrigin: "center" }}
      initial={{ scaleX: reduce ? 1 : 0.92, opacity: reduce ? 1 : 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={
        reduce
          ? { duration: 0.01 }
          : { delay, ...spring.snappy }
      }
    >
      {children}
    </motion.span>
  );
}

const trustContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: T.tickerLabels,
      staggerChildren: 0.06,
    },
  },
};

const trustLabel = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.outQuart } },
};

const trustLabelReduce = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const reduce = useReducedMotion();

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
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <HeroSignature />

      <div className="relative z-10 max-w-[1100px]">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0.01 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : T.eyebrow,
          }}
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

        {/* Display headline — three lines, mask-reveal each */}
        <h1
          className="type-display-xl mx-auto max-w-[1000px]"
          style={{
            color: "var(--color-ink)",
            marginBottom: 56,
            lineHeight: 1.0,
          }}
        >
          <LineReveal delay={T.line1}>{LINE_1}</LineReveal>
          <LineReveal delay={T.line2}>{LINE_2}</LineReveal>
          <LineReveal delay={T.line3}>
            <span>to look </span>
            <PillChipEmphasis delay={T.pillChip}>
              <PillHl>serious</PillHl>
            </PillChipEmphasis>
            <span>.</span>
          </LineReveal>
        </h1>

        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : T.kicker,
          }}
          className="mx-auto max-w-[620px]"
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--color-muted)",
            marginBottom: 72,
          }}
        >
          Averr Studios designs premium websites, builds AI automations, and runs
          the marketing engines for small and mid-market businesses across the GTA.
        </motion.p>

        {/* CTAs — individual delays for stagger */}
        <div className="inline-flex flex-wrap justify-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce
                ? { duration: 0.01 }
                : { delay: T.ctaPrimary, ...spring.snappy }
            }
            style={{ display: "inline-flex" }}
          >
            <MagneticCTA to="/contact" variant="primary">
              Book a discovery call
            </MagneticCTA>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce
                ? { duration: 0.01 }
                : { delay: T.ctaSecondary, ...spring.snappy }
            }
            style={{ display: "inline-flex" }}
          >
            <MagneticCTA to="/work" variant="ghost">
              See our work
            </MagneticCTA>
          </motion.div>
        </div>

        {/* Trust bar — container fade + underline draw + label stagger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduce ? 0.01 : 0.4,
            ease: ease.outQuart,
            delay: reduce ? 0 : T.tickerFade,
          }}
          className="relative z-10 flex max-w-[800px] flex-wrap items-center justify-center gap-10 pt-10"
          style={{
            marginTop: 96,
            position: "relative",
          }}
        >
          {/* Underline draws left-to-right */}
          <motion.div
            aria-hidden
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: reduce ? 0.01 : 0.6,
              ease: ease.outQuart,
              delay: reduce ? 0 : T.tickerUnderline,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(20,20,18,0.10)",
              transformOrigin: "left",
            }}
          />

          <motion.span
            variants={reduce ? trustLabelReduce : trustLabel}
            initial="hidden"
            animate="visible"
            transition={{
              duration: reduce ? 0.01 : 0.4,
              ease: ease.outQuart,
              delay: reduce ? 0 : T.tickerLabels,
            }}
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
            }}
          >
            Recent work
          </motion.span>

          <motion.div
            variants={reduce ? undefined : trustContainer}
            initial="hidden"
            animate="visible"
            className="contents"
          >
            {TRUST.map((name) => (
              <motion.span
                key={name}
                variants={reduce ? trustLabelReduce : trustLabel}
                className="font-display font-medium transition-opacity duration-300 hover:opacity-100"
                style={{
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  color: "var(--color-ink-soft)",
                  opacity: 0.6,
                }}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
