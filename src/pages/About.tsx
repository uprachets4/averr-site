import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import MonogramMark from "../components/MonogramMark";
import ProcessTimeline from "../components/ProcessTimeline";

/* ═══════════════════════════════════════════════════════════════
   Character-by-character reveal helper
   ═══════════════════════════════════════════════════════════════ */

/* Word-preserving character reveal — outer span per word has
 * whiteSpace:nowrap so the browser wraps at word boundaries only.
 * Each character inside a word is a motion.span with a globally
 * staggered entrance. Regular text-node spaces between words let
 * the browser handle line breaks naturally.
 */
function splitTextForReveal(text: string): string[][] {
  return text.split(" ").map(function toChars(word) {
    return Array.from(word);
  });
}

const REVEAL_STAGGER = 0.02;
const REVEAL_PER_CHAR_DURATION = 0.35;

function CharReveal({
  text,
  delay = 0,
  className,
  style,
  as = "span",
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const words = splitTextForReveal(text);
  const Tag: React.ElementType = motion[
    as as keyof typeof motion
  ] as React.ElementType;
  let globalIdx = -1;
  return (
    <Tag className={className} style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {chars.map(function drawChar(ch, ci) {
                globalIdx++;
                const gi = globalIdx;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: reduce ? 1 : 0,
                      y: reduce ? 0 : 20,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : REVEAL_PER_CHAR_DURATION,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : delay + gi * REVEAL_STAGGER,
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
    </Tag>
  );
}

function CharRevealInView({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const words = splitTextForReveal(text);
  let globalIdx = -1;
  return (
    <span className={className} style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {chars.map(function drawChar(ch, ci) {
                globalIdx++;
                const gi = globalIdx;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: reduce ? 1 : 0,
                      y: reduce ? 0 : 20,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: reduce ? 0 : REVEAL_PER_CHAR_DURATION,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : gi * REVEAL_STAGGER,
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

/* ═══════════════════════════════════════════════════════════════
   Band 1 — The Monogram Moment
   ═══════════════════════════════════════════════════════════════ */

function MonogramHero() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        padding: "120px 40px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="about-hero"
    >
      {/* Warm gradient wash — slow rotation */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "90vmin",
          height: "90vmin",
          marginTop: "-45vmin",
          marginLeft: "-45vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.6), transparent 60%)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div
        className="grain-light"
        aria-hidden="true"
        style={{ opacity: 0.05 }}
      />

      {/* Ambient brand fragments */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--color-brand-navy)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 20, 0, -18, 0], y: [0, -14, 12, 0, 0] }
        }
        transition={{ duration: 40, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 24,
          height: 24,
          border: "1px solid var(--color-parch)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -22, 0, 18, 0], y: [0, 16, -12, 0, 0] }
        }
        transition={{ duration: 55, repeat: Infinity, ease: ease.inOut }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 32,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.15,
          }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)" }}
        >
          The Studio · Founder-led
        </motion.div>

        <MonogramMark variant="hero" />

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 2.05,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            className="type-h3"
            style={{
              color: "var(--color-brand-navy)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Prachets Upadhyay
          </div>
          <div
            className="type-eyebrow"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Founder, Averr Studios · Envisioning Future
          </div>
        </motion.div>

        <CharReveal
          text="The studio for founders who care how they show up."
          delay={2.2}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            maxWidth: "22ch",
            margin: 0,
          }}
          as="span"
        />

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 3.4,
          }}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <MagneticCTA to="/work" variant="primary">
            See the work
          </MagneticCTA>
          <MagneticCTA to="/contact" variant="ghost">
            Book a call
          </MagneticCTA>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-hero { min-height: 90vh; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 2 — Four principles
   ═══════════════════════════════════════════════════════════════ */

type Principle = {
  n: string;
  title: string;
  body: string;
  variant: "stroke-fill" | "scale-up" | "skew-straighten" | "slow-rotate";
  numeralPosition: "top-right" | "top-left" | "center";
  bg: "cream" | "alt" | "dark";
};

const PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Craft over checklists.",
    body: "We don't ship template sections because “websites have this section.” Every element earns its place. Every animation serves comprehension or delight. If a section could sit on a ThemeForest template unchanged, it gets rebuilt.",
    variant: "stroke-fill",
    numeralPosition: "top-right",
    bg: "cream",
  },
  {
    n: "02",
    title: "Direction first, build second.",
    body: "Before any code is written, you get a design direction — palette, typography, signature moves, interaction plan. One checkpoint. One decision. Then the studio builds independently. No approval-by-committee.",
    variant: "scale-up",
    numeralPosition: "top-left",
    bg: "alt",
  },
  {
    n: "03",
    title: "Motion as language.",
    body: "Every scroll frame, every hover, every page load is choreographed. Motion tells the visitor how to read the site. When it doesn’t serve that, it doesn’t ship.",
    variant: "skew-straighten",
    numeralPosition: "top-right",
    bg: "cream",
  },
  {
    n: "04",
    title: "A site that ages well.",
    body: "Trend-driven design ages in 18 months. The studio designs for typography, spacing, and interaction fundamentals that hold up in three years. Every project is built to be portfolio-worthy for the studio and for the client.",
    variant: "slow-rotate",
    numeralPosition: "center",
    bg: "dark",
  },
];

function PrinciplesBand() {
  return (
    <>
      {PRINCIPLES.map(function drawPrinciple(p) {
        return <PrincipleSection key={p.n} principle={p} />;
      })}
    </>
  );
}

function PrincipleSection({ principle }: { principle: Principle }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bg =
    principle.bg === "dark"
      ? "var(--color-dark)"
      : principle.bg === "alt"
        ? "var(--color-bg-alt)"
        : "var(--color-bg)";

  const inkColor =
    principle.bg === "dark" ? "var(--color-parch)" : "var(--color-ink)";
  const softColor =
    principle.bg === "dark"
      ? "var(--color-muted-l)"
      : "var(--color-ink-soft)";
  const ruleColor =
    principle.bg === "dark"
      ? "var(--color-parch)"
      : "#B18544";

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: bg,
        minHeight: "100vh",
        padding: "120px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="principle-section"
    >
      {principle.bg === "dark" ? (
        <div className="grain-dark" aria-hidden="true" />
      ) : (
        <div className="grain-light" aria-hidden="true" />
      )}

      <NumeralBackdrop
        principle={principle}
        scrollYProgress={scrollYProgress}
        reduce={!!reduce}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "60ch",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: softColor,
            marginBottom: 32,
          }}
        >
          Principle {principle.n}
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: inkColor, marginBottom: 40 }}
        >
          <CharRevealInView
            text={principle.title}
            style={{ color: inkColor }}
          />
        </div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.2,
          }}
          className="type-body-lg"
          style={{
            color: principle.bg === "dark" ? "var(--color-muted-l)" : "var(--color-ink)",
            marginBottom: 40,
          }}
        >
          {principle.body}
        </motion.p>

        <motion.hr
          aria-hidden
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.6,
          }}
          style={{
            width: 40,
            height: 2,
            background: ruleColor,
            border: "none",
            margin: "0 auto",
            transformOrigin: "left",
            opacity: principle.bg === "dark" ? 0.9 : 1,
          }}
        />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .principle-section { min-height: 90vh; padding: 96px 24px; }
        }
      `}</style>
    </section>
  );
}

function NumeralBackdrop({
  principle,
  scrollYProgress,
  reduce,
}: {
  principle: Principle;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const numeralColor =
    principle.bg === "dark" ? "var(--color-parch)" : "var(--color-ink)";

  // 01 — stroke-then-fill grow across scroll progress
  const filledPeak = principle.bg === "dark" ? 0.22 : 0.18;
  const strokeFillOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.7],
    [0, filledPeak]
  );
  const strokeOnlyOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.7],
    [0, 0.35, 0]
  );

  // 02 — scale-up 0.6 → 1.0
  const scale = useTransform(scrollYProgress, [0.15, 0.55], [0.6, 1]);

  // 03 — skew Y 12° → 0° over 0.2–0.8
  const skewDeg = useTransform(scrollYProgress, [0.2, 0.8], [12, 0]);
  const skewTransform = useTransform(skewDeg, (v) => `skewY(${v}deg)`);

  // 04 — continuous rotation handled by motion animate loop

  // Positioning
  const positionStyle: React.CSSProperties =
    principle.numeralPosition === "top-right"
      ? { position: "absolute", top: "clamp(24px, 6vh, 96px)", right: 40 }
      : principle.numeralPosition === "top-left"
        ? { position: "absolute", top: "clamp(24px, 6vh, 96px)", left: 40 }
        : {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          };

  const base: React.CSSProperties = {
    ...positionStyle,
    fontFamily: "var(--font-display), Georgia, serif",
    fontSize: "clamp(160px, 28vw, 320px)",
    fontWeight: 700,
    lineHeight: 1,
    color: numeralColor,
    pointerEvents: "none",
    zIndex: 0,
    userSelect: "none",
  };

  switch (principle.variant) {
    case "stroke-fill":
      return (
        <div style={{ ...base, opacity: 1, position: base.position }}>
          <svg
            viewBox="0 0 300 220"
            style={{
              position: "absolute",
              inset: 0,
              width: "1em",
              height: "0.75em",
              overflow: "visible",
            }}
            aria-hidden
          >
            <motion.text
              x="150"
              y="180"
              textAnchor="middle"
              fontFamily="var(--font-display), Georgia, serif"
              fontSize={260}
              fontWeight={700}
              fill={numeralColor}
              style={{
                opacity: reduce
                  ? principle.bg === "dark"
                    ? 0.22
                    : 0.18
                  : strokeFillOpacity,
              }}
            >
              {principle.n}
            </motion.text>
            <motion.text
              x="150"
              y="180"
              textAnchor="middle"
              fontFamily="var(--font-display), Georgia, serif"
              fontSize={260}
              fontWeight={700}
              fill="transparent"
              stroke={numeralColor}
              strokeWidth={2}
              style={{ opacity: reduce ? 0 : strokeOnlyOpacity }}
            >
              {principle.n}
            </motion.text>
          </svg>
        </div>
      );
    case "scale-up":
      return (
        <motion.div
          aria-hidden
          style={{
            ...base,
            opacity: principle.bg === "dark" ? 0.22 : 0.18,
            scale: reduce ? 1 : scale,
            transformOrigin: "top left",
          }}
        >
          {principle.n}
        </motion.div>
      );
    case "skew-straighten":
      return (
        <motion.div
          aria-hidden
          animate={
            reduce
              ? undefined
              : {
                  rotate: [0, -0.5, 0.5, 0],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: ease.inOut,
          }}
          style={{
            ...base,
            opacity: principle.bg === "dark" ? 0.22 : 0.18,
            transform: reduce ? "none" : (skewTransform as unknown as string),
          }}
        >
          {principle.n}
        </motion.div>
      );
    case "slow-rotate":
      return (
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            ...base,
            opacity: principle.bg === "dark" ? 0.22 : 0.18,
          }}
        >
          {principle.n}
        </motion.div>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════
   Band 3 — How we work
   ═══════════════════════════════════════════════════════════════ */

function HowWeWorkBand() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg-alt)",
        padding: "160px 40px",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{
              color: "var(--color-muted)",
              marginBottom: 24,
            }}
          >
            How we work
          </motion.div>
          <motion.h2
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.1,
            }}
            className="type-display-l"
            style={{
              color: "var(--color-ink)",
              margin: 0,
              maxWidth: 900,
              marginInline: "auto",
            }}
          >
            Direction. Design. Build. Refine. Ship.
          </motion.h2>
          <motion.p
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.25,
            }}
            className="type-body"
            style={{
              color: "var(--color-ink-soft)",
              marginTop: 24,
              maxWidth: 640,
              marginInline: "auto",
            }}
          >
            Every project runs through the same five stages. No surprises.
          </motion.p>
        </div>

        <ProcessTimeline />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 4 — The founder card
   ═══════════════════════════════════════════════════════════════ */

type Chip = { label: string; tooltip: string };

const FOUNDER_CHIPS: Chip[] = [
  {
    label: "Design",
    tooltip: "Marketing sites, SaaS product design, dashboards",
  },
  {
    label: "Automate",
    tooltip: "AI agents, workflow automation, CRM integration",
  },
  {
    label: "Grow",
    tooltip: "Social + organic content, paid ads, attribution",
  },
];

function FounderBand() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        padding: "160px 40px 96px",
      }}
    >
      <div className="grain-light" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-ink-soft)",
            marginBottom: 40,
          }}
        >
          Who's behind this
        </motion.div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.7,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.1,
          }}
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: 40,
            border: "1px solid rgba(20,20,18,0.08)",
            borderRadius: 12,
            background: "var(--color-bg)",
            boxShadow: "0 12px 40px rgba(20,20,18,0.06)",
          }}
        >
          <div
            className="founder-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 48,
              alignItems: "start",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FounderMark />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <h2
                className="type-h2"
                style={{
                  color: "var(--color-ink)",
                  margin: 0,
                }}
              >
                Prachets Upadhyay
              </h2>
              <div
                className="type-eyebrow"
                style={{ color: "var(--color-ink-soft)" }}
              >
                Founder + Design Engineer
              </div>
              <p
                className="type-body"
                style={{
                  color: "var(--color-ink)",
                  maxWidth: "60ch",
                  margin: 0,
                }}
              >
                Toronto-based design engineer with a background spanning B2B
                SaaS sales at Google, frontend development, and AI workflow
                automation. Previously co-founded KlaasX Edutech (15-person
                team, 150+ institutions). Started Averr Studios to build the
                kind of client websites that actually earn their portfolio
                slot.
              </p>
              <FounderChips reduce={!!reduce} />
              <FounderLinks />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.4,
          }}
          className="type-small"
          style={{
            color: "var(--color-ink-soft)",
            fontStyle: "italic",
            marginTop: 28,
          }}
        >
          Grid absorbs future collaborators without a rewrite.
        </motion.p>
      </div>
    </section>
  );
}

function FounderMark() {
  return (
    <div
      style={{
        position: "relative",
        width: 240,
        height: 240,
        background: "var(--color-bg)",
        border: "1px solid rgba(20,20,18,0.10)",
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <MonogramMark variant="mini" />
    </div>
  );
}

function FounderChips({ reduce }: { reduce: boolean }) {
  const [hasFinePointer, setHasFinePointer] = useState(false);
  useEffect(function detect() {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasFinePointer(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setHasFinePointer(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {FOUNDER_CHIPS.map(function drawChip(c, i) {
        return (
          <FounderChip
            key={c.label}
            chip={c}
            index={i}
            reduce={reduce}
            enableTooltip={hasFinePointer}
          />
        );
      })}
    </div>
  );
}

function FounderChip({
  chip,
  index,
  reduce,
  enableTooltip,
}: {
  chip: Chip;
  index: number;
  reduce: boolean;
  enableTooltip: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30% 0px" }}
      transition={{
        duration: reduce ? 0.001 : 0.4,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.6 + index * 0.08,
      }}
      onHoverStart={function h() {
        setHovered(true);
      }}
      onHoverEnd={function h() {
        setHovered(false);
      }}
      className="type-eyebrow"
      style={{
        position: "relative",
        padding: "8px 14px",
        borderRadius: 100,
        border: hovered
          ? "1px solid var(--color-ink)"
          : "1px solid rgba(20,20,18,0.6)",
        background: hovered ? "var(--color-ink)" : "transparent",
        color: hovered ? "var(--color-parch)" : "var(--color-ink)",
        cursor: enableTooltip ? "help" : "default",
        transform: hovered && !reduce ? "translateY(-2px)" : "translateY(0)",
        transitionProperty: "background-color, border-color, color, transform",
        transitionDuration: `${duration.fast * 1000}ms`,
        transitionTimingFunction: `cubic-bezier(${ease.outQuart.join(",")})`,
      }}
    >
      {chip.label}
      {enableTooltip && hovered ? (
        <motion.div
          role="tooltip"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: ease.outQuart }}
          className="type-small"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--color-bg)",
            color: "var(--color-ink)",
            border: "1px solid rgba(20,20,18,0.18)",
            borderRadius: 6,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(20,20,18,0.10)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {chip.tooltip}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function FounderLinks() {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        marginTop: 8,
      }}
    >
      <UnderlineLink
        href="https://www.linkedin.com/in/prachetsupadhyay"
        label="LinkedIn"
      />
      <UnderlineLink
        href="https://prachetsupadhyay.com"
        label="Portfolio"
      />
    </div>
  );
}

function UnderlineLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={function h() {
        setHovered(true);
      }}
      onMouseLeave={function h() {
        setHovered(false);
      }}
      className="type-small"
      style={{
        position: "relative",
        color: "var(--color-ink)",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}
      <span aria-hidden>↗</span>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -3,
          height: 1,
          background: "currentColor",
          transform: `scaleX(${hovered ? 1 : 0})`,
          transformOrigin: "left",
          transition: `transform ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
        }}
      />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 5 — Closing CTA
   ═══════════════════════════════════════════════════════════════ */

function ClosingCTA() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        minHeight: "85vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="grain-dark" aria-hidden="true" style={{ opacity: 0.5 }} />

      {/* Warm accent glow */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vmin",
          height: "80vmin",
          marginTop: "-40vmin",
          marginLeft: "-40vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : {
                x: [-30, 30, -30],
                y: [-20, 20, -20],
              }
        }
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: ease.inOut,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-parch)",
            opacity: 0.6,
            marginBottom: 32,
          }}
        >
          Start here
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--color-parch)", marginBottom: 48 }}
        >
          <CharRevealInView
            text="Ready to build a site that earns its place?"
            style={{ color: "var(--color-parch)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.6,
          }}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <MagneticCTA to="/contact" variant="primary">
            Book a call
          </MagneticCTA>
          <MagneticCTA to="/work" variant="ghost">
            See the work
          </MagneticCTA>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function About() {
  useEffect(function scrollTopAndTitle() {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "About — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <MonogramHero />
      <PrinciplesBand />
      <HowWeWorkBand />
      <FounderBand />
      <ClosingCTA />
    </>
  );
}
