import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { ease } from "../../lib/motion";
import type { CaseStudy } from "../../data/caseStudies";
import { CharRevealInView } from "../CharReveal";
import { ReadFill } from "./ReadFill";

function rgba(hex: string, alpha: number) {
  if (!hex.startsWith("#")) return hex;
  const h = hex.slice(1);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Outcome — led by the study's measured figure where one exists.
 *
 * Studies without a published headlineFigure (CapitalCommand, CadenceStack)
 * lead with the headline instead. No placeholder, no invented number.
 */
export default function Outcome({
  text,
  figure,
  tint,
}: {
  text: CaseStudy["outcome"];
  figure?: CaseStudy["headlineFigure"];
  tint?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  const accent = tint || "var(--color-parch)";

  return (
    <section
      id={SECTIONS.outcome.id}
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "160px 0",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      {figure ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 55% 45% at 50% 38%, ${rgba(
              accent,
              0.14
            )}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div
        ref={ref}
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
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          data-section-heading
          style={{ color: "var(--color-muted-l)", marginBottom: 40 }}
        >
          {eyebrowFor(SECTIONS.outcome)}
        </motion.div>

        {figure ? (
          <FigureLead figure={figure} accent={accent} reduce={!!reduce} />
        ) : null}

        <h2
          className="type-display-l"
          style={{
            color: "var(--color-parch)",
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          <CharRevealInView
            text={text.headline}
            style={{ color: "var(--color-parch)" }}
          />
        </h2>

        <ReadFill
          text={text.body}
          progress={scrollYProgress}
          reduce={!!reduce}
          tint={accent}
          emphasis={text.emphasis}
          className="type-body-lg"
          style={{
            color: "var(--color-muted-l)",
            maxWidth: 760,
            margin: "0 auto",
          }}
        />
      </div>
    </section>
  );
}

/** The measured figure, counted up once on entry. */
function FigureLead({
  figure,
  accent,
  reduce,
}: {
  figure: NonNullable<CaseStudy["headlineFigure"]>;
  accent: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  // "85%" -> the number the counter runs, plus its suffix
  const m = figure.value.match(/^([\d.]+)(.*)$/);
  const target = m ? parseFloat(m[1]) : 0;
  const decimals = m && m[1].includes(".") ? 1 : 0;
  const suffix = m ? m[2] : "";
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(
    function countUp() {
      if (!inView) return;
      if (reduce) {
        setValue(target);
        return;
      }
      const controls = animate(0, target, {
        duration: 1.5,
        ease: ease.outQuart,
        onUpdate: function tick(v) {
          setValue(v);
        },
      });
      return function cleanup() {
        controls.stop();
      };
    },
    [inView, target, reduce]
  );

  return (
    <div ref={ref} style={{ marginBottom: 48 }}>
      <div
        className="type-display-2xl tnum"
        style={{ color: "var(--color-parch)", lineHeight: 0.9 }}
      >
        {decimals === 0 ? Math.round(value) : value.toFixed(decimals)}
        {suffix}
      </div>
      <div
        className="type-body"
        style={{
          color: "var(--color-muted-l)",
          maxWidth: 520,
          margin: "16px auto 0",
          borderTop: `1px solid ${accent}`,
          paddingTop: 16,
        }}
      >
        {figure.caption}
      </div>
    </div>
  );
}
