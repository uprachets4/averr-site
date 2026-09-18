import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import PillHl from "../components/PillHl";
import FinalCTA from "../components/FinalCTA";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   //_01 · WHO
   ═══════════════════════════════════════════════════════════════ */

function Who() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 100px",
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

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: 0.2 }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_01 · who
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.3 }}
          className="type-display-xl"
          style={{
            color: "var(--color-ink)",
            marginBottom: 48,
            maxWidth: 1080,
          }}
        >
          One operator.{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: BOUNCE, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>Three pillars</PillHl>
          </motion.span>. Ten years of shipping.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.1 }}
          style={{
            fontSize: 20,
            lineHeight: 1.55,
            color: "var(--color-muted)",
            maxWidth: 760,
          }}
        >
          I'm Prachets. I run Averr Studios out of Toronto — a boutique studio
          for businesses that refuse to look templated. Design, Automate, Grow.
          Same person on every project. No account manager between you and the
          work.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_02 · WHAT I ACTUALLY DO ALL DAY
   ═══════════════════════════════════════════════════════════════ */

const DAY_TO_DAY = [
  {
    pillar: "Design",
    body:
      "Custom marketing sites and product UI. React, Framer, Next.js, Tailwind, Framer Motion. If it renders in a browser, I can build it.",
  },
  {
    pillar: "Automate",
    body:
      "AI systems and workflow automation. Claude API, Python, n8n. The boring parts of your business, running without you in the loop.",
  },
  {
    pillar: "Grow",
    body:
      "Paid campaigns and organic distribution. Google Ads, Meta Ads, LinkedIn, long-form content. Numbers-driven, not vibes-driven.",
  },
];

function DayToDay() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 80,
          alignItems: "start",
        }}
        className="day-grid"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
            className="type-eyebrow"
            style={{
              color: "var(--color-muted)",
              marginBottom: 24,
            }}
          >
            //_02 · what I actually do all day
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
            className="type-h2"
            style={{
              color: "var(--color-ink)",
              maxWidth: 480,
            }}
          >
            The <span className="fade-h">day-to-day.</span>
          </motion.h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DAY_TO_DAY.map((entry, i) => (
            <motion.article
              key={entry.pillar}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.15 + i * 0.1,
              }}
              style={{
                padding: "32px 32px",
                background: "var(--color-bg)",
                border: "1px solid rgba(20,20,18,0.08)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(20,20,18,0.18)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-soft)",
                }}
              >
                {entry.pillar}
              </span>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "var(--color-ink-soft)",
                }}
              >
                {entry.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .day-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_03 · BEFORE THIS — timeline
   ═══════════════════════════════════════════════════════════════ */

const STOPS = [
  {
    n: "01",
    role: "AE at Google (via Teleperformance / Extended Workforce). Selling Google Cloud into mid-market.",
    lesson:
      "Where I learned that most B2B sales problems are actually positioning problems.",
  },
  {
    n: "02",
    role: "Co-founder at KlaasX Edutech. Scaled to a 15-person team, sold into 150+ institutions.",
    lesson: "Where I learned that shipping fast beats shipping perfect.",
  },
  {
    n: "03",
    role: "Freelance web design and venture building at Gratifa.",
    lesson: "Where I learned the shape of the studio I actually wanted to build.",
  },
];

function BeforeThis() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_03 · before this
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          How I <span className="fade-h">got here.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {STOPS.map((stop, i) => (
            <motion.li
              key={stop.n}
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.1 + i * 0.1,
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr",
                gap: 32,
                alignItems: "start",
                padding: "36px 0",
                borderTop: "1px solid rgba(20,20,18,0.10)",
                borderBottom:
                  i === STOPS.length - 1
                    ? "1px solid rgba(20,20,18,0.10)"
                    : "none",
              }}
              className="stop-row"
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "var(--color-muted)",
                  paddingTop: 6,
                }}
              >
                {stop.n}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(20px, 2.2vw, 28px)",
                    letterSpacing: "-0.018em",
                    lineHeight: 1.25,
                    color: "var(--color-ink)",
                    marginBottom: 14,
                  }}
                >
                  {stop.role}
                </p>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "var(--color-muted)",
                    maxWidth: 720,
                  }}
                >
                  {stop.lesson}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .stop-row {
            grid-template-columns: 40px 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_04 · HOW I WORK — 4 principles
   ═══════════════════════════════════════════════════════════════ */

const PRINCIPLES = [
  {
    head: "Fixed scope, fixed price, fixed timeline.",
    body: "Weekly review call. Preview URLs from day one.",
  },
  {
    head: "One person on your project — me.",
    body: "No agency layers, no handoffs to junior staff you didn't hire.",
  },
  {
    head: "If I can't do it well, I tell you and refer you to someone who can.",
    body: "I'd rather lose a project than ship something I can't stand behind.",
  },
  {
    head: "Everything I build, I could rebuild from scratch tomorrow.",
    body: 'No black-box tools, no "you\'d need me to maintain it" lock-in.',
  },
];

function HowIWork() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_04 · how I work
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          Four principles <span className="fade-h">I don't break.</span>
        </motion.h2>

        <div
          className="principles-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {PRINCIPLES.map((p, i) => (
            <motion.article
              key={p.head}
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0.01 : 0.6,
                ease: EASE,
                delay: reduce ? 0 : 0.15 + i * 0.08,
              }}
              style={{
                padding: "40px 36px",
                background: "var(--color-bg)",
                border: "1px solid rgba(20,20,18,0.08)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "var(--color-muted-2)",
                  marginBottom: 4,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="type-h3"
                style={{
                  color: "var(--color-ink)",
                }}
              >
                {p.head}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                }}
              >
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .principles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_05 · WHAT I DON'T DO — dark inversion
   ═══════════════════════════════════════════════════════════════ */

const NOT_DOING = [
  "I don't do retainers with 12-month minimums.",
  "I don't white-label for agencies.",
  "I don't take projects I can't ship in 90 days.",
];

function WhatIDontDo() {
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
          className="type-eyebrow"
          style={{
            color: "var(--color-muted-l)",
            marginBottom: 24,
          }}
        >
          //_05 · what I don't do
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          className="type-h2"
          style={{
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          The things I <span className="fade-h-dark">say no to.</span>
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
                borderBottom:
                  i === NOT_DOING.length - 1
                    ? "1px solid rgba(237,231,218,0.14)"
                    : "none",
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
          Averr is a boutique studio. I take a small number of projects each
          quarter and finish them.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_06 · OUTSIDE THIS — one paragraph
   ═══════════════════════════════════════════════════════════════ */

function OutsideThis() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "128px 40px",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: 40,
          alignItems: "start",
        }}
        className="outside-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
          }}
        >
          //_06 · outside this
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(22px, 2.4vw, 30px)",
            lineHeight: 1.4,
            letterSpacing: "-0.018em",
            color: "var(--color-ink)",
            maxWidth: 820,
          }}
        >
          When I'm not shipping: reading (mostly non-fiction, currently working
          through the intersection of AI and enterprise sales), lifting, and
          helping my friend Max grow CG Walls & Floors on weekends.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .outside-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function About() {
  useEffect(function updateTitle() {
    const prev = document.title;
    document.title = "About — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  useEffect(function scrollTop() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Who />
      <DayToDay />
      <BeforeThis />
      <HowIWork />
      <WhatIDontDo />
      <OutsideThis />
      <FinalCTA markerNumber="07" />
    </>
  );
}
