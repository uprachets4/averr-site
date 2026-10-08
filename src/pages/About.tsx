import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import MonogramMark from "../components/MonogramMark";
import ProcessTimeline from "../components/ProcessTimeline";
import { CharReveal, CharRevealInView } from "../components/CharReveal";
import GlowHorizon from "../components/about/GlowHorizon";
import PrinciplesTrack from "../components/about/PrinciplesTrack";
import FounderStatement from "../components/about/FounderStatement";
import { useDeclarePageEndTone } from "../lib/pageTone";

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
        backgroundColor: "var(--about-ground)",
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
            "radial-gradient(circle at 50% 50%, rgba(61,107,255,0.20), transparent 60%)",
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
        className="grain-dark"
        aria-hidden="true"
        style={{ opacity: 0.05 }}
      />

      {/* Ambient brand fragments — 5 total, varied primitives */}
      {/* 1. Circle outline, top-left */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: "8%",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--about-ink)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 20, 0, -18, 0], y: [0, -14, 12, 0, 0] }
        }
        transition={{ duration: 40, repeat: Infinity, ease: ease.inOut }}
      />
      {/* 2. Square outline, bottom-right */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 24,
          height: 24,
          border: "1px solid var(--about-ink)",
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
      {/* 3. Plus sign, top-right */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "14%",
          right: "10%",
          width: 20,
          height: 20,
          opacity: 0.2,
          pointerEvents: "none",
          color: "var(--about-ink)",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 14, 0, -14, 0], y: [0, 10, -10, 0, 0] }
        }
        transition={{ duration: 50, repeat: Infinity, ease: ease.inOut }}
      >
        <svg viewBox="0 0 20 20" fill="none" style={{ display: "block", width: "100%", height: "100%" }}>
          <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
      {/* 4. Small horizontal line, middle-left */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "6%",
          width: 40,
          height: 2,
          background: "var(--about-ink)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 18, 0, -12, 0], y: [0, -8, 8, 0, 0] }
        }
        transition={{ duration: 65, repeat: Infinity, ease: ease.inOut }}
      />
      {/* 5. Small filled dot, middle-right */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "48%",
          right: "6%",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--about-ink)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -12, 0, 12, 0], y: [0, 10, -10, 0, 0] }
        }
        transition={{ duration: 45, repeat: Infinity, ease: ease.inOut }}
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
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.15,
          }}
          className="type-eyebrow"
          style={{ color: "var(--about-body)" }}
        >
          The Studio · Founder-led
        </motion.div>

        <MonogramMark variant="hero" />

        <motion.div
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
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
              color: "var(--about-ink)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Prachets Upadhyay
          </div>
          <div
            className="type-eyebrow"
            style={{ color: "var(--about-body)" }}
          >
            Founder, Averr Studios · Envisioning Future
          </div>
        </motion.div>

        {/* The headline. Painted from the first frame per the hero LCP
            rule; its place in the ladder is kept because the monogram
            drawing above it is the non-text entrance these were always
            waiting on. type-accent nests INSIDE the size class (§5.33). */}
        <h1 className="type-display-2xl" style={{ color: "var(--about-ink)", margin: 0 }}>
          <CharReveal
            paint
            delay={reduce ? 0 : 2.2}
            segments={[{ text: "Small on " }, { text: "purpose.", accent: true }]}
          />
        </h1>

        {/* The old headline, kept verbatim as the subhead so no copy is
            lost. LCP element on mobile. */}
        <motion.p
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
            ease: ease.outQuart,
            delay: reduce ? 0 : 2.7,
          }}
          className="type-body-lg"
          style={{ color: "var(--about-body)", maxWidth: "34ch", margin: 0 }}
        >
          The studio for founders who care how they show up.
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
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
          <MagneticCTA to="/work" variant="primary" tone="dark">
            See the work
          </MagneticCTA>
          <MagneticCTA to="/contact" variant="ghost" tone="dark">
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

   The four stacked full-height bands became the principles
   playground in Session 18: one pinned stage, four panels on a
   horizontal track, each carrying a live demo of the principle it
   states. It lives in its own module because of the weight of those
   demos — components/about/PrinciplesTrack.tsx. The copy moved to
   data/principles.ts unchanged, grounds and all.
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Band 3 — How we work
   ═══════════════════════════════════════════════════════════════ */

function HowWeWorkBand() {
  const reduce = useReducedMotion();
  return (
    <section
      id="process"
      style={{
        position: "relative",
        backgroundColor: "var(--about-ground)",
        /* the gutter comes from --container-wide now, so the process
           line can run the full width the brief asks for */
        padding: "160px 0",
        scrollMarginTop: 96,
      }}
    >
      <div className="grain-dark" aria-hidden="true" />
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{
              color: "var(--about-body)",
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
              color: "var(--about-ink)",
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
              color: "var(--about-body)",
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
        backgroundColor: "var(--about-ground)",
        padding: "200px 0 140px",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      <div
        className="founder-band"
        style={{ position: "relative", zIndex: 2, maxWidth: "var(--container-wide)", margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--about-body)", marginBottom: 56 }}
        >
          Who{String.fromCharCode(39)}s behind this
        </motion.div>

        <div className="founder-row">
          {/* The mark holds the slot a photograph will take. No
              placeholder stands in for a photo that does not exist. */}
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
          >
            <FounderMark />
          </motion.div>

          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{
              duration: reduce ? 0 : duration.slow,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.1,
            }}
            style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}
          >
            <h2 className="type-display-l" style={{ color: "var(--about-ink)", margin: 0 }}>
              Prachets Upadhyay
            </h2>
            <div className="type-eyebrow" style={{ color: "var(--about-body)" }}>
              Founder + Design Engineer
            </div>

            <FounderStatement />

            <FounderChips reduce={!!reduce} />
            <FounderLinks />

            {/* kept verbatim from the old card — the brief changed one
                sentence of the bio and nothing else */}
            <motion.p
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart, delay: reduce ? 0 : 0.4 }}
              className="type-small"
              style={{ color: "var(--about-body)", fontStyle: "italic", marginTop: 10 }}
            >
              Grid absorbs future collaborators without a rewrite.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .founder-row {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .founder-row { grid-template-columns: 1fr; gap: 44px; }
        }
      `}</style>
    </section>
  );
}

/**
 * The slot a photograph will take. Until a real one exists the mark
 * holds it — a greyed-out silhouette or a stock face would be a lie
 * about what the studio has, so there is no placeholder.
 */
function FounderMark() {
  return (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 300,
        background: "var(--about-surface)",
        border: "1px solid var(--about-hair)",
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
          ? "1px solid var(--about-ink)"
          : "1px solid var(--about-body)",
        background: hovered ? "var(--about-ink)" : "transparent",
        color: hovered ? "var(--about-ground)" : "var(--about-ink)",
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
            background: "var(--about-surface)",
            color: "var(--about-ink)",
            border: "1px solid var(--about-hair-hi)",
            borderRadius: 6,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px var(--about-hair)",
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
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6, marginLeft: -12 }}>
      <MagneticCTA
        variant="text"
        size="sm"
        tone="dark"
        to="https://www.linkedin.com/in/prachetsupadhyay"
        ariaLabel="LinkedIn profile, opens in a new tab"
      >
        LinkedIn
      </MagneticCTA>
      <MagneticCTA
        variant="text"
        size="sm"
        tone="dark"
        to="https://prachetsupadhyay.com"
        ariaLabel="Portfolio, opens in a new tab"
      >
        Portfolio
      </MagneticCTA>
    </div>
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
        backgroundColor: "var(--about-ground)",
        color: "var(--about-ink)",
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
            "radial-gradient(circle at 50% 50%, rgba(61,107,255,0.16), transparent 60%)",
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
            color: "var(--about-ink)",
            opacity: 0.6,
            marginBottom: 32,
          }}
        >
          Start here
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--about-ink)", marginBottom: 48 }}
        >
          <CharRevealInView
            text="Ready to build a site that earns its place?"
            style={{ color: "var(--about-ink)" }}
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
          <MagneticCTA to="/contact" variant="primary" tone="dark">
            Book a call
          </MagneticCTA>
          <MagneticCTA to="/work" variant="ghost" tone="dark">
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
  // Every section on this route stands on the studio's ground, so the
  // page still ends dark and the footer still reveals over dark.
  useDeclarePageEndTone("dark");

  // The world is scoped to the document element, not to this subtree,
  // because the nav and the footer live outside the route and have to
  // take it too. index.css holds the tokens under this attribute.
  useEffect(function enterTheStudio() {
    document.documentElement.dataset.route = "about";
    return function leave() {
      delete document.documentElement.dataset.route;
    };
  }, []);

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
      <PrinciplesTrack />
      {/* There is no surface change to reveal here, so the boundaries
          are light rather than Chapter's clip-path slabs. */}
      <GlowHorizon />
      <HowWeWorkBand />
      <GlowHorizon tint="var(--about-glow-2)" />
      <FounderBand />
      <GlowHorizon />
      <ClosingCTA />
    </>
  );
}
