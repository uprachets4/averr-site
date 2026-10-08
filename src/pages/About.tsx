import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import MonogramMark from "../components/MonogramMark";
import ProcessTimeline from "../components/ProcessTimeline";
import { CharReveal, CharRevealInView } from "../components/CharReveal";
import Chapter from "../components/Chapter";
import PrinciplesTrack from "../components/about/PrinciplesTrack";
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
          border: "1px solid var(--color-ink)",
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
          color: "var(--color-ink)",
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
          background: "var(--color-parch)",
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
          background: "var(--color-ink)",
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
          style={{ color: "var(--color-ink-soft)" }}
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
              color: "var(--color-ink)",
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

        {/* The headline. Painted from the first frame per the hero LCP
            rule; its place in the ladder is kept because the monogram
            drawing above it is the non-text entrance these were always
            waiting on. type-accent nests INSIDE the size class (§5.33). */}
        <h1 className="type-display-2xl" style={{ color: "var(--color-ink)", margin: 0 }}>
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
          style={{ color: "var(--color-muted)", maxWidth: "34ch", margin: 0 }}
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
        backgroundColor: "var(--color-bg-alt)",
        /* the gutter comes from --container-wide now, so the process
           line can run the full width the brief asks for */
        padding: "160px 0",
        scrollMarginTop: 96,
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto", position: "relative", zIndex: 2 }}>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
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
  // The closing CTA is dark, so the footer reveals over dark on this route.
  useDeclarePageEndTone("dark");

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
      <Chapter tone="cream-alt" from="dark">
        <HowWeWorkBand />
      </Chapter>
      <FounderBand />
      <Chapter tone="dark" from="cream">
        <ClosingCTA />
      </Chapter>
    </>
  );
}
