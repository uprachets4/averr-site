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
import { duration, ease, easing, spring } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import LineReveal from "./LineReveal";
import PillHl from "./PillHl";
import TorontoClock from "./TorontoClock";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useScrollStyle } from "../lib/useScrollStyle";
import HeroField from "./home/HeroField";
import Screenshot from "./Screenshot";

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
const LEAD = "Your next customer is";
const SLAB = "already looking.";
const H1_SENTENCE = "Your next customer is already looking.";
const SUBLINE = "We make sure they find a business worth choosing.";
const KICKER =
  "We design premium websites, build AI automations, and run the marketing engines that grow businesses like yours across the GTA.";

/** The plane the fly-through lands on — its real capture, full bleed. */
const LANDING = "/work/cgwalls/hero.jpg";

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
          <TorontoClock />
        </motion.div>
      </motion.div>

      {/* The accessible name is the plain sentence; the visible halves
          are hidden from assistive tech so it is not read twice. */}
      <h1 className="hx-h1">
        <span className="sr-only">{H1_SENTENCE}</span>
        <span aria-hidden="true">
          <span className="type-hero hx-line">
            <LineReveal paint delay={d(T.lead)}>{LEAD}</LineReveal>
          </span>
          <span className="type-hero hx-line hx-line--slab">
            <LineReveal paint delay={d(T.slab)}>
              <PillHl entrance="slab" invert delay={d(T.slab + 0.1)} skip={instant}>
                {SLAB}
              </PillHl>
            </LineReveal>
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
          <MagneticCTA to="/work" variant="ghost" tone="dark">
            See the work
          </MagneticCTA>
        </motion.div>
      </div>
    </div>
  );
}

/* ── pinned: the fly-through ───────────────────────────────────────── */

function PinnedHero({ skip }: { skip: boolean }) {
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

  /* The landing arrives BEFORE the field leaves, so the two overlap and
     there is never an empty frame between them. */
  /* The landing rises EARLY. Past about 35% of the pin the planes have
     scaled up and swept outside the frame — SIFT 6828px off the right
     edge, CG Walls 6666px off the left — so the room cannot carry that
     window and the mean luminance fell to 23.5 against 51.8 at rest.
     The destination comes up to meet the camera instead. */
  const landFade = useTransform(scrollYProgress, [0.28, 0.52], [0, 1]);
  const landRef = useScrollStyle<HTMLDivElement>(landFade);
  const landScale = useTransform(scrollYProgress, [0.28, 1], [1.34, 1], { ease: easing.inOut });
  const fieldFade = useTransform(scrollYProgress, [0.46, 0.70], [1, 0]);
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
    <div ref={wrapRef} className="hx-wrap">
      <div ref={frameRef} className="hx-frame">
        <div ref={fieldRef as React.Ref<HTMLDivElement>} className="hx-fieldlayer">
          <HeroField dolly={dolly} inView={inView} />
        </div>

        <div ref={vigRef as React.Ref<HTMLDivElement>} className="hx-vignette" aria-hidden />

        <motion.div ref={copyRef as React.Ref<HTMLDivElement>} className="hx-copylayer" style={{ y: copyY }}>
          <HeroCopy skip={skip} />
        </motion.div>

        {/* the frame the camera lands on — a real capture, full bleed */}
        <div ref={landRef as React.Ref<HTMLDivElement>} className="hx-landing" aria-hidden>
          <motion.div className="hx-landing__img" style={{ scale: landScale }}>
            <Screenshot src={LANDING} alt="" sizes="100vw" loading="lazy" fetchPriority="low" />
          </motion.div>
        </div>

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
        <HeroField dolly={still} inView={inView} />
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
  const pinned = !narrow && !short && !reduce;

  if (pinned) {
    return (
      <div data-hero-wrapper>
        <PinnedHero skip={skip} />
      </div>
    );
  }
  return <FlatHero skip={skip} />;
}
