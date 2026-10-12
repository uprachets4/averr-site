import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { duration, ease, easing, spring } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import { caseStudies } from "../../data/caseStudies";
import Screenshot from "../Screenshot";
import MagneticCTA from "../MagneticCTA";

/**
 * Chapter 2 — the work.
 *
 * A film strip of the case studies that a vertical scroll pans
 * horizontally, inside one pinned frame driven by one scroll value.
 * Hovering or focusing a card plays it: its own screenshots crossfade
 * under a slow Ken-Burns drift, the card leans toward the cursor, and
 * its siblings dim. Clicking opens the case study through the site's ink
 * wipe like any other link.
 *
 * TWO DATA GAPS, both reported rather than invented:
 *
 * 1. Only two of the four live studies carry a `headlineFigure` —
 *    CG Walls & Floors (85%) and SIFT (42%). CapitalCommand and
 *    CadenceStack have none, so their cards print the sector and the
 *    pillars instead. Nothing here makes a number up.
 * 2. CareerClarity AI is a `draft()` record: no screenshots exist for
 *    it under public/work/ and every copy field is empty. It appears as
 *    a text-only "in progress" card. It cannot have the screenshot the
 *    other cards have until the asset exists.
 */

type Card = {
  slug: string;
  client: string;
  sector: string;
  pillars: string[];
  images: string[];
  figure?: { value: string; caption: string };
  draft?: boolean;
};

const CARDS: Card[] = Object.values(caseStudies)
  .filter(function hasAPlace(s) {
    return s.status === "live" || s.slug === "careerclarity-ai";
  })
  .map(function toCard(s) {
    return {
      slug: s.slug,
      client: s.client,
      sector: s.sector,
      pillars: s.pillars,
      images: (s.heroImages ?? []).slice(0, 3),
      figure: s.headlineFigure,
      draft: s.status === "draft",
    };
  });

/* ── one card ──────────────────────────────────────────────────────── */

function StripCard({
  card,
  playing,
  onPlay,
  onStop,
  dim,
}: {
  card: Card;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  dim: boolean;
}) {
  const reduce = !!useReducedMotion();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState(0);

  /* the lean */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, spring.soft);
  const sry = useSpring(ry, spring.soft);

  /* playing crossfades the project's own screenshots */
  useLayoutEffect(
    function play() {
      if (!playing || reduce || card.images.length < 2) return;
      const t = window.setInterval(function next() {
        setFrame(function step(f) {
          return (f + 1) % card.images.length;
        });
      }, 1900);
      return function stop() {
        window.clearInterval(t);
      };
    },
    [playing, reduce, card.images.length]
  );

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  }

  const body = (
    <motion.div
      ref={boxRef}
      className="ws-card"
      style={{ rotateX: reduce ? 0 : srx, rotateY: reduce ? 0 : sry, transformPerspective: 1200 }}
      onMouseMove={onMove}
      onMouseEnter={onPlay}
      onMouseLeave={function out() {
        rx.set(0);
        ry.set(0);
        onStop();
      }}
      animate={{ opacity: dim ? 0.7 : 1 }}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
    >
      <div className="ws-shot">
        {card.images.length ? (
          card.images.map(function img(src, i) {
            return (
              <div
                key={src}
                className={
                  i === frame
                    ? playing && !reduce
                      ? "ws-layer ws-layer--on ws-layer--drift"
                      : "ws-layer ws-layer--on"
                    : "ws-layer"
                }
              >
                <Screenshot
                  src={src}
                  alt={`${card.client} — screen ${i + 1}`}
                  sizes="(min-width: 1024px) 42vw, 82vw"
                  loading="lazy"
                />
              </div>
            );
          })
        ) : (
          /* CareerClarity: no capture exists, so the card says so rather
             than showing a grey rectangle pretending to be one */
          <div className="ws-noshot">
            <span className="ws-noshot__mark" aria-hidden />
            <span className="ws-noshot__text">In progress — no public screens yet</span>
          </div>
        )}
        {card.draft ? <span className="ws-flag">In progress</span> : null}
      </div>

      <div className="ws-meta">
        <span className="ws-name">{card.client}</span>
        {card.figure ? (
          <span className="ws-fig">
            <span className="ws-fig__v">{card.figure.value}</span>
            <span className="ws-fig__c">{card.figure.caption}</span>
          </span>
        ) : (
          <span className="ws-fig">
            <span className="ws-fig__c">{card.sector}</span>
            <span className="ws-fig__c ws-fig__c--thin">{card.pillars.join(" · ")}</span>
          </span>
        )}
      </div>
    </motion.div>
  );

  if (card.draft) {
    /* nowhere to go: the case study does not exist yet */
    return (
      <li className="ws-item" onFocus={onPlay} onBlur={onStop}>
        {body}
      </li>
    );
  }
  return (
    <li className="ws-item">
      <Link
        to={`/work/${card.slug}`}
        className="ws-link"
        onFocus={onPlay}
        onBlur={onStop}
        aria-label={`${card.client} — open the case study`}
      >
        {body}
      </Link>
    </li>
  );
}

/* ── the chapter ───────────────────────────────────────────────────── */

export default function WorkStrip() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLUListElement | null>(null);
  const [overflow, setOverflow] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [stacked, setStacked] = useState(false);

  useLayoutEffect(function watch() {
    const mq = window.matchMedia("(max-width: 1023px)");
    function on(e: MediaQueryList | MediaQueryListEvent) {
      setStacked(e.matches);
    }
    on(mq);
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);

  useLayoutEffect(function measure() {
    function run() {
      const row = rowRef.current;
      if (!row) return;
      setOverflow(Math.max(0, row.scrollWidth - row.clientWidth));
    }
    run();
    const ro = new ResizeObserver(run);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener("resize", run);
    return function off() {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [stacked]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /* ONE value: the heading settles, then the strip pans. */
  const x = useTransform(scrollYProgress, [0.16, 0.94], [0, -overflow], { ease: easing.inOut });
  const headFade = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const headY = useTransform(scrollYProgress, [0, 0.16], [34, 0]);
  const headRef = useScrollStyle<HTMLDivElement>(headFade);

  const pinned = !stacked && !reduce;

  const strip = (
    <ul
      ref={rowRef}
      className={stacked ? "ws-row ws-row--snap" : "ws-row"}
      aria-label="Selected work"
    >
      {CARDS.map(function one(c) {
        return (
          <StripCard
            key={c.slug}
            card={c}
            playing={playing === c.slug}
            onPlay={function go() {
              setPlaying(c.slug);
            }}
            onStop={function stop() {
              setPlaying(function clear(current: string | null) {
                return current === c.slug ? null : current;
              });
            }}
            dim={playing !== null && playing !== c.slug}
          />
        );
      })}
      <li className="ws-item ws-item--end">
        <Link to="/work" className="ws-end">
          {/* A teaser of /work's doors, not the mechanic itself: two
              cream panels part a little on hover. The full thing lives
              on /work and home does not copy another page's signature. */}
          <span className="ws-doors" aria-hidden>
            <span className="ws-door ws-door--l" />
            <span className="ws-door ws-door--r" />
            <span className="ws-doors__gap" />
          </span>
          <span className="ws-end__label">Open the vault</span>
          <span className="ws-end__arrow" aria-hidden>→</span>
        </Link>
      </li>
    </ul>
  );

  const head = (
    <motion.div
      ref={pinned ? (headRef as React.Ref<HTMLDivElement>) : undefined}
      className="ws-head"
      style={pinned ? { y: headY } : undefined}
    >
      <div className="type-eyebrow ws-eyebrow">//_SELECTED WORK</div>
      <h2 className="type-h2 measure-wide ws-h2">Here's the real thing.</h2>
    </motion.div>
  );

  if (!pinned) {
    return (
      <section className="ws ws--stacked">
        {head}
        {strip}
        <div className="ws-cta">
          <MagneticCTA to="/work" variant="text" size="md" tone="dark">
            See all work
          </MagneticCTA>
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="ws-wrap">
      <section className="ws ws--pinned">
        {head}
        <motion.div className="ws-track" style={{ x }}>
          {strip}
        </motion.div>
        <div className="ws-cta">
          <MagneticCTA to="/work" variant="text" size="md" tone="dark">
            See all work
          </MagneticCTA>
        </div>
      </section>
    </div>
  );
}

export { CARDS as WORK_CARDS };
