import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { easing } from "../../lib/motion";
import { useScrollProp, useScrollStyle } from "../../lib/useScrollStyle";
import { SCENES } from "../../data/homeScenes";
import Screenshot from "../Screenshot";

/**
 * Chapter 2 — "You've seen this website before."
 *
 * A wall of identical template sites fills the frame. One scroll value
 * pulls a single card out of the grid, pushes the rest back, and wipes
 * a REAL project screenshot over the skeleton it was — the argument the
 * studio has always made, staged instead of stated.
 *
 * THE COPY IS RESTORED, NOT REWRITTEN. The three beats come verbatim
 * from `src/data/homeScenes.ts`, which survived the Session 22 removal
 * of `ThreeScenes.tsx` (deleted in `b8dd1bc`) — the component went, the
 * copy did not. Nothing here is invented except the chapter's own h2.
 */

const H2 = "You've seen this website before.";

/** 14 cards; the one that breaks out sits just off centre. */
const COUNT = 14;
const HERO_INDEX = 6;

/** The real project the chosen card becomes. */
const REAL = {
  src: "/work/cgwalls/hero.jpg",
  alt: "CG Walls & Floors — the site Averr built",
  client: "CG Walls & Floors",
};

/**
 * One card in the wall, with its own scroll-linked entrance.
 *
 * The wall ASSEMBLES card by card as the cream slab passes over the
 * hero's receding frame, rather than being there the moment the chapter
 * arrives. Each card owns a slice of the same one scroll value, offset
 * by its index, so the stagger is the reader's scroll and not a timer.
 */
function WallCard({
  index,
  chosen,
  progress,
}: {
  index: number;
  chosen: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const from = 0.004 * index;
  const fade = useTransform(progress, [from, from + 0.05], [0, 1]);
  const ref = useScrollStyle<HTMLDivElement>(fade);
  const y = useTransform(progress, [from, from + 0.06], [22, 0]);
  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={chosen ? "tw-card tw-card--chosen" : "tw-card"}
      style={{ y }}
    >
      <Skeleton />
    </motion.div>
  );
}

/** A generic template site, drawn in grey. Legible as a website, and
 *  deliberately like every other card on the wall. */
function Skeleton() {
  return (
    <span className="tw-skel" aria-hidden>
      <span className="tw-skel__nav">
        <i className="tw-skel__logo" />
        <i className="tw-skel__link" />
        <i className="tw-skel__link" />
        <i className="tw-skel__link" />
        <i className="tw-skel__cta" />
      </span>
      <span className="tw-skel__hero">
        <i className="tw-skel__h1" />
        <i className="tw-skel__h1 tw-skel__h1--short" />
        <i className="tw-skel__body" />
        <i className="tw-skel__body tw-skel__body--short" />
        <i className="tw-skel__btn" />
      </span>
      {/* the middle of a template site, so the card reads as GENERIC
          rather than as an unfinished skeleton */}
      <span className="tw-skel__band">
        <i className="tw-skel__tile" />
        <span className="tw-skel__col">
          <i className="tw-skel__body" />
          <i className="tw-skel__body tw-skel__body--short" />
          <i className="tw-skel__body" />
        </span>
      </span>
      <span className="tw-skel__row">
        <i /><i /><i />
      </span>
    </span>
  );
}

function Beat({
  scene,
  from,
  to,
  progress,
}: {
  scene: (typeof SCENES)[number];
  from: number;
  to: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  /* Each beat owns a window and is invisible outside it, so two never
     overlap. Opacity is written to the node — this is a sticky frame. */
  const fade = useTransform(
    progress,
    [from, from + 0.05, to - 0.05, to],
    [0, 1, 1, 0]
  );
  const ref = useScrollStyle<HTMLDivElement>(fade);
  const y = useTransform(progress, [from, to], [18, -18]);

  return (
    <motion.div ref={ref as React.Ref<HTMLDivElement>} className="tw-beat" style={{ y }}>
      <p className="type-eyebrow tw-beat__eyebrow">{scene.eyebrow}</p>
      <p className="tw-beat__line">
        {scene.segments.map(function seg(s, i) {
          return s.accent ? (
            <em key={i} className="type-accent">{s.text}</em>
          ) : (
            <span key={i}>{s.text} </span>
          );
        })}
      </p>
      <p className="tw-beat__body">{scene.body}</p>
    </motion.div>
  );
}

export default function TemplateWall() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(function watch() {
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

  /* ── the one value ── */
  /** The wall recedes as the chosen card comes forward. */
  const wallFade = useTransform(scrollYProgress, [0.16, 0.44], [1, 0.12]);
  const wallRef = useScrollStyle<HTMLDivElement>(wallFade);
  const wallScale = useTransform(scrollYProgress, [0.16, 0.5], [1, 0.94], { ease: easing.inOut });
  /* The h2 has made its point by the time the card grows through it. */
  const headFade = useTransform(scrollYProgress, [0.26, 0.44], [1, 0]);
  const headRef = useScrollStyle<HTMLDivElement>(headFade);

  /** The chosen card lifts out of the grid and fills the stage. */
  const heroScale = useTransform(scrollYProgress, [0.2, 0.56], [1, 2.35], { ease: easing.inOut });
  const heroY = useTransform(scrollYProgress, [0.2, 0.56], [0, -40], { ease: easing.inOut });
  const heroLift = useTransform(scrollYProgress, [0.18, 0.3], [0, 1]);
  const heroLiftRef = useScrollStyle<HTMLDivElement>(heroLift);

  /** The real work wipes over the skeleton — a reveal, never a cut. */
  const revealClip = useTransform(
    scrollYProgress,
    [0.46, 0.72],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
    { ease: easing.inOut }
  );
  const revealRef = useScrollProp<HTMLDivElement>(revealClip, "clipPath");

  /** The caption that names what you are looking at. */
  const capFade = useTransform(scrollYProgress, [0.74, 0.82], [0, 1]);
  const capRef = useScrollStyle<HTMLDivElement>(capFade);

  const cards = Array.from({ length: narrow ? 9 : COUNT }, function n(_, i) {
    return i;
  });
  const heroAt = narrow ? 4 : HERO_INDEX;

  /* ── reduced motion: the final state, stated plainly ── */
  if (reduce) {
    return (
      <section className="tw tw--still">
        <div className="tw-head">
          <p className="type-eyebrow tw-eyebrow">//_THE STUDIO</p>
          <h2 className="type-h2 tw-h2">{H2}</h2>
        </div>
        <div className="tw-stillgrid">
          <div className="tw-card tw-card--real">
            <Screenshot
              src={REAL.src}
              alt={REAL.alt}
              sizes="(min-width: 1024px) 52vw, 88vw"
              loading="lazy"
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="tw-stillcopy">
          {SCENES.map(function beat(s) {
            return (
              <div key={s.eyebrow} className="tw-beat tw-beat--still">
                <p className="type-eyebrow tw-beat__eyebrow">{s.eyebrow}</p>
                <p className="tw-beat__line">
                  {s.segments.map(function seg(x, i) {
                    return x.accent ? (
                      <em key={i} className="type-accent">{x.text}</em>
                    ) : (
                      <span key={i}>{x.text} </span>
                    );
                  })}
                </p>
                <p className="tw-beat__body">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="tw-wrap">
      <section className="tw">
        <div ref={headRef as React.Ref<HTMLDivElement>} className="tw-head">
          <p className="type-eyebrow tw-eyebrow">//_THE STUDIO</p>
          <h2 className="type-h2 tw-h2">{H2}</h2>
        </div>

        <div className="tw-stage">
          {/* the wall of sameness */}
          <motion.div
            ref={wallRef as React.Ref<HTMLDivElement>}
            className={narrow ? "tw-grid tw-grid--narrow" : "tw-grid"}
            style={{ scale: wallScale }}
            aria-hidden
          >
            {cards.map(function card(i) {
              return (
                <WallCard key={i} index={i} chosen={i === heroAt} progress={scrollYProgress} />
              );
            })}
          </motion.div>

          {/* the one that breaks out, in its own layer so it can out-scale
              the grid without the grid reflowing */}
          <motion.div
            ref={heroLiftRef as React.Ref<HTMLDivElement>}
            className="tw-chosen"
            style={{ scale: heroScale, y: heroY }}
          >
            <div className="tw-chosen__inner">
              <Skeleton />
              <div
                ref={revealRef as React.Ref<HTMLDivElement>}
                className="tw-chosen__real"
              >
                {/* Two things this component gets wrong for a card that
                    SCALES: its inline `height: auto` letterboxes the
                    capture, and a `sizes` matching the card's layout
                    width makes the browser pick a 640w rung that is then
                    blown up 2.35x. `sizes` is pinned near the viewport so
                    the largest rung (1400w) is chosen from the start. */}
                <Screenshot
                  src={REAL.src}
                  alt={REAL.alt}
                  sizes="96vw"
                  loading="lazy"
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div ref={capRef as React.Ref<HTMLDivElement>} className="tw-caption">
              <span className="tw-caption__name">{REAL.client}</span>
              <span className="tw-caption__note">Built from their world, not a layout we had lying around.</span>
            </div>
          </motion.div>
        </div>

        {/* the restored argument, one beat at a time */}
        <div className="tw-beats">
          <Beat scene={SCENES[0]} from={0.0} to={0.3} progress={scrollYProgress} />
          <Beat scene={SCENES[1]} from={0.33} to={0.63} progress={scrollYProgress} />
          <Beat scene={SCENES[2]} from={0.66} to={0.98} progress={scrollYProgress} />
        </div>
      </section>
    </div>
  );
}

export { H2 as TEMPLATE_WALL_H2 };
