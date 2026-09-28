import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { duration, ease } from "../lib/motion";
import { CharRevealInView } from "./CharReveal";
import MagneticCTA from "./MagneticCTA";
import { FeaturedCard } from "./CaseStudies";
import { caseStudies } from "../data/caseStudies";

/**
 * Every figure below already lived on home — the three project results from
 * CaseStudies and the three studio figures from Numbers. Values, suffixes and
 * captions are carried over unchanged; only the presentation is new.
 */
type Row = {
  label: string;
  target: number;
  decimals: number;
  suffix: string;
  caption: string;
  href?: string;
};

/** Split "85%" into the number the counter animates and its suffix. */
function fromData(slug: string) {
  const fig = caseStudies[slug].headlineFigure;
  if (!fig) throw new Error(`${slug} has no headlineFigure`);
  const m = fig.value.match(/^([\d.]+)(.*)$/);
  const num = m ? parseFloat(m[1]) : 0;
  return {
    target: num,
    decimals: m && m[1].includes(".") ? 1 : 0,
    suffix: m ? m[2] : "",
    caption: fig.caption,
  };
}

const ROWS: Row[] = [
  {
    label: "CG Walls & Floors",
    ...fromData("cg-walls-and-floors"),
    href: "/work/cg-walls-and-floors",
  },
  {
    label: "CareerClarity AI",
    target: 3.2,
    decimals: 1,
    suffix: "×",
    caption: "Student throughput increase after AI-driven test analysis shipped.",
  },
  {
    label: "SIFT",
    ...fromData("sift"),
    href: "/work/sift",
  },
  {
    label: "Averr Studio",
    target: 40,
    decimals: 0,
    suffix: "+",
    caption:
      "Custom-built marketing sites and SaaS product surfaces across the GTA.",
  },
  {
    label: "Averr Studio",
    target: 15,
    decimals: 0,
    suffix: "×",
    caption:
      "AI agents and workflows removing manual work from ops, sales, and support.",
  },
  {
    label: "Averr Studio",
    target: 1.4,
    decimals: 1,
    suffix: "s",
    caption:
      "Real-user Core Web Vitals across every site we ship. Fast is a feature.",
  },
];

function Figure({
  row,
  inView,
  delay,
  reduce,
}: {
  row: Row;
  inView: boolean;
  delay: number;
  reduce: boolean;
}) {
  const [value, setValue] = useState(reduce ? row.target : 0);

  useEffect(
    function countUp() {
      if (!inView) return;
      if (reduce) {
        setValue(row.target);
        return;
      }
      const controls = animate(0, row.target, {
        duration: 1.5,
        delay,
        ease: ease.outQuart,
        onUpdate: function tick(v) {
          setValue(v);
        },
      });
      return function cleanup() {
        controls.stop();
      };
    },
    [inView, row.target, delay, reduce]
  );

  return (
    <span className="tnum">
      {row.decimals === 0 ? Math.round(value) : value.toFixed(row.decimals)}
      {row.suffix}
    </span>
  );
}

function LedgerRow({ row, index }: { row: Row; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.06;

  const body = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.28fr) minmax(0, 0.34fr) minmax(0, 1fr) 24px",
        alignItems: "baseline",
        gap: 24,
        padding: "32px 0",
      }}
      className="ledger-row"
    >
      <div
        className="type-eyebrow"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted-l)" }}
      >
        {row.label}
      </div>

      <motion.div
        className="type-display-l"
        style={{ color: "var(--color-parch)", x: hovered && row.href && !reduce ? 8 : 0 }}
        transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
      >
        <Figure row={row} inView={inView} delay={delay} reduce={!!reduce} />
      </motion.div>

      <div className="type-body" style={{ color: "var(--color-muted-l)" }}>
        {row.caption}
      </div>

      {row.href ? (
        <motion.div
          aria-hidden
          style={{ width: 20, height: 20, color: "var(--color-parch)", justifySelf: "end" }}
          animate={{ rotate: hovered && !reduce ? -45 : 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
        >
          <svg viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>
      ) : (
        <span />
      )}
    </div>
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* hairline draws left → right, then the row fades up */}
      <motion.div
        aria-hidden
        style={{
          height: 1,
          background: "rgba(237,233,226,0.08)",
          transformOrigin: "left",
        }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart, delay }}
      />
      <motion.div
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: reduce ? 0 : 0.6,
          ease: ease.outQuart,
          delay: delay + (reduce ? 0 : 0.2),
        }}
        onMouseEnter={function on() {
          setHovered(true);
        }}
        onMouseLeave={function off() {
          setHovered(false);
        }}
        style={{
          background: hovered && row.href ? "rgba(237,233,226,0.03)" : "transparent",
          transition: reduce ? "none" : `background-color ${duration.base * 1000}ms ease`,
        }}
      >
        {row.href ? (
          <Link
            to={row.href}
            style={{ display: "block", textDecoration: "none", color: "inherit" }}
            aria-label={`${row.label} — case study`}
          >
            {body}
          </Link>
        ) : (
          body
        )}
      </motion.div>
    </div>
  );
}

export default function ProofLedger() {
  const reduce = useReducedMotion();

  return (
    <section
      id="work"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted-l)", marginBottom: 20 }}
        >
          //_03 · selected work
        </motion.div>

        <h2
          className="type-h2 measure-wide"
          style={{ marginBottom: 48, color: "var(--color-parch)" }}
        >
          <CharRevealInView
            segments={[
              { text: "Recent projects. The rest live" },
              { text: "in the vault.", accent: true },
            ]}
            style={{ color: "var(--color-parch)" }}
          />
        </h2>

        <FeaturedCard reduce={!!reduce} />

        <div style={{ marginTop: 72 }}>
          {ROWS.map(function drawRow(row, i) {
            return <LedgerRow key={row.label + row.suffix + row.target} row={row} index={i} />;
          })}
          <div style={{ height: 1, background: "rgba(237,233,226,0.08)" }} />
        </div>

        <div style={{ marginTop: 48 }}>
          <MagneticCTA to="/work" variant="text" size="md" tone="dark">
            All case studies
          </MagneticCTA>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .ledger-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 24px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
