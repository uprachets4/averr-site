import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";


const FEATURED = {
  client: "CG Walls & Floors · 2026",
  tags: ["Design", "Automate"],
  title: "Realtor outreach automation + website rebuild",
  desc:
    "Custom marketing site + AI agent scraping realtor listings to identify renovation-ready properties, generating personalized outreach at scale.",
  result: "85%",
  resultLabel: "Reduction in manual outreach hours",
  href: "/work/cg-walls-and-floors",
};

const SUPPORTING = [
  {
    label: "CareerClarity AI · Automated exam analysis",
    value: "3.2×",
    caption: "Student throughput increase after AI-driven test analysis shipped.",
  },
  {
    label: "SIFT · Job platform launch",
    value: "42%",
    caption: "ATS-score improvement average after AI resume rewrite.",
  },
];

export default function CaseStudies() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Transition cream → dark */}
      <div
        style={{
          height: 120,
          background:
            "linear-gradient(180deg, var(--color-bg) 0%, var(--color-dark) 100%)",
        }}
        aria-hidden="true"
      />

      <section
        id="work"
        style={{
          backgroundColor: "var(--color-dark)",
          color: "var(--color-parch)",
          padding: "120px 40px",
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
          {/* Section marker */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{
              color: "var(--color-muted-l)",
              marginBottom: 20,
            }}
          >
            //_03 · selected work
          </motion.div>

          {/* Section title */}
          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
            className="type-h2"
            style={{
              maxWidth: 900,
              marginBottom: 30,
              color: "var(--color-parch)",
            }}
          >
            Recent projects.{" "}
            <span className="fade-h-dark">The rest live in the vault.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--color-muted-l)",
              maxWidth: 640,
              marginBottom: 60,
            }}
          >
            Every project starts with a clear brief and ends with a site your
            team can actually run — no gatekeeping, no proprietary lock-in,
            no monthly retainer to change a headline.
          </motion.p>

          {/* Featured case study */}
          <FeaturedCard reduce={!!reduce} />

          {/* Supporting stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 40,
              marginTop: 60,
            }}
            className="supporting-grid"
          >
            {SUPPORTING.map((stat, i) => (
              <SupportingStat
                key={stat.label}
                stat={stat}
                index={i}
                reduce={!!reduce}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Transition dark → cream */}
      <div
        style={{
          height: 120,
          background:
            "linear-gradient(180deg, var(--color-dark) 0%, var(--color-bg) 100%)",
        }}
        aria-hidden="true"
      />

      <style>{`
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .supporting-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  );
}

function FeaturedCard({ reduce }: { reduce: boolean }) {
  return (
    <motion.a
      href={FEATURED.href}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
      className="featured-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        minHeight: 400,
        background: "var(--color-dark-alt)",
        border: "1px solid rgba(237,231,218,0.10)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), border-color 0.4s ease",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(237,231,218,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(237,231,218,0.10)";
      }}
    >
      {/* Visual placeholder */}
      <div
        style={{
          background: "linear-gradient(135deg, #2A2926 0%, #1C1B18 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 500px 400px at 30% 40%, rgba(237,231,218,0.06), transparent 70%)",
          }}
        />
        <div
          className="type-eyebrow"
          style={{
            color: "var(--color-muted-l)",
            padding: "12px 20px",
            border: "1px dashed rgba(237,231,218,0.18)",
            borderRadius: 8,
            position: "relative",
            zIndex: 2,
          }}
        >
          Case study visual · Phase 2
        </div>
      </div>

      {/* Meta */}
      <div
        style={{
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Tag row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {FEATURED.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  border: "1px solid rgba(237,231,218,0.18)",
                  color: "var(--color-muted-l)",
                  borderRadius: 4,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Client name */}
          <div
            className="type-eyebrow"
            style={{
              color: "var(--color-muted-l)",
              marginBottom: 12,
            }}
          >
            {FEATURED.client}
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--color-parch)",
              marginBottom: 20,
            }}
          >
            {FEATURED.title}
          </div>

          {/* Desc */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-muted-l)",
              marginBottom: 32,
            }}
          >
            {FEATURED.desc}
          </div>
        </div>

        <div>
          {/* Result */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              className="num-gradient-dark"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 72,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
              }}
            >
              {FEATURED.result}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.4,
                color: "var(--color-muted-l)",
              }}
            >
              {FEATURED.resultLabel}
            </div>
          </div>

          {/* Link */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-parch)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Read the full case study
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
              }}
              className="group-hover:translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

type Stat = {
  label: string;
  value: string;
  caption: string;
};

function SupportingStat({
  stat,
  index,
  reduce,
}: {
  stat: Stat;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: reduce ? 0.01 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.4 + index * 0.1,
      }}
    >
      <div
        className="type-eyebrow"
        style={{
          color: "var(--color-muted-l)",
          marginBottom: 20,
        }}
      >
        {stat.label}
      </div>
      <div
        className="num-gradient-dark"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(64px, 8vw, 100px)",
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          marginBottom: 24,
        }}
      >
        {stat.value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--color-muted-l)",
          maxWidth: 320,
        }}
      >
        {stat.caption}
      </div>
    </motion.div>
  );
}
