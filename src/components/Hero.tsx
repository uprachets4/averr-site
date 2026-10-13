import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import PillHl from "./PillHl";
import TorontoClock from "./TorontoClock";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useScrollStyle } from "../lib/useScrollStyle";
import PieceField from "./home/PieceField";

/**
 * The home hero.
 *
 * A dark room with the studio's actual work hanging in it, a headline
 * in the clear, and a scroll that flies the camera forward through the
 * field until it lands square on the first real project. Everything in
 * the room is real: twelve case-study captures through the WebP
 * pipeline and four of the live /services screens.
 */

/* ── copy ──────────────────────────────────────────────────────────── */

const EYEBROW = "A boutique studio · Toronto";
/* Session 25c: the headline is the claim, not the inventory. The four
   services are the subline's job — it already lists them — and a short
   lead is what lets the type reach the size the hero needs. The break
   is explicit rather than left to wrapping so the two lead lines are
   always the same two lines. */
const LEAD_A = "We build what";
const LEAD_B = "your business";
const SLAB = "runs on.";
const H1_SENTENCE = "We build what your business runs on.";
const SUBLINE =
  "Websites, web apps and SaaS products, AI automation and marketing for businesses across the GTA. One studio, start to finish.";
const KICKER =
  "We design premium websites, build AI automations, and run the marketing engines that grow businesses like yours across the GTA.";

const T = {
  topRow: 0.2,
  lead: 0.3,
  slab: 0.52,
  subline: 0.72,
  kicker: 0.86,
  ctaPrimary: 0.98,
  ctaSecondary: 1.06,
  cue: 1.3,
};

const FLAT_QUERY = "(max-width: 1023px)";
const SHORT_QUERY = "(max-height: 639px)";

function useHeroMode() {
  const reduce = useReducedMotion();
  const [flat, setFlat] = useState(false);
  const [short, setShort] = useState(false);
  useEffect(function watch() {
    const pairs: Array<[string, (v: boolean) => void]> = [
      [FLAT_QUERY, setFlat],
      [SHORT_QUERY, setShort],
    ];
    const offs = pairs.map(function bind([q, set]) {
      const mq = window.matchMedia(q);
      function on(e: MediaQueryList | MediaQueryListEvent) {
        set(e.matches);
      }
      on(mq);
      mq.addEventListener("change", on);
      return function off() {
        mq.removeEventListener("change", on);
      };
    });
    return function cleanup() {
      for (const off of offs) off();
    };
  }, []);
  return { narrow: flat, short, reduce: !!reduce };
}

/** True once the reader has scrolled — the film then completes instantly. */
function useScrolledEarly() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(function watchScroll() {
    if (window.scrollY > 4) {
      setScrolled(true);
      return;
    }
    let done = false;
    function onScroll() {
      if (done || window.scrollY <= 4) return;
      done = true;
      setScrolled(true);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(function over() {
      done = true;
      window.removeEventListener("scroll", onScroll);
    }, 2100);
    return function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return scrolled;
}

/* ── the copy block ────────────────────────────────────────────────── */

/** Deterministic ±8ms jitter, so the typing is not metronomic and the
 *  same character always lands at the same time between renders. */
function jitter(i: number) {
  return (((i * 2654435761) % 17) - 8) | 0;
}

/**
 * A headline line that types itself.
 *
 * THE WHOLE LINE PAINTS AT FRAME ONE at 0.12 — the LCP element is the
 * text, present and laid out from the first paint, so the entrance
 * cannot move LCP. Each character then inks 0.12 → 1 with a 2px rise on
 * its own delay, and a parch caret steps along the line.
 *
 * It is all CSS: one class per character and an `--i`, rather than
 * twenty-six motion values per line.
 */
function TypedLine({
  text,
  start,
  instant,
}: {
  text: string;
  /** Seconds before this line starts typing. */
  start: number;
  instant: boolean;
}) {
  const chars = Array.from(text);
  if (instant) return <span className="hx-typed hx-typed--instant">{text}</span>;
  return (
    <span
      className="hx-typed"
      style={{ "--n": chars.length, "--start": `${start}s` } as React.CSSProperties}
    >
      {chars.map(function ch(c, i) {
        return (
          <span
            key={i}
            className="hx-ch"
            style={{ "--i": i, "--j": `${jitter(i)}ms` } as React.CSSProperties}
          >
            {c === " " ? "\u00A0" : c}
          </span>
        );
      })}
      <span className="hx-caret" aria-hidden />
    </span>
  );
}

function HeroCopy({ skip }: { skip: boolean }) {
  const reduce = useReducedMotion();
  const instant = reduce || skip;
  const d = (v: number) => (instant ? 0 : v);

  return (
    <div className="hx-copy">
      <motion.div
        className="hx-top"
        initial={{ opacity: 1, y: instant ? 0 : 8 }}
        animate={{ y: 0 }}
        transition={{ duration: instant ? 0 : duration.base, ease: ease.outQuart, delay: d(T.topRow) }}
      >
        <div className="type-eyebrow hx-eyebrow">{EYEBROW}</div>
        <motion.div
          className="hx-clock"
          initial={{ opacity: instant ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: instant ? 0 : 0.5, ease: ease.outQuart, delay: d(T.topRow) }}
        >
          {/* TorontoClock paints --color-muted INLINE, which is a token
              for cream grounds: on the dark hero it measured 3.23:1 at
              13px and failed AA. Only its own style prop can beat an
              inline colour; --color-muted-l is the dark sibling, 5.54:1. */}
          <TorontoClock style={{ color: "var(--color-muted-l)" }} />
        </motion.div>
      </motion.div>

      {/* The accessible name is the plain sentence; the visible halves
          are hidden from assistive tech so it is not read twice. */}
      <h1 className="hx-h1">
        <span className="sr-only">{H1_SENTENCE}</span>
        <span aria-hidden="true">
          <span className="type-hero hx-line hx-line--a">
            <TypedLine text={LEAD_A} start={d(T.lead)} instant={instant} />
          </span>
          <span className="type-hero hx-line">
            <TypedLine text={LEAD_B} start={d(T.lead) + (instant ? 0 : LEAD_A.length * 0.032)} instant={instant} />
          </span>
          <span className={instant ? "type-hero hx-line hx-line--slab" : "type-hero hx-line hx-line--slab hx-slam"}>
            <PillHl entrance="slab" invert delay={0} skip>
              {SLAB}
            </PillHl>
          </span>
        </span>
      </h1>

      <motion.p
        className="type-body-lg hx-sub"
        initial={{ opacity: 1, y: instant ? 0 : 10 }}
        animate={{ y: 0 }}
        transition={{ duration: instant ? 0 : duration.base, ease: ease.outQuart, delay: d(T.subline) }}
      >
        {SUBLINE}
      </motion.p>

      <motion.p
        className="hx-kicker"
        initial={{ opacity: 1, y: instant ? 0 : 10 }}
        animate={{ y: 0 }}
        transition={{ duration: instant ? 0 : duration.base, ease: ease.outQuart, delay: d(T.kicker) }}
      >
        {KICKER}
      </motion.p>

      <div className="hx-ctas">
        <motion.div
          initial={{ opacity: 1, y: instant ? 0 : 12, scale: instant ? 1 : 0.96 }}
          animate={{ y: 0, scale: 1 }}
          transition={instant ? { duration: 0 } : { delay: d(T.ctaPrimary), ...spring.snappy }}
          style={{ display: "inline-flex" }}
        >
          <MagneticCTA to="/contact" variant="primary" tone="dark">
            Book a discovery call
          </MagneticCTA>
        </motion.div>
        <motion.div
          initial={{ opacity: 1, y: instant ? 0 : 12, scale: instant ? 1 : 0.96 }}
          animate={{ y: 0, scale: 1 }}
          transition={instant ? { duration: 0 } : { delay: d(T.ctaSecondary), ...spring.snappy }}
          style={{ display: "inline-flex" }}
        >
          <a className="hx-jump" href="#ch-websites">
            See what we build <span aria-hidden>↓</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ── pinned: the fly-through ───────────────────────────────────────── */

function PinnedHero({ skip, narrow }: { skip: boolean; narrow: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(frameRef, { margin: "20% 0px" });
  const setNavDark = useSetNavDarkOverride();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /** The dolly: the camera's whole journey through the room, one value. */
  const dolly = useTransform(scrollYProgress, [0.04, 0.72], [0, 1]);

  /* The copy lifts and goes early. Opacity is written straight to the
     node: motion accelerates scroll-linked opacity onto a ViewTimeline,
     which is meaningless inside a pin (lib/useScrollStyle.ts). */
  const copyFade = useTransform(scrollYProgress, [0.02, 0.2], [1, 0]);
  const copyRef = useScrollStyle<HTMLDivElement>(copyFade);
  const copyY = useTransform(scrollYProgress, [0.02, 0.24], [0, -70]);
  /* The vignette exists to hold AA contrast behind the headline. Once
     the headline has gone it is just darkness over the fly-through —
     the middle of the pin was at about a third of its brightness. */
  const vigFade = useTransform(scrollYProgress, [0.005, 0.20], [1, 0]);
  const vigRef = useScrollStyle<HTMLDivElement>(vigFade);

  /* THE GATHER REPLACES THE LANDING. The camera used to fly to a real
     capture and park on it; the hero now ends on the pieces themselves
     swirling into a formation that chapter two picks up, so there is no
     cut and — the point of this session — no screenshot anywhere on
     home outside the work section. The field no longer fades out: it IS
     the hand-over. */
  const fieldFade = useTransform(scrollYProgress, [0.9, 1], [1, 0.9]);
  const fieldRef = useScrollStyle<HTMLDivElement>(fieldFade);

  const [cueGone, setCueGone] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", function p(v) {
    setCueGone(v > 0.004);
  });

  useEffect(
    function navTone() {
      setNavDark(inView);
      return function reset() {
        setNavDark(false);
      };
    },
    [inView, setNavDark]
  );

  return (
    <div ref={wrapRef} className={narrow ? "hx-wrap hx-wrap--narrow" : "hx-wrap"}>
      <div ref={frameRef} className="hx-frame">
        <div ref={fieldRef as React.Ref<HTMLDivElement>} className="hx-fieldlayer">
          <PieceField dolly={dolly} inView={inView} />
        </div>

        <div ref={vigRef as React.Ref<HTMLDivElement>} className="hx-vignette" aria-hidden />

        <motion.div ref={copyRef as React.Ref<HTMLDivElement>} className="hx-copylayer" style={{ y: copyY }}>
          <HeroCopy skip={skip} />
        </motion.div>

        <ScrollCue hidden={cueGone} skip={skip} />
      </div>
    </div>
  );
}

function ScrollCue({ hidden, skip }: { hidden: boolean; skip: boolean }) {
  const reduce = useReducedMotion();
  const instant = reduce || skip;
  return (
    <motion.div
      aria-hidden
      className="hx-cue"
      initial={{ opacity: instant ? 1 : 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: instant ? 0 : duration.base, delay: hidden || instant ? 0 : T.cue }}
    >
      <span className="type-eyebrow">SCROLL</span>
      <span className="hx-cue__rail">
        <motion.span
          className="hx-cue__run"
          initial={{ scaleY: 0 }}
          animate={reduce ? { scaleY: 1 } : { scaleY: [0, 1, 1, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.4, times: [0, 0.4, 0.75, 1], repeat: Infinity, ease: ease.inOut, delay: skip ? 0 : T.cue }
          }
        />
      </span>
    </motion.div>
  );
}

/** Two refs on one node. */

/* ── flat: phones, short windows, reduced motion ───────────────────── */

function FlatHero({ skip }: { skip: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { margin: "20% 0px" });
  const setNavDark = useSetNavDarkOverride();
  /** No dolly here: the flat hero does not fly anywhere. */
  const still = useMotionValue(0);

  useEffect(
    function navTone() {
      setNavDark(inView);
      return function reset() {
        setNavDark(false);
      };
    },
    [inView, setNavDark]
  );

  return (
    <section ref={ref} className="hx-frame hx-frame--flat">
      <div className="hx-fieldlayer">
        <PieceField dolly={still} inView={inView} />
      </div>
      <div className="hx-vignette" aria-hidden />
      <div className="hx-copylayer">
        <HeroCopy skip={skip} />
      </div>
    </section>
  );
}

/* ── entry ─────────────────────────────────────────────────────────── */

export default function Hero() {
  const { narrow, short, reduce } = useHeroMode();
  const skip = useScrolledEarly();
  /* The phone pins too — a shorter SCALE-THROUGH rather than the full
     fly — so the hero still hands over to the work instead of simply
     scrolling away. Only a short window or reduced motion falls back to
     the flat hero. */
  const pinned = !short && !reduce;

  if (pinned) {
    return (
      <div data-hero-wrapper>
        <PinnedHero skip={skip} narrow={narrow} />
      </div>
    );
  }
  return <FlatHero skip={skip} />;
}
