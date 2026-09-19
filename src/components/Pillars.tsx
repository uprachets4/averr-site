import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";


const PILLARS = [
  {
    num: "01",
    marker: "DESIGN",
    title: "Websites & SaaS UI",
    desc: "Custom-built marketing sites, product interfaces, and design systems. No templates. No page builders. Every pixel considered.",
    href: "/services#design",
  },
  {
    num: "02",
    marker: "AUTOMATE",
    title: "AI agents & workflows",
    desc: "AI systems and automations that plug into your existing tools. We remove the busywork your team hates.",
    href: "/services#automate",
  },
  {
    num: "03",
    marker: "GROW",
    title: "Marketing engines",
    desc: "Meta, Google, LSA, organic and paid. We build the content and run the ads that keep your funnel full.",
    href: "/services#grow",
  },
];

export default function Pillars() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        color: "var(--color-ink)",
        padding: "80px 40px 0",
        position: "relative",
      }}
    >
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
            color: "var(--color-muted)",
            marginBottom: 20,
          }}
        >
          //_01 · what we do
        </motion.div>

        {/* Section title with horizontal gradient fade on second phrase */}
        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
            maxWidth: 900,
            marginBottom: 60,
            color: "var(--color-ink)",
          }}
        >
          Three services.{" "}
          <span className="fade-h">One studio behind them all.</span>
        </motion.h2>
      </div>

      {/* Pillars grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderTop: "1px solid rgba(245,245,247,0.10)",
        }}
        className="pillars-grid"
      >
        {PILLARS.map((pillar, i) => (
          <PillarCard key={pillar.marker} pillar={pillar} index={i} reduce={!!reduce} />
        ))}
      </div>

      {/* Responsive collapse */}
      <style>{`
        @media (max-width: 900px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillar-card { border-right: none !important; }
        }
      `}</style>
    </section>
  );
}

type Pillar = {
  num: string;
  marker: string;
  title: string;
  desc: string;
  href: string;
};

function PillarCard({
  pillar,
  index,
  reduce,
}: {
  pillar: Pillar;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.a
      href={pillar.href}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: reduce ? 0.01 : 0.6,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.2 + index * 0.08,
      }}
      className="pillar-card"
      style={{
        display: "block",
        padding: "48px 40px",
        borderRight: "1px solid rgba(245,245,247,0.10)",
        borderBottom: "1px solid rgba(245,245,247,0.10)",
        transition: "background-color 0.35s ease",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(245,245,247,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          color: "var(--color-muted)",
          marginBottom: 32,
        }}
      >
        <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>
          {pillar.num}
        </span>{" "}
        · {pillar.marker}
      </div>
      <h3
        className="type-h3"
        style={{
          marginBottom: 16,
          color: "var(--color-ink)",
        }}
      >
        {pillar.title}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--color-muted)",
          maxWidth: 320,
        }}
      >
        {pillar.desc}
      </div>
    </motion.a>
  );
}
