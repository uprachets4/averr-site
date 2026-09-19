import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import FinalCTA from "../components/FinalCTA";
import PillHl from "../components/PillHl";

function isPillarLabel(s: string): s is "Design" | "Automate" | "Grow" {
  return s === "Design" || s === "Automate" || s === "Grow";
}

function pillarChip(pillar: "Design" | "Automate" | "Grow"): React.CSSProperties {
  const accent =
    pillar === "Design"
      ? "var(--accent-design)"
      : pillar === "Automate"
      ? "var(--accent-automate)"
      : "var(--accent-grow)";
  const rgb =
    pillar === "Design"
      ? "139, 92, 246"
      : pillar === "Automate"
      ? "59, 130, 246"
      : "16, 185, 129";
  return {
    padding: "5px 12px",
    borderRadius: 999,
    border: `1px solid ${accent}`,
    background: `rgba(${rgb}, 0.08)`,
    color: accent,
  };
}


/* ═══════════════════════════════════════════════════════════════
   Shared: Magnetic CTA (matches Hero / FinalCTA behaviour)
   ═══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════
   Header
   ═══════════════════════════════════════════════════════════════ */

function WorkHeader() {
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
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(245,245,247,0.03), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(245,245,247,0.03), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: 0.2 }}
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
          Selected work
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
          className="type-display-xl"
          style={{
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          A short list of{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.bounce, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>real projects</PillHl>
          </motion.span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.1 }}
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          Every project below is real. Numbers are measured, not marketing. Descriptions
          are what happened, not what we wish we had.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared card
   ═══════════════════════════════════════════════════════════════ */

type Card = {
  slug: string;
  name: string;
  eyebrow: string;
  kicker: string;
  tags: string[];
  live?: boolean;
};

function ProjectCard({
  card,
  size,
  index,
}: {
  card: Card;
  size: "hero" | "med";
  index: number;
}) {
  const reduce = useReducedMotion();
  const isHero = size === "hero";
  const bg = isHero ? "var(--color-bg-warm)" : "var(--color-bg-alt)";

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduce ? 0.01 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.1 + index * 0.08,
      }}
      style={{ display: "flex" }}
    >
      <Link
        to={`/work/${card.slug}`}
        className="work-card"
        style={{
          position: "relative",
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isHero ? "56px 48px" : "36px 32px",
          minHeight: isHero ? 480 : 320,
          backgroundColor: bg,
          border: "1px solid rgba(245,245,247,0.08)",
          borderRadius: 4,
          color: "var(--color-ink)",
          textDecoration: "none",
          transition:
            "background-color 0.35s ease, border-color 0.35s ease, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isHero
            ? "rgba(245,245,247,0.03)"
            : "rgba(245,245,247,0.03)";
          e.currentTarget.style.borderColor = "rgba(245,245,247,0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = bg;
          e.currentTarget.style.borderColor = "rgba(245,245,247,0.08)";
        }}
      >
        <div className="grain-light" aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isHero ? 40 : 28,
            }}
          >
            {isPillarLabel(card.eyebrow) ? (
              <span className="type-eyebrow" style={pillarChip(card.eyebrow)}>
                {card.eyebrow}
              </span>
            ) : (
              <span
                className="type-eyebrow"
                style={{ color: "var(--text-muted)" }}
              >
                {card.eyebrow}
              </span>
            )}
            {card.live ? (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-muted-2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <motion.span
                  aria-hidden
                  animate={
                    reduce
                      ? { scale: 1, opacity: 1 }
                      : { scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }
                  }
                  transition={{
                    duration: 2.5,
                    ease: ease.inOut,
                    repeat: reduce ? 0 : Infinity,
                  }}
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--accent-grow)",
                    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.18)",
                  }}
                />
                Live
              </span>
            ) : null}
          </div>

          <h3
            className="type-h3"
            style={{
              marginBottom: isHero ? 32 : 20,
              color: "var(--color-ink)",
            }}
          >
            {card.name}
          </h3>

          <p
            style={{
              fontSize: isHero ? 17 : 15,
              lineHeight: 1.55,
              color: "var(--color-ink-soft)",
              maxWidth: isHero ? 600 : 420,
              marginBottom: isHero ? 40 : 24,
            }}
          >
            {card.kicker}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {card.tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--color-muted)",
                  border: "1px solid rgba(245,245,247,0.14)",
                  background: "transparent",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span
            className="work-arrow"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: isHero ? 28 : 22,
              color: "var(--color-ink)",
              transition: "transform 0.4s ease",
              display: "inline-block",
            }}
            aria-hidden
          >
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_01 · Portfolio — client-tier live case studies
   ═══════════════════════════════════════════════════════════════ */

const PORTFOLIO: Card[] = [
  {
    slug: "cg-walls-and-floors",
    name: "CG Walls & Floors",
    eyebrow: "Design",
    kicker:
      "Built from scratch for a solo operator in a copycat market. The design does the work of the sales team he doesn't have.",
    tags: ["React", "Custom brand", "Marketing site"],
    live: true,
  },
  {
    slug: "capitalcommand",
    name: "CapitalCommand",
    eyebrow: "Design",
    kicker:
      "A research-first command console for tracking portfolios, investigating signals, monitoring risk, and following US and Indian IPOs — built to improve the decision before it introduces the trade.",
    tags: ["Fintech", "Portfolio intelligence", "SaaS"],
    live: true,
  },
];

function Portfolio() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "80px 40px 100px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_01 · portfolio
        </motion.div>

        <div
          className="portfolio-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {PORTFOLIO.map((card, i) => (
            <ProjectCard key={card.slug} card={card} size="hero" index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .portfolio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_02 · In The Lab — our own ventures
   ═══════════════════════════════════════════════════════════════ */

const LAB: Card[] = [
  {
    slug: "sift",
    name: "SIFT",
    eyebrow: "Job search",
    kicker:
      "Our job-search platform. Aggregates listings from YC, LinkedIn, Wellfound, Google Jobs, and every major ATS board; ATS-scores your resume against each one and rewrites it to close the gap.",
    tags: ["Next.js", "Multi-tenant", "AI"],
    live: true,
  },
  {
    slug: "cadencestack",
    name: "CadenceStack",
    eyebrow: "LinkedIn growth",
    kicker:
      "Our LinkedIn presence engine. Turns thought leadership into a managed system — deciding what to say, drafting it in your voice, and remembering what you've already said so the next post doesn't repeat the last one.",
    tags: ["LinkedIn", "Editorial system", "SaaS"],
    live: true,
  },
  {
    slug: "careerclarity",
    name: "CareerClarity AI",
    eyebrow: "Education",
    kicker:
      "Our AI product for education. Analyzes student test data to surface where each learner is actually stuck.",
    tags: ["AI", "EdTech", "Product"],
    live: true,
  },
];

function InTheLab() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "120px 40px",
        borderTop: "1px solid rgba(245,245,247,0.10)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_02 · in the lab
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          The ventures we're{" "}
          <span className="fade-h">building for ourselves.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.2 }}
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--color-muted)",
            maxWidth: 640,
            marginBottom: 56,
          }}
        >
          A proving ground for the same three pillars we sell to clients. If it
          doesn't work on our own work, we don't ship it to yours.
        </motion.p>

        <div
          className="lab-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {LAB.map((card, i) => (
            <ProjectCard key={card.slug} card={card} size="med" index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lab-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_03 · Off-portfolio — honest note about NDA / unpublished work
   ═══════════════════════════════════════════════════════════════ */

function OffPortfolio() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "120px 40px",
        borderTop: "1px solid rgba(245,245,247,0.10)",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_03 · off-portfolio
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(28px, 3.4vw, 44px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
            marginBottom: 24,
            maxWidth: 720,
          }}
        >
          Not every project ends up{" "}
          <span className="fade-h">here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.2 }}
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--color-muted)",
            maxWidth: 620,
            marginBottom: 40,
          }}
        >
          Some work is under NDA. Some doesn't need a case study to be worth doing.
          If your project pattern fits the three pillars but doesn't look like anything
          above, the call is still the fastest way to find out.
        </motion.p>

        <MagneticCTA
          to="/contact"
          variant="ghost"
        >
          Book a discovery call
        </MagneticCTA>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Work() {
  useEffect(function scrollTopOnMount() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <WorkHeader />
      <Portfolio />
      <InTheLab />
      <OffPortfolio />
      <FinalCTA markerNumber="04" />
    </>
  );
}
