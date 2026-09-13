import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import FinalCTA from "../components/FinalCTA";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   Shared: Magnetic CTA (matches Hero / FinalCTA behaviour)
   ═══════════════════════════════════════════════════════════════ */

function MagneticCTA({
  href,
  variant,
  external,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  external?: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "14px 24px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "var(--color-ink)",
    color: "var(--color-bg)",
    border: "1px solid var(--color-ink)",
  };

  const ghostStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "transparent",
    color: "var(--color-ink)",
    border: "1px solid rgba(20,20,18,0.18)",
  };

  const finalStyle = variant === "primary" ? primaryStyle : ghostStyle;

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x: springX, y: springY, ...finalStyle }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink-soft)";
        } else {
          e.currentTarget.style.backgroundColor = "rgba(20,20,18,0.04)";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.32)";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink)";
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.18)";
        }
      }}
      whileHover={{ scale: variant === "primary" ? 1.03 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      {children}
      <span
        style={{ display: "inline-block", transition: "transform 0.3s ease" }}
        className="group-hover:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Pillar block — Design / Automate / Grow
   ═══════════════════════════════════════════════════════════════ */

type Pillar = {
  id: string;
  marker: string;
  name: string;
  intro: string;
  included: string[];
  engagement: string;
  example: { client: string; note: string };
  altBg?: boolean;
};

function PillarBlock({ pillar }: { pillar: Pillar }) {
  const reduce = useReducedMotion();

  return (
    <section
      id={pillar.id}
      style={{
        backgroundColor: pillar.altBg ? "var(--color-bg-alt)" : "var(--color-bg)",
        padding: "120px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          {pillar.marker}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.05 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(48px, 6vw, 88px)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: 32,
          }}
        >
          {pillar.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.15 }}
          style={{
            fontSize: 20,
            lineHeight: 1.55,
            color: "var(--color-ink-soft)",
            maxWidth: 720,
            marginBottom: 72,
          }}
        >
          {pillar.intro}
        </motion.p>

        <div
          className="pillar-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 80,
            alignItems: "start",
            marginBottom: 56,
          }}
        >
          {/* What's included */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-muted-2)",
                marginBottom: 24,
              }}
            >
              What's included
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {pillar.included.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: reduce ? 0.01 : 0.5,
                    ease: EASE,
                    delay: reduce ? 0 : 0.05 * i,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: 12,
                    padding: "18px 0",
                    borderBottom: "1px solid rgba(20,20,18,0.08)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "var(--color-ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "var(--color-muted-2)",
                      paddingTop: 3,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Typical engagement + example */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-muted-2)",
                  marginBottom: 16,
                }}
              >
                Typical engagement
              </div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--color-ink-soft)",
                }}
              >
                {pillar.engagement}
              </p>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-muted-2)",
                  marginBottom: 16,
                }}
              >
                Recent work
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  color: "var(--color-ink)",
                  marginBottom: 8,
                }}
              >
                {pillar.example.client}
              </div>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                }}
              >
                {pillar.example.note}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.2 }}
        >
          <MagneticCTA
            href="https://cal.com/prachets/discoverycall"
            variant="ghost"
            external
          >
            Book a discovery call
          </MagneticCTA>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pillar-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  );
}

const PILLARS: Pillar[] = [
  {
    id: "design",
    marker: "//_01 · design",
    name: "Design",
    intro:
      "The websites, product interfaces, and design systems that make the rest of the work land. If it looks templated, it costs you deals before the first meeting.",
    included: [
      "Custom marketing sites in Next.js or Framer — 5 to 15 pages, CMS-ready, built to load fast on mobile networks.",
      "SaaS product UI. Full user flows, component libraries, and design tokens engineering can hand off from.",
      "Design systems. Tokens, typography, motion primitives, and documentation your team will actually reference.",
      "Landing page conversion work. Copy revisions and A/B setup so the ads pointing to it earn their spend.",
      "Iterative refinement post-launch. Real users find things static mocks miss.",
    ],
    engagement:
      "Marketing site: 3–6 weeks. Product UI or design system: 6–12 weeks. Fixed scope, fixed price, weekly review call.",
    example: {
      client: "CG Walls & Floors",
      note: "Replaced a template contractor site with a brand-led rebuild that reads as the premium option in a copycat market.",
    },
  },
  {
    id: "automate",
    marker: "//_02 · automate",
    name: "Automate",
    intro:
      "The AI systems and workflow automations that take busywork off your team. If it's the same task every week, it should be running without you.",
    included: [
      "AI agents for lead qualification, intake, prospect research, meeting prep — the pre-work that eats hours.",
      "Workflow automation across CRM, email, calendar, and spreadsheets. The plumbing that keeps records in sync.",
      "LLM-backed internal tools with human review built in. Not black-box outputs — reviewable, editable, correctable.",
      "Data pipelines that feed dashboards or trigger downstream actions. Signal, not noise.",
      "Documentation and handoff so your team owns and extends it, not just uses it.",
    ],
    engagement:
      "3–8 weeks for a scoped system. We ship in phases so you see value before the whole thing is built.",
    example: {
      client: "CareerClarity AI",
      note: "An AI product where the automation is the product. Built the LLM-backed guidance flow that users actually finish.",
    },
    altBg: true,
  },
  {
    id: "grow",
    marker: "//_03 · grow",
    name: "Grow",
    intro:
      "The paid acquisition and organic content that fills the funnel above the work in Design and Automate. Numbers are the point.",
    included: [
      "Paid campaigns on Google, Meta, LinkedIn, and Local Services Ads. Built, tested, and iterated weekly.",
      "Landing pages engineered for the ads pointing to them. Copy, layout, and load speed treated as one problem.",
      "Organic content — long-form writing, LinkedIn presence, YouTube. Distribution that compounds over months, not one-off posts.",
      "Attribution and reporting. Monthly review showing what worked, what didn't, and what changed next.",
      "Iteration cadence, not set-and-forget campaigns. Ad performance is a moving target.",
    ],
    engagement:
      "3-month minimum to see meaningful data. Month-to-month after that, cancel anytime.",
    example: {
      client: "SIFT and CadenceStack",
      note: "Two different growth motions, both built on the same principle: measure what a lead costs, then lower it.",
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   Header
   ═══════════════════════════════════════════════════════════════ */

function ServicesHeader() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 100px",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 40,
          }}
        >
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
          Services
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(44px, 6vw, 80px)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          Three services.{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: BOUNCE, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <span className="pill-hl"><span>One studio</span></span>
          </motion.span>{" "}
          behind them all.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.1 }}
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          Averr Studios designs the websites, engineers the SaaS products and AI systems,
          and grows the audiences of businesses that refuse to look templated.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   What we don't do — dark inversion, typographic
   ═══════════════════════════════════════════════════════════════ */

const NOT_DOING = [
  "We don't do retainers with 12-month minimums.",
  "We don't white-label for agencies.",
  "We don't take projects we can't ship in 90 days.",
];

function WhatWeDontDo() {
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

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted-l)",
            marginBottom: 24,
          }}
        >
          //_04 · what we don't do
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          Some <span className="fade-h-dark">things we say no to.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NOT_DOING.map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.1 + i * 0.1,
              }}
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
            >
              {line}
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 0.5 }}
          style={{
            marginTop: 48,
            fontSize: 16,
            lineHeight: 1.6,
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

/* ═══════════════════════════════════════════════════════════════
   How to start — 3 steps
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    n: "01",
    title: "Book a discovery call.",
    body: "20 minutes. No slide deck. We ask questions, you ask questions, both sides decide whether this is a fit.",
  },
  {
    n: "02",
    title: "Scoped proposal in 3 business days.",
    body: "Fixed scope, fixed timeline, fixed price. If we can't quote it, we tell you why and refer you to someone who can.",
  },
  {
    n: "03",
    title: "Kickoff week.",
    body: "Async by default, one review call a week. You get preview URLs from day one, not deliverables at the end.",
  },
];

function HowToStart() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "140px 40px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_05 · how to start
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            color: "var(--color-ink)",
            marginBottom: 72,
            maxWidth: 900,
          }}
        >
          Three steps. Two weeks{" "}
          <span className="fade-h">to kickoff, max.</span>
        </motion.h2>

        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.15 + i * 0.1,
              }}
              style={{
                padding: "40px 32px",
                borderTop: "1px solid rgba(20,20,18,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "var(--color-muted)",
                }}
              >
                <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>
                  {step.n}
                </span>
                {"  ·  step"}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 24,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "var(--color-ink)",
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Services() {
  useEffect(function scrollTopOnMount() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ServicesHeader />
      {PILLARS.map((p) => (
        <PillarBlock key={p.id} pillar={p} />
      ))}
      <WhatWeDontDo />
      <HowToStart />
      <FinalCTA />
    </>
  );
}
