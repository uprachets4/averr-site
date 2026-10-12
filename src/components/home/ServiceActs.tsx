import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { easing } from "../../lib/motion";
import { useScrollProp, useScrollStyle } from "../../lib/useScrollStyle";
import {
  PILLAR_NAME,
  PILLAR_ORDER,
  PILLAR_SERVICES,
  serviceSlug,
  type PillarId,
} from "../../data/servicePillars";
import MagneticCTA from "../MagneticCTA";

/**
 * Chapter 4 — "Here's how we do it."
 *
 * Three acts, one per pillar. Each is a giant word with the studio's
 * REAL work showing through the letterforms, and the pillar's services
 * under it as a list you can walk into /services with.
 *
 * This is home's own mechanic. It does not mount a single /services
 * screen component — the chapter it replaced put the build stage's own
 * screens on the home page, which is the one thing the page rules
 * forbid: home previews a destination's idea, it never borrows its
 * signature.
 *
 * The imagery inside the type is the existing WebP pipeline's largest
 * rung, panned by the same scroll value that moves the acts, so the
 * work travels through the letters rather than sitting behind them.
 */

const LINE = "Here's how we do it.";

/**
 * A parch wash over the captures.
 *
 * Three of the six are dark dashboards, and a dark image inside dark
 * letterforms on a dark ground is a smudge — the first build of this
 * chapter had AUTOMATE filled with CapitalCommand and you could not tell
 * there was a picture in it. The wash lifts every fill into legibility
 * while the image's own texture still reads through.
 */
const LIFT = "rgba(238,233,221,0.56)";

/** Which capture fills each act's letterforms, per the brief. */
const FILL: Record<PillarId, { a: string; b: string }> = {
  design: { a: "/work/cgwalls/w/hero-1400.webp", b: "/work/sift/w/01-command-overview-1680.webp" },
  automate: {
    a: "/work/capitalcommand/w/01-overview-1680.webp",
    b: "/work/cadencestack/w/01-command-center-1680.webp",
  },
  grow: {
    a: "/work/cgwalls/w/gallery2-1400.webp",
    b: "/work/cadencestack/w/04-performance-analytics-1680.webp",
  },
};

/** A representative capture per study, for the proof thumbnails. */
const PROOF_SHOT: Record<string, string> = {
  "cg-walls-and-floors": "/work/cgwalls/w/hero-640.webp",
  capitalcommand: "/work/capitalcommand/w/01-overview-640.webp",
  sift: "/work/sift/w/01-command-overview-640.webp",
  cadencestack: "/work/cadencestack/w/01-command-center-640.webp",
};

const CLIENT: Record<string, string> = {
  "cg-walls-and-floors": "CG Walls & Floors",
  capitalcommand: "CapitalCommand",
  sift: "SIFT",
  cadencestack: "CadenceStack",
};

/* ── one service line ──────────────────────────────────────────────── */

function ServiceLine({
  name,
  proof,
  index,
  progress,
  from,
}: {
  name: string;
  proof: string[];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  from: number;
}) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  /* Each line masks up on its own slice of the act's scroll. */
  const start = from + 0.012 * index;
  const rise = useTransform(progress, [start, start + 0.05], [1, 0]);
  const riseRef = useScrollProp<HTMLSpanElement>(
    useTransform(rise, function toClip(v: number) {
      return `inset(${v * 100}% 0% 0% 0%)`;
    }),
    "clipPath"
  );
  const shot = proof.length ? PROOF_SHOT[proof[0]] : null;

  return (
    <li className="sa-line">
      <Link
        className={open ? "sa-link sa-link--on" : "sa-link"}
        to={`/services#${serviceSlug(name)}`}
        onMouseEnter={function on() {
          setOpen(true);
        }}
        onMouseLeave={function off() {
          setOpen(false);
        }}
        onFocus={function on() {
          setOpen(true);
        }}
        onBlur={function off() {
          setOpen(false);
        }}
      >
        <span
          ref={reduce ? undefined : (riseRef as React.Ref<HTMLSpanElement>)}
          className="sa-link__text"
        >
          {name}
        </span>
        <svg className="sa-arrow" viewBox="0 0 28 10" aria-hidden>
          <path d="M0 5 H24 M19 1 L24 5 L19 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {shot ? (
          <span className="sa-proof" aria-hidden>
            <img src={shot} alt="" width="120" height="68" loading="lazy" decoding="async" />
            <em>{CLIENT[proof[0]]}</em>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/* ── one act ───────────────────────────────────────────────────────── */

function Act({
  pillar,
  index,
  progress,
  active,
}: {
  pillar: PillarId;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  active: boolean;
}) {
  const reduce = !!useReducedMotion();
  const span = 1 / PILLAR_ORDER.length;
  const from = index * span;
  const to = from + span;

  /* The word slides in as the previous one slides out — one value. */
  const x = useTransform(
    progress,
    [from - span * 0.28, from, to - span * 0.22, to],
    ["18%", "0%", "0%", "-18%"],
    { ease: easing.inOut }
  );
  const fade = useTransform(
    progress,
    [from - span * 0.3, from - span * 0.06, to - span * 0.24, to - span * 0.02],
    [0, 1, 1, 0]
  );
  const fadeRef = useScrollStyle<HTMLDivElement>(fade);

  /* The work travels THROUGH the letters. */
  const pan = useTransform(progress, [from, to], ["0% 50%", "100% 50%"], { ease: easing.inOut });
  const panRef = useScrollProp<HTMLSpanElement>(pan, "backgroundPosition");

  return (
    <motion.div
      ref={fadeRef as React.Ref<HTMLDivElement>}
      className="sa-act"
      style={{ x }}
      aria-hidden={!active}
    >
      <h3 className="sa-word">
        <span
          ref={reduce ? undefined : (panRef as React.Ref<HTMLSpanElement>)}
          className="sa-word__fill"
          style={
            {
              backgroundImage: `linear-gradient(0deg, ${LIFT}, ${LIFT}), url(${FILL[pillar].a}), url(${FILL[pillar].b})`,
            } as React.CSSProperties
          }
        >
          {PILLAR_NAME[pillar]}
        </span>
      </h3>

      <ul className="sa-list">
        {PILLAR_SERVICES[pillar].map(function line(s, i) {
          return (
            <ServiceLine
              key={s.name}
              name={s.name}
              proof={s.proof}
              index={i}
              progress={progress}
              from={from + span * 0.1}
            />
          );
        })}
      </ul>
    </motion.div>
  );
}

/* ── the chapter ───────────────────────────────────────────────────── */

export default function ServiceActs() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [act, setAct] = useState(0);

  useEffect(function watch() {
    const mq = window.matchMedia("(max-width: 1023px)");
    function on(e: MediaQueryList | MediaQueryListEvent) {
      setNarrow(e.matches);
    }
    on(mq);
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", function track(p) {
    setAct(Math.min(2, Math.max(0, Math.floor(p * 3 * 0.999))));
  });

  const head = (
    <div className="sa-head">
      <p className="type-eyebrow sa-eyebrow">//_WHAT WE DO</p>
      <h2 className="type-h2 sa-h2">{LINE}</h2>
    </div>
  );

  const foot = (
    <div className="sa-foot">
      <MagneticCTA to="/services" variant="text" size="md" tone="dark">
        Watch all 16 being built
      </MagneticCTA>
    </div>
  );

  /* stacked: phones and reduced motion get all three acts, static fill */
  if (narrow || reduce) {
    return (
      <section className="sa sa--stacked">
        {head}
        {PILLAR_ORDER.map(function one(p) {
          return (
            <div key={p} className="sa-act sa-act--static">
              <h3 className="sa-word">
                <span
                  className="sa-word__fill"
                  style={
                    {
                      backgroundImage: `linear-gradient(0deg, ${LIFT}, ${LIFT}), url(${FILL[p].a}), url(${FILL[p].b})`,
                    } as React.CSSProperties
                  }
                >
                  {PILLAR_NAME[p]}
                </span>
              </h3>
              <ul className="sa-list">
                {PILLAR_SERVICES[p].map(function line(s) {
                  return (
                    <li key={s.name} className="sa-line">
                      <Link className="sa-link sa-link--static" to={`/services#${serviceSlug(s.name)}`}>
                        <span className="sa-link__text">{s.name}</span>
                        <svg className="sa-arrow" viewBox="0 0 28 10" aria-hidden>
                          <path d="M0 5 H24 M19 1 L24 5 L19 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        {foot}
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="sa-wrap">
      <section className="sa">
        {head}
        <div className="sa-stage">
          {PILLAR_ORDER.map(function one(p, i) {
            return (
              <Act key={p} pillar={p} index={i} progress={scrollYProgress} active={act === i} />
            );
          })}
        </div>
        {foot}
      </section>
    </div>
  );
}
