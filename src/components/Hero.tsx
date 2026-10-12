import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { duration, ease, easing, spring } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import LineReveal from "./LineReveal";
import TorontoClock from "./TorontoClock";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useScrollStyle } from "../lib/useScrollStyle";
import { useBusinessName } from "../lib/businessName";
import NameField from "./home/NameField";
import SketchWindow from "./home/SketchWindow";

/* ── copy ──────────────────────────────────────────────────────────── */

const EYEBROW = "A boutique studio · Toronto";
const LEAD = "Let's make";
const TAIL = "the one they choose.";
/** What a screen reader hears for the heading. */
const H1_SENTENCE = "Let's make your business the one they choose.";
const KICKER =
  "We design premium websites, build AI automations, and run the marketing engines that grow businesses like yours across the GTA.";

/* ── load choreography, seconds from mount ─────────────────────────── */

type Film = typeof T_DESKTOP;

const T_DESKTOP = {
  topRow: 0.25,
  lead1: 0.35,
  field: 0.6,
  tail: 0.75,
  kicker: 1.0,
  ctaPrimary: 1.15,
  ctaSecondary: 1.23,
  scrollCue: 1.4,
  scale: 1,
};

const T_MOBILE: Film = {
  topRow: 0.12,
  lead1: 0.18,
  field: 0.32,
  tail: 0.4,
  kicker: 0.5,
  ctaPrimary: 0.6,
  ctaSecondary: 0.68,
  scrollCue: 0.75,
  scale: 0.5,
};

const MOBILE_QUERY = "(max-width: 767px)";
const SHORT_QUERY = "(max-height: 699px)";
/** Below this the hero stacks and the page scrolls — a pinned frame is
 *  100vh and clips, and a stacked composition does not fit inside one. */
const FLAT_QUERY = "(max-width: 1023px)";

function useHeroMode() {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [flat, setFlat] = useState(false);
  const [short, setShort] = useState(false);

  useEffect(function watch() {
    const queries: Array<[string, (v: boolean) => void]> = [
      [MOBILE_QUERY, setNarrow],
      [FLAT_QUERY, setFlat],
      [SHORT_QUERY, setShort],
    ];
    const offs = queries.map(function bind([q, set]) {
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

  return {
    pinned: !flat && !short && !reduce,
    reduce: !!reduce,
    film: narrow ? T_MOBILE : T_DESKTOP,
  };
}

/** True once the reader has scrolled at all — the film then completes instantly. */
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
    const timer = window.setTimeout(function filmOver() {
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

/**
 * What the sketch is currently building.
 *
 * The visitor's own name once they type one; before that, whichever
 * example the placeholder has just finished typing. The six examples are
 * chosen to land on six different presets, so the hero demonstrates
 * itself — a name arrives, a different site appears — without anyone
 * having touched the keyboard. The example is taken only when the word is
 * complete, never per keystroke.
 */
function useSketchName() {
  const { name } = useBusinessName();
  const [demo, setDemo] = useState("");
  const onExample = useCallback(function took(word: string) {
    setDemo(word);
  }, []);
  return { name, demo, onExample };
}

/* ── the copy block ────────────────────────────────────────────────── */

function HeroCopy({
  skip,
  film = T_DESKTOP,
  onExample,
}: {
  skip: boolean;
  film?: Film;
  onExample?: (word: string) => void;
}) {
  const reduce = useReducedMotion();
  const instant = reduce || skip;
  const T = film;
  const d = (v: number) => (instant ? 0 : v);
  const dur = (v: number) => (instant ? 0 : v * film.scale);
  const { name, setName } = useBusinessName();
  const typed = name.trim();
  const [touched, setTouched] = useState(false);

  return (
    <div className="hero-copy">
      <motion.div
        initial={{ opacity: 1, y: instant ? 0 : 8 }}
        animate={{ y: 0 }}
        transition={{ duration: dur(duration.base), ease: ease.outQuart, delay: d(T.topRow) }}
        className="hero-top"
      >
        <div className="type-eyebrow" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>
          {EYEBROW}
        </div>
        <motion.div
          initial={{ opacity: instant ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur(0.5), ease: ease.outQuart, delay: d(T.topRow) }}
        >
          <TorontoClock />
        </motion.div>
      </motion.div>

      {/* One h1. Its accessible name is the whole sentence; the field
          inside it keeps its own label and stays focusable, so the visible
          words either side are hidden from assistive tech rather than the
          block as a whole — aria-hidden over a focusable control is a
          trap, not a tidy-up. */}
      <h1 className="hero-h1" style={{ margin: 0 }}>
        <span className="sr-only">{H1_SENTENCE}</span>

        <span className="type-hero hero-line" aria-hidden="true">
          <LineReveal paint delay={d(T.lead1)}>{LEAD}</LineReveal>
        </span>

        <span className="type-hero hero-line hero-line--field">
          <LineReveal paint block delay={d(T.field)}>
            <NameField
              value={name}
              onChange={setName}
              onTouched={function took() {
                setTouched(true);
              }}
              onExample={onExample}
              delay={d(T.field + 0.15)}
              skip={instant}
            />
          </LineReveal>
        </span>

        <span className="type-hero hero-line" aria-hidden="true">
          <LineReveal paint delay={d(T.tail)}>{TAIL}</LineReveal>
        </span>
      </h1>

      <p className={touched || typed ? "nf-hint nf-hint--off" : "nf-hint"} aria-hidden="true">
        Type your business name ↑
      </p>

      <div className="hero-tail">
        <motion.p
          initial={{ opacity: 1, y: instant ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{ duration: dur(duration.base), ease: ease.outQuart, delay: d(T.kicker) }}
          className="type-body-lg hero-kicker"
        >
          {KICKER}
        </motion.p>

        <div className="hero-ctas">
          <motion.div
            initial={{ opacity: 1, y: instant ? 0 : 12, scale: instant ? 1 : 0.96 }}
            animate={{ y: 0, scale: 1 }}
            transition={instant ? { duration: 0 } : { delay: d(T.ctaPrimary), ...spring.snappy }}
            style={{ display: "inline-flex" }}
          >
            <MagneticCTA
              to={typed ? `/contact?notes=${encodeURIComponent(typed)}` : "/contact"}
              variant="primary"
            >
              Build the real one
            </MagneticCTA>
          </motion.div>
          <motion.div
            initial={{ opacity: 1, y: instant ? 0 : 12, scale: instant ? 1 : 0.96 }}
            animate={{ y: 0, scale: 1 }}
            transition={instant ? { duration: 0 } : { delay: d(T.ctaSecondary), ...spring.snappy }}
            style={{ display: "inline-flex" }}
          >
            <MagneticCTA to="/work" variant="ghost">
              See our work
            </MagneticCTA>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── scroll cue ────────────────────────────────────────────────────── */

function ScrollCue({ skip, hidden, film = T_DESKTOP }: { skip: boolean; hidden: boolean; film?: Film }) {
  const reduce = useReducedMotion();
  const instant = reduce || skip;
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: instant ? 1 : 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: instant ? 0 : duration.base, delay: hidden || instant ? 0 : film.scrollCue }}
      className="hero-cue"
    >
      <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>SCROLL</span>
      <span style={{ display: "block", width: 1, height: 40, overflow: "hidden", background: "rgba(20,20,18,0.12)" }}>
        <motion.span
          style={{ display: "block", width: 1, height: "100%", background: "var(--color-ink)", transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          animate={reduce ? { scaleY: 1 } : { scaleY: [0, 1, 1, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.4, times: [0, 0.4, 0.75, 1], repeat: Infinity, ease: ease.inOut, delay: skip ? 0 : film.scrollCue }
          }
        />
      </span>
    </motion.div>
  );
}

/* ── pinned: the sketch fills the screen and hands over to the reel ── */

function PinnedHero({ skip, film }: { skip: boolean; film: Film }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const { name, demo, onExample } = useSketchName();

  /* 3 stages in a 100vh pin → (3 + 1) × 100vh, per the n+1 rule: the
     sketch filling, the beat it holds, and the reel's own pinned time. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [engaged, setEngaged] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", function onP(p) {
    setEngaged(p > 0.004);
  });

  /** One value drives the hand-over. */
  const fill = useTransform(scrollYProgress, [0.05, 0.42], [0, 1], { ease: easing.inOut });
  /** The copy clears out of the way before the window reaches it.
   *  The OPACITY is written straight to the node: motion accelerates
   *  scroll-linked opacity onto a ViewTimeline, which is meaningless for
   *  anything pinned, and the copy faded back IN as you scrolled. The
   *  transform is fine on the normal path. */
  const copyFade = useTransform(scrollYProgress, [0.02, 0.18], [1, 0]);
  const copyRef2 = useScrollStyle<HTMLDivElement>(copyFade);
  const copyY = useTransform(scrollYProgress, [0.02, 0.18], [0, -40]);
  /** A beat at full screen, then the sketch dissolves into the dark that
   *  Chapter 2 opens on, so the two chapters share one edge. */
  const veilIn = useTransform(scrollYProgress, [0.62, 0.88], [0, 1]);
  const veilRef = useScrollStyle<HTMLDivElement>(veilIn);
  const sketchFade = useTransform(scrollYProgress, [0.66, 0.9], [1, 0]);
  const sketchRef = useScrollStyle<HTMLDivElement>(sketchFade);

  /* the nav goes dark once the reel is what is behind it */
  const setNavDark = useSetNavDarkOverride();
  const [dark, setDark] = useState(false);
  /* The reel covers the whole frame from the first frame of the page, at
     opacity 0. Invisible is not absent: it ate every pointer event over
     the hero — the name field could not be clicked — and its four card
     links sat in the tab order the whole time. It is inert until it is
     actually on screen. */
  const frameInView = useInView(frameRef);
  useMotionValueEvent(veilIn, "change", function onVeil(v) {
    setDark(v > 0.5);
  });
  useEffect(
    function publishNavTone() {
      setNavDark(frameInView && dark);
      return function reset() {
        setNavDark(false);
      };
    },
    [frameInView, dark, setNavDark]
  );

  /* The window's top follows the headline's last line. A percentage
     cleared it at 900 and ran into it at 720, and the headline is a
     third taller after A1. */
  useLayoutEffect(function placeWindow() {
    function run() {
      const frame = frameRef.current;
      const h1 = frame?.querySelector(".hero-h1");
      const layer = frame?.querySelector(".hero-sketch-layer");
      const win = frame?.querySelector(".sw-win");
      if (!frame || !h1 || !layer || !win) return;
      const frameTop = frame.getBoundingClientRect().top;
      const want = h1.getBoundingClientRect().bottom - frameTop + 26;
      /* The window is rotated in 3D, so its rect reaches ABOVE the layer
         that positions it — by 20px at 1920, enough to put the tilted
         corner over the headline's last line. Push down by whatever the
         overshoot actually measures rather than by a guessed angle. */
      const overshoot = Math.max(
        0,
        layer.getBoundingClientRect().top - win.getBoundingClientRect().top
      );
      frame.style.setProperty("--sw-top", `${Math.round(want + overshoot)}px`);
    }
    run();
    // a second pass once the first has settled: the overshoot can only be
    // measured after the layer has been placed
    const again = requestAnimationFrame(run);
    const ro = new ResizeObserver(run);
    if (frameRef.current) ro.observe(frameRef.current);
    const h1 = frameRef.current?.querySelector(".hero-h1");
    if (h1) ro.observe(h1);
    document.fonts?.ready.then(run).catch(function ignore() {});
    return function off() {
      cancelAnimationFrame(again);
      ro.disconnect();
    };
  }, []);

  /* the cue stands down when the copy has grown into it */
  const [cueFits, setCueFits] = useState(true);
  useLayoutEffect(function watchCue() {
    function check() {
      const frame = frameRef.current;
      const copy = copyRef.current;
      if (!frame || !copy) return;
      setCueFits(copy.getBoundingClientRect().bottom <= frame.getBoundingClientRect().bottom - 88);
    }
    check();
    const ro = new ResizeObserver(check);
    if (frameRef.current) ro.observe(frameRef.current);
    if (copyRef.current) ro.observe(copyRef.current);
    document.fonts?.ready.then(check).catch(function ignore() {});
    return function off() {
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "320vh" }}>
      <div ref={frameRef} className="hero-frame">
        <HeroGround />

        <motion.div ref={mergeRefs(copyRef, copyRef2)} className="hero-copy-layer" style={{ y: copyY }}>
          <HeroCopy skip={skip} film={film} onExample={onExample} />
        </motion.div>

        <motion.div ref={sketchRef as React.Ref<HTMLDivElement>} className="hero-sketch-layer">
          <SketchWindow name={name || demo} fill={fill} />
        </motion.div>

        <ScrollCue skip={skip} hidden={engaged || !cueFits} film={film} />

        {/* the hand-over: the hero closes on the dark Chapter 2 opens on */}
        <div ref={veilRef as React.Ref<HTMLDivElement>} className="hero-veil" aria-hidden />
      </div>
    </div>
  );
}

/* ── flat: phones, tablets, short windows, reduced motion ──────────── */

function FlatHero({ skip, film }: { skip: boolean; film: Film }) {
  const { name, demo, onExample } = useSketchName();
  return (
    <>
      <section className="hero-flat">
        <HeroGround />
        <HeroCopy skip={skip} film={film} onExample={onExample} />
        <div className="hero-sketch-flat">
          <SketchWindow name={name || demo} compact />
        </div>
      </section>

    </>
  );
}

/** Two refs on one node. */
function mergeRefs<T>(...refs: Array<React.Ref<T> | React.MutableRefObject<T | null> | null>) {
  return function setRef(node: T | null) {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === "function") r(node);
      else (r as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/* ── ambient ground ────────────────────────────────────────────────── */

function HeroGround() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />
    </>
  );
}

/* ── entry ─────────────────────────────────────────────────────────── */

export default function Hero() {
  const { pinned, film } = useHeroMode();
  const skip = useScrolledEarly();

  if (pinned) {
    return (
      <div data-hero-wrapper>
        <PinnedHero skip={skip} film={film} />
      </div>
    );
  }
  return <FlatHero skip={skip} film={film} />;
}
