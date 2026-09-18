import { motion, useReducedMotion } from "motion/react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STATS = [
  {
    label: "Sites shipped",
    value: "40+",
    caption:
      "Custom-built marketing sites and SaaS product surfaces across the GTA.",
  },
  {
    label: "Automations deployed",
    value: "15×",
    caption:
      "AI agents and workflows removing manual work from ops, sales, and support.",
  },
  {
    label: "Average LCP",
    value: "1.4s",
    caption:
      "Real-user Core Web Vitals across every site we ship. Fast is a feature.",
  },
];

export default function Numbers() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-ink)",
        padding: "120px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-light" aria-hidden="true" />

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
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 20,
          }}
        >
          //_02 · the numbers
        </motion.div>

        {/* Section title with horizontal gradient on second phrase */}
        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.1 }}
          className="type-h2"
          style={{
            maxWidth: 900,
            marginBottom: 60,
            color: "var(--color-ink)",
          }}
        >
          Small studio.{" "}
          <span className="fade-h">Real results.</span>
        </motion.h2>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 40,
            paddingTop: 20,
          }}
          className="stats-grid"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} reduce={!!reduce} />
          ))}
        </div>
      </div>

      {/* Responsive collapse */}
      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

type Stat = {
  label: string;
  value: string;
  caption: string;
};

function StatCard({
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
        ease: EASE,
        delay: reduce ? 0 : 0.2 + index * 0.1,
      }}
    >
      <div
        className="type-eyebrow"
        style={{
          color: "var(--color-muted)",
          marginBottom: 20,
        }}
      >
        {stat.label}
      </div>
      <div
        className="num-gradient"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(80px, 10vw, 140px)",
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
          color: "var(--color-muted)",
          maxWidth: 280,
        }}
      >
        {stat.caption}
      </div>
    </motion.div>
  );
}
