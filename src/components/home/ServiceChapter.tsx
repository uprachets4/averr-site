import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { easing, spring } from "../../lib/motion";
import { useScrollProp, useScrollStyle } from "../../lib/useScrollStyle";
import { PILLAR_SERVICES, serviceSlug, type PillarId } from "../../data/servicePillars";
import { caseStudies } from "../../data/caseStudies";

/**
 * The template every service chapter is cut from.
 *
 * One pinned frame on the dark ground: a 3D object that reacts to the
 * cursor and assembles with scroll, the giant word with real captures
 * moving inside its letterforms, a line addressed to the reader, and
 * that chapter's services as a ruled list that walks into /services.
 *
 * The chapter's own light is the page-wide layer's job, not this
 * component's — it only tints the word's edge so the type belongs to the
 * colour it is standing in.
 */

const PROOF_SHOT: Record<string, string> = {
  "cg-walls-and-floors": "/work/cgwalls/w/hero-640.webp",
  capitalcommand: "/work/capitalcommand/w/01-overview-640.webp",
  sift: "/work/sift/w/01-command-overview-640.webp",
  cadencestack: "/work/cadencestack/w/01-command-center-640.webp",
};

/** A parch wash over every fill: three of the captures are dark
 *  dashboards and a dark image inside dark letters is a smudge (§5.88).
 *  MEASURED per chapter, not guessed: with one wash for all four,
 *  PRODUCTS put 13% of its glyph pixels under the legibility floor and
 *  its median glyph read 145 against 226-240 for the others — the word
 *  went dull and the tail letters sank into the capture's dark panels.
 *  A chapter whose capture is dark asks for more wash. */
const LIFT_DEFAULT = 0.56;

export type ChapterSpec = {
  id: string;
  /** The giant word. */
  word: string;
  /** rgb of this chapter's light, for the word's edge. */
  tint: string;
  line: string;
  support: string;
  /** Which services, by pillar and name. */
  services: Array<{ pillar: PillarId; name: string }>;
  /** The two captures that fill the letterforms. */
  fill: [string, string];
  /** Parch wash over the fill, 0-1. Raise it for a dark capture. */
  lift?: number;
  /** The strongest case study for this chapter. */
  proof: string;
};

function ServiceLine({
  name,
  pillar,
  index,
  progress,
  from,
}: {
  name: string;
  pillar: PillarId;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  from: number;
}) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const start = from + 0.035 * index;
  const rise = useTransform(progress, [start, start + 0.08], [1, 0]);
  const riseRef = useScrollProp<HTMLSpanElement>(
    useTransform(rise, function clip(v: number) {
      return `inset(${v * 100}% 0% 0% 0%)`;
    }),
    "clipPath"
  );
  const svc = PILLAR_SERVICES[pillar].find(function f(s) {
    return s.name === name;
  });
  const shot = svc && svc.proof.length ? PROOF_SHOT[svc.proof[0]] : null;
  const client = svc && svc.proof.length ? caseStudies[svc.proof[0]]?.client : null;

  return (
    <li className="sc-line">
      <Link
        className={open ? "sc-link sc-link--on" : "sc-link"}
        to={`/services#${serviceSlug(name)}`}
        onMouseEnter={function on() { setOpen(true); }}
        onMouseLeave={function off() { setOpen(false); }}
        onFocus={function on() { setOpen(true); }}
        onBlur={function off() { setOpen(false); }}
      >
        <span ref={reduce ? undefined : (riseRef as React.Ref<HTMLSpanElement>)} className="sc-link__text">
          {name}
        </span>
        <svg className="sc-arrow" viewBox="0 0 28 10" aria-hidden>
          <path d="M0 5 H24 M19 1 L24 5 L19 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {shot ? (
          <span className="sc-proof" aria-hidden>
            <img src={shot} alt="" width="112" height="63" loading="lazy" decoding="async" />
            <em>{client}</em>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export default function ServiceChapter({
  spec,
  object,
  below,
}: {
  spec: ChapterSpec;
  /** An optional full-width row under the object and the copy. Ch3 uses
   *  it for its three proof tiles; the other chapters leave it empty and
   *  render exactly as before. */
  below?: ReactNode;
  /** The 3D object, given the chapter's own 0–1 assembly value. */
  object: (p: {
    assemble: ReturnType<typeof useScroll>["scrollYProgress"];
    tiltX: ReturnType<typeof useMotionValue<number>>;
    tiltY: ReturnType<typeof useMotionValue<number>>;
  }) => ReactNode;
}) {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* the word travels through its own letters */
  const pan = useTransform(scrollYProgress, [0.1, 0.95], ["8% 50%", "92% 50%"], { ease: easing.inOut });
  const panRef = useScrollProp<HTMLSpanElement>(pan, "backgroundPosition");

  /* the copy settles first */
  const copyFade = useTransform(scrollYProgress, [0.02, 0.16], [0, 1]);
  const copyRef = useScrollStyle<HTMLDivElement>(copyFade);
  const copyY = useTransform(scrollYProgress, [0.02, 0.2], [26, 0]);

  /* the object leans toward the cursor */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const tiltX = useSpring(rx, spring.soft);
  const tiltY = useSpring(ry, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
  }

  const body = (
    <>
      <h2 className="sc-word">
        <span
          ref={reduce ? undefined : (panRef as React.Ref<HTMLSpanElement>)}
          className="sc-word__fill"
          style={
            {
              "--sc-chars": spec.word.length,
              backgroundImage: (function wash() {
                const l = `rgba(238,233,221,${spec.lift ?? LIFT_DEFAULT})`;
                return `linear-gradient(0deg, ${l}, ${l}), url(${spec.fill[0]}), url(${spec.fill[1]})`;
              })(),
              /* Session 26: the edge carries the ONE accent, not the
                 live chapter hue — foreground accents are a single set
                 and the chapter's colour lives in the room's light. */
              WebkitTextStroke: `1px rgba(var(--accent-rgb), 0.5)`,
            } as React.CSSProperties
          }
        >
          {spec.word}
        </span>
      </h2>

      <motion.div
        ref={copyRef as React.Ref<HTMLDivElement>}
        className="sc-copy"
        style={reduce ? undefined : { y: copyY }}
      >
        <p className="sc-line-main">{spec.line}</p>
        <p className="sc-support">{spec.support}</p>
      </motion.div>

      <ul className="sc-list">
        {spec.services.map(function one(s, i) {
          return (
            <ServiceLine
              key={s.name}
              name={s.name}
              pillar={s.pillar}
              index={i}
              progress={scrollYProgress}
              from={0.2}
            />
          );
        })}
      </ul>

      <p className="sc-proof-link">
        <Link to={`/work/${spec.proof}`}>
          See it on {caseStudies[spec.proof]?.client}
          <span className="sc-arrow-tail" aria-hidden>→</span>
        </Link>
      </p>
    </>
  );

  if (reduce) {
    return (
      <section className="sc sc--still">
        <div className={below ? "sc-inner sc-inner--below" : "sc-inner"}>
          <div className="sc-object sc-object--still">{object({ assemble: scrollYProgress, tiltX, tiltY })}</div>
          <div className="sc-text">{body}</div>
          {below ? <div className="sc-below">{below}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="sc-wrap">
      <section className="sc">
        <div
          className={below ? "sc-inner sc-inner--below" : "sc-inner"}
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={function out() { rx.set(0); ry.set(0); }}
        >
          <div className="sc-object">{object({ assemble: scrollYProgress, tiltX, tiltY })}</div>
          <div className="sc-text">{body}</div>
          {below ? <div className="sc-below">{below}</div> : null}
        </div>
      </section>
    </div>
  );
}
