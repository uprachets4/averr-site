import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  animate,
} from "motion/react";
import { ease } from "../lib/motion";

type Stat = {
  label: string;
  target: number;
  suffix: string;
  decimals: number;
  caption: string;
};

const STATS: Stat[] = [
  {
    label: "Sites shipped",
    target: 40,
    suffix: "+",
    decimals: 0,
    caption:
      "Custom-built marketing sites and SaaS product surfaces across the GTA.",
  },
  {
    label: "Automations deployed",
    target: 15,
    suffix: "×",
    decimals: 0,
    caption:
      "AI agents and workflows removing manual work from ops, sales, and support.",
  },
  {
    label: "Average LCP",
    target: 1.4,
    suffix: "s",
    decimals: 1,
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
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 20,
          }}
        >
          //_02 · the numbers
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.1,
          }}
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

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

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
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0.01 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.15 + index * 0.12,
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
          display: "inline-flex",
          alignItems: "baseline",
        }}
      >
        <Counter
          target={stat.target}
          decimals={stat.decimals}
          delay={0.35 + index * 0.12}
          reduce={reduce}
        />
        <span>{stat.suffix}</span>
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

function Counter({
  target,
  decimals,
  delay,
  reduce,
}: {
  target: number;
  decimals: number;
  delay: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(
    function runCount() {
      if (!inView) return;
      if (reduce) {
        setValue(target);
        return;
      }
      const controls = animate(0, target, {
        duration: 1.5,
        delay,
        ease: ease.outQuart,
        onUpdate: (v) => setValue(v),
      });
      return function cleanup() {
        controls.stop();
      };
    },
    [inView, target, delay, reduce]
  );

  return (
    <span ref={ref}>
      {decimals === 0 ? Math.round(value) : value.toFixed(decimals)}
    </span>
  );
}
