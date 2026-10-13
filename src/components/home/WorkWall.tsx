import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { easing, spring } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import { caseStudies } from "../../data/caseStudies";
import { SCREENSHOTS } from "../../data/screenshots";
import Screenshot from "../Screenshot";

/**
 * Chapter 6 — the work wall.
 *
 * Every real capture in the repository, hung on one 3D-tilted wall that
 * drifts slowly and leans toward the cursor. Hovering pulls a capture
 * forward with its project and — only where caseStudies.ts has one — its
 * verified figure; clicking opens the case study.
 *
 * This replaces both the cream template wall and the film strip. It is
 * the same family as the hero's room without repeating its mechanic:
 * the hero is a camera flying THROUGH a sparse field, this is a dense
 * wall you read across.
 */

const CLIENT: Record<string, string> = {};
const FIGURE: Record<string, { value: string; caption: string } | undefined> = {};
for (const st of Object.values(caseStudies)) {
  CLIENT[st.slug] = st.client;
  FIGURE[st.slug] = st.headlineFigure;
}

/** Which project a capture belongs to, from its own path. */
const DIR_TO_SLUG: Record<string, string> = {
  cgwalls: "cg-walls-and-floors",
  capitalcommand: "capitalcommand",
  sift: "sift",
  cadencestack: "cadencestack",
};

/** Every capture the pipeline knows, once each, in project order. */
const TILES = Object.keys(SCREENSHOTS)
  .filter(function real(src) {
    return src.startsWith("/work/");
  })
  .map(function toTile(src) {
    const dir = src.split("/")[2];
    return { src, slug: DIR_TO_SLUG[dir] };
  })
  .filter(function known(t) {
    return !!t.slug;
  })
  .sort(function byProject(a, b) {
    return a.slug.localeCompare(b.slug) || a.src.localeCompare(b.src);
  });

export default function WorkWall() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* the wall drifts across as the chapter is read */
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-14%"], { ease: easing.inOut });
  const headFade = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headRef = useScrollStyle<HTMLDivElement>(headFade);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const tiltX = useSpring(rx, spring.soft);
  const tiltY = useSpring(ry, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  }

  const tiles = (
    <motion.div
      className="ww-wall"
      style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, x, transformPerspective: 1800 }}
    >
      {TILES.map(function tile(t) {
        const fig = FIGURE[t.slug];
        const on = hover === t.src;
        return (
          <Link
            key={t.src}
            to={`/work/${t.slug}`}
            className={on ? "ww-tile ww-tile--on" : "ww-tile"}
            onMouseEnter={function e() { setHover(t.src); }}
            onMouseLeave={function l() { setHover(function c(cur) { return cur === t.src ? null : cur; }); }}
            onFocus={function f() { setHover(t.src); }}
            onBlur={function b() { setHover(function c(cur) { return cur === t.src ? null : cur; }); }}
            aria-label={`${CLIENT[t.slug]} — open the case study`}
          >
            <Screenshot
              src={t.src}
              alt=""
              sizes="(min-width: 1024px) 18vw, 44vw"
              loading="lazy"
              style={{ height: "100%", objectFit: "cover" }}
            />
            <span className="ww-meta">
              <span className="ww-meta__name">{CLIENT[t.slug]}</span>
              {fig ? (
                <span className="ww-meta__fig">
                  <b>{fig.value}</b> {fig.caption}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </motion.div>
  );

  const head = (
    <div ref={reduce ? undefined : (headRef as React.Ref<HTMLDivElement>)} className="ww-head">
      <p className="type-eyebrow ww-eyebrow">//_SELECTED WORK</p>
      <h2 className="type-h2 ww-h2">This is the work.</h2>
      <p className="ww-sub">Want the full story behind each one?</p>
      <Link to="/work" className="ww-vault">
        <span className="ws-doors" aria-hidden>
          <span className="ws-door ws-door--l" />
          <span className="ws-door ws-door--r" />
          <span className="ws-doors__gap" />
        </span>
        <span className="ws-end__label">Open the vault</span>
        <span className="ws-end__arrow" aria-hidden>→</span>
      </Link>
    </div>
  );

  if (reduce) {
    return (
      <section className="ww ww--still">
        {head}
        {tiles}
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="ww-wrap">
      <section className="ww">
        <div className="ww-stage" ref={stageRef} onMouseMove={onMove} onMouseLeave={function out() { rx.set(0); ry.set(0); }}>
          {tiles}
        </div>
        {head}
      </section>
    </div>
  );
}
