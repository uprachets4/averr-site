import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import LineReveal from "./LineReveal";
import TorontoClock from "./TorontoClock";
import Chapter from "./Chapter";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useScrollStyle } from "../lib/useScrollStyle";
import HeroReelStatic, {
  ReelCardTile,
  ReelCTA,
  ReelHeading,
} from "./HeroReel";
import { reelCards } from "../data/heroReel";
import { H1_SENTENCE, LEAD_1, LEAD_2, PHRASES } from "./home/heroPhrases";
import { useHeroPhrase, type HeroPhrase } from "./home/useHeroPhrase";
import PhraseSlab from "./home/PhraseSlab";
import PhraseSelectors from "./home/PhraseSelectors";
import HeroScene from "./home/HeroScene";

/* ── copy ──────────────────────────────────────────────────────────── */

const EYEBROW = "A boutique studio · Toronto";
/* The headline now speaks TO the business and its last line is an outcome
   that cycles. The lines and the three outcomes live in home/heroPhrases.ts,
   next to the pillar each one belongs to, so the sentence and the scene
   beside it cannot drift apart. */
const KICKER =
  "We design premium websites, build AI automations, and run the marketing engines that grow businesses like yours across the GTA.";

/* ── load choreography, seconds from mount (≈2.0s film) ────────────── */

type Film = typeof T_DESKTOP;

const T_DESKTOP = {
  topRow: 0.25,
  lead1: 0.35,
  lead2: 0.43,
  big: 0.65,
  pillWord: 0.8,
  slab: 1.15,
  kicker: 1.35,
  ctaPrimary: 1.43,
  ctaSecondary: 1.51,
  scrollCue: 1.5,
  scale: 1,
};

/** Below 768 the film runs at half speed (≈1.0s). The kicker is pulled
 *  further forward than a flat ×0.5 would put it (0.675s): it is the mobile
 *  LCP element, and although 19-pre-2 paints every hero text element — so a
 *  delay here no longer delays the paint — it is still the first thing read
 *  on a phone and should settle early. */
const T_MOBILE: Film = {
  topRow: 0.12,
  lead1: 0.18,
  lead2: 0.22,
  big: 0.32,
  pillWord: 0.4,
  slab: 0.58,
  kicker: 0.55,
  ctaPrimary: 0.63,
  ctaSecondary: 0.71,
  scrollCue: 0.75,
  scale: 0.5,
};

const MOBILE_QUERY = "(max-width: 767px)";
const SHORT_QUERY = "(max-height: 699px)";
/** Below this the hero is one column: headline, then the scene under the
 *  CTAs. A pinned frame is 100vh and clips, and a stacked composition at
 *  this type size does not fit inside one — at 1024×768 the headline's
 *  first line was 53px ABOVE the viewport. So the hero stops pinning
 *  exactly where it stops being two columns, and the page scrolls. */
const FLAT_QUERY = "(max-width: 1023px)";

/** Wide enough for two columns, tall enough, motion welcome → the pinned
 *  takeover runs. */
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

/* ── the hero composition (shared by both modes) ───────────────────── */

function HeroComposition({
  skip,
  pillRef,
  hidePillSurface,
  film = T_DESKTOP,
  phrase,
}: {
  skip: boolean;
  pillRef?: React.Ref<HTMLSpanElement>;
  hidePillSurface?: boolean;
  film?: Film;
  phrase: HeroPhrase;
}) {
  const reduce = useReducedMotion();
  const instant = reduce || skip;
  const T = film;
  const d = (v: number) => (instant ? 0 : v);
  /** Durations scale with the film. */
  const dur = (v: number) => (instant ? 0 : v * film.scale);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        // --container-wide already subtracts the gutter from 100vw; adding
        // padding on top of it insets twice and squeezes the pill line.
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
      }}
    >
      {/* Top row. The eyebrow is text, so it paints and only travels; the
          clock is not, and keeps the fade it has always had. */}
      <motion.div
        initial={{ opacity: 1, y: instant ? 0 : 8 }}
        animate={{ y: 0 }}
        transition={{ duration: dur(duration.base), ease: ease.outQuart, delay: d(T.topRow) }}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", textTransform: "uppercase" }}
        >
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

      {/* The fold: the claim on the left, the work running on the right.
          One column below 1024, where the scene follows the CTAs. */}
      <div className="hero-main">
        <div>
        {/* One h1. Its accessible text is the whole sentence — every outcome,
            not whichever one happens to be on the slab, so a reader who
            cannot see it cycling still gets the complete claim. The visible
            lines are hidden from assistive tech because they would otherwise
            read the sentence a second time, in pieces. */}
        <h1 style={{ margin: 0 }}>
          <span className="sr-only">{H1_SENTENCE}</span>

          <span aria-hidden="true">
            <span
              className="type-h1"
              style={{
                display: "block",
                maxWidth: "20ch",
                color: "var(--color-ink)",
                opacity: 0.72,
              }}
            >
              <LineReveal paint delay={d(T.lead1)}>{LEAD_1}</LineReveal>
            </span>

            <span
              className="type-hero"
              style={{ display: "block", color: "var(--color-ink)", marginTop: 8 }}
            >
              <LineReveal paint delay={d(T.big)}>{LEAD_2}</LineReveal>
            </span>

            <span className="type-hero" style={{ display: "block", marginTop: 4 }}>
              {/* The words paint with the rest of the headline. The slab behind
                  them is not text and keeps PillHl's own entrance — it is the
                  signature moment of the page and nothing here touches it. */}
              <LineReveal paint delay={d(T.pillWord)}>
                <span ref={pillRef} style={{ display: "inline-block" }}>
                  <PhraseSlab
                    index={phrase.index}
                    reduce={phrase.reduce}
                    delay={d(T.slab)}
                    speed={film.scale}
                    skip={instant}
                    surface={!hidePillSurface}
                    onClick={function advance() {
                      phrase.next(true);
                    }}
                  />
                </span>
              </LineReveal>
            </span>
          </span>
        </h1>

        {/* Only user-driven changes are announced; the auto-cycle would
            otherwise talk over the reader every 3.2 seconds. */}
        <p aria-live="polite" className="sr-only">
          {phrase.announce}
        </p>

        <PhraseSelectors
          index={phrase.index}
          onChoose={function pick(i) {
            phrase.choose(i, true);
          }}
        />

        {/* LCP element on mobile. Painted from the first frame, so the delay
            below moves it but cannot hold up the paint. */}
        <motion.p
          initial={{ opacity: 1, y: instant ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{ duration: dur(duration.base), ease: ease.outQuart, delay: d(T.kicker) }}
          className="type-body-lg measure-body"
          style={{ color: "var(--color-muted)", margin: "28px 0 0" }}
        >
          {KICKER}
        </motion.p>

        {/* The CTAs keep their spring, but on the TRANSFORM only — they are
            painted at opacity 1 from the first frame like the rest of the hero
            text, so the bounce is motion on something already on screen. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          <motion.div
            initial={{ opacity: 1, y: instant ? 0 : 12, scale: instant ? 1 : 0.96 }}
            animate={{ y: 0, scale: 1 }}
            transition={instant ? { duration: 0 } : { delay: d(T.ctaPrimary), ...spring.snappy }}
            style={{ display: "inline-flex" }}
          >
            <MagneticCTA to="/contact" variant="primary">
              Book a discovery call
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

        <HeroScene index={phrase.index} />
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
      style={{
        position: "absolute",
        left: "var(--gutter)",
        bottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 12,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
        SCROLL
      </span>
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

/* ── pinned takeover ───────────────────────────────────────────────── */

type PillRect = { top: number; right: number; bottom: number; left: number; radius: number };

function PinnedHero({ skip, film }: { skip: boolean; film: Film }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const [rect, setRect] = useState<PillRect | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const [engaged, setEngaged] = useState(false);
  const setNavDark = useSetNavDarkOverride();
  // Frozen while the takeover runs: the dark layer below carries its own
  // copy of the active phrase.
  const phrase = useHeroPhrase(frameRef, engaged);

  /* The cue lives at the bottom-left of the frame, and the headline grew
     into it: at 1280×720 "SCROLL" landed on top of the primary CTA. It is
     decorative, so it gives way — but on measurement rather than on a
     guessed height breakpoint, because what collides is the copy's real
     height at that width, not the viewport. */
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [cueFits, setCueFits] = useState(true);
  useLayoutEffect(function watchCue() {
    function check() {
      const frame = frameRef.current;
      const copy = copyRef.current;
      if (!frame || !copy) return;
      const CUE = 28 + 40 + 20; // bottom offset + the rule's height + clearance
      setCueFits(copy.getBoundingClientRect().bottom <= frame.getBoundingClientRect().bottom - CUE);
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

  useMotionValueEvent(scrollYProgress, "change", function onP(p) {
    setEngaged(p > 0.001);
  });

  // The dark layer is full-frame from the start — only clip-path makes it look
  // like the pill — so an IntersectionObserver would read it as dark at p=0.
  // Publish from the same progress the clip-path uses: the surface counts as
  // dark under the nav once its top inset clears the nav's height.
  const navH = 88;
  const [coversNav, setCoversNav] = useState(false);
  const frameInView = useInView(frameRef);

  useMotionValueEvent(scrollYProgress, "change", function onNavTone(p) {
    if (!rect) return;
    const t = (p - 0.1) / 0.4;
    const k = t < 0 ? 0 : t > 1 ? 1 : t;
    const top = rect.top * (1 - easeInOutAt(k));
    setCoversNav(p > 0.001 && top < navH);
  });

  // scrollYProgress clamps at 1 and stops emitting once the wrapper is behind
  // us, so the progress signal alone latches the override on. Gate it on the
  // pinned frame actually being on screen.
  useEffect(
    function publishNavTone() {
      setNavDark(frameInView && coversNav);
      return function reset() {
        setNavDark(false);
      };
    },
    [frameInView, coversNav, setNavDark]
  );

  /** The pill's box expressed as insets from the sticky frame. */
  const measure = useCallback(function measurePill() {
    const frame = frameRef.current;
    const pill = pillRef.current;
    if (!frame || !pill) return;
    const target = pill.querySelector(".pill-hl") ?? pill;
    const fr = frame.getBoundingClientRect();
    const pr = target.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(target as Element).borderRadius) || 12;
    setRect({
      top: Math.max(0, pr.top - fr.top),
      right: Math.max(0, fr.right - pr.right),
      bottom: Math.max(0, fr.bottom - pr.bottom),
      left: Math.max(0, pr.left - fr.left),
      radius,
    });
  }, []);

  useLayoutEffect(
    function trackPill() {
      measure();
      const pill = pillRef.current;
      if (!pill) return;
      const ro = new ResizeObserver(measure);
      ro.observe(pill);
      if (frameRef.current) ro.observe(frameRef.current);
      window.addEventListener("resize", measure);
      document.fonts?.ready.then(measure).catch(function ignore() {});
      // the word rises into place during the film; re-measure after it lands
      const settle = window.setTimeout(measure, 2200);
      return function cleanup() {
        ro.disconnect();
        window.removeEventListener("resize", measure);
        window.clearTimeout(settle);
      };
    },
    [measure]
  );

  // clip-path: pill box → full frame, over p 0.10 → 0.50
  const clipPath = useTransform(scrollYProgress, function toClip(p) {
    if (!rect) return "inset(0px 0px 0px 0px round 0px)";
    const t = (p - 0.1) / 0.4;
    const k = t < 0 ? 0 : t > 1 ? 1 : t;
    const e = easeInOutAt(k);
    const top = rect.top * (1 - e);
    const right = rect.right * (1 - e);
    const bottom = rect.bottom * (1 - e);
    const left = rect.left * (1 - e);
    const r = rect.radius * (1 - e);
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${r}px)`;
  });

  const headingY = useTransform(scrollYProgress, [0.45, 0.6], [24, 0]);
  const seriousRef = useScrollOpacity(scrollYProgress, 0.4, 0.5, true);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "200vh" }}>
      <div
        ref={frameRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          // 88px nav + 56px, so the top row clears it by >=48 at every width
          paddingTop: 144,
          paddingBottom: 40,
        }}
      >
        <HeroGround />

        <div ref={copyRef} style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <HeroComposition
            skip={skip}
            pillRef={pillRef}
            hidePillSurface={engaged}
            film={film}
            phrase={phrase}
          />
        </div>

        <ScrollCue skip={skip} hidden={engaged || !cueFits} film={film} />

        {/* The dark layer. At p=0 its clip is exactly the pill, so it IS the
            pill; by p=0.5 it is the whole frame. */}
        <motion.div
          aria-hidden={!engaged}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundColor: "var(--color-dark)",
            clipPath,
            opacity: engaged ? 1 : 0,
            pointerEvents: engaged ? "auto" : "none",
            willChange: engaged ? "clip-path" : "auto",
          }}
        >
          <ReelStage progress={scrollYProgress} headingY={headingY} />
        </motion.div>

        {/* The active phrase again, above the dark layer, so the words
            survive the takeover. Whichever one the reader left on the slab
            is the one that rises — the cycle is frozen from the moment the
            takeover engages, so this cannot swap mid-flight. aria-hidden:
            the real sentence lives in the h1. */}
        {engaged && rect ? (
          <span
            ref={seriousRef as React.Ref<HTMLSpanElement>}
            aria-hidden
            className="type-hero"
            style={{
              position: "absolute",
              zIndex: 3,
              top: rect.top,
              left: rect.left,
              pointerEvents: "none",
              // .pill-hl--bare's own padding, so the words land where they
              // already are rather than a slab's width away.
              padding: "0.1em 0.28em 0.16em",
              lineHeight: "var(--type-hero-leading)",
              fontWeight: 500,
              letterSpacing: "var(--type-hero-tracking)",
              color: "var(--color-parch)",
            }}
          >
            {PHRASES[phrase.index].text}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Thin wrapper over the shared hook: builds the opacity MotionValue from a
 *  progress range. See src/lib/useScrollStyle.ts for why opacity cannot ride
 *  on style={{ opacity }} inside a sticky frame. */
function useScrollOpacity(
  progress: MotionValue<number>,
  from: number,
  to: number,
  fadeOut = false
) {
  const opacity = useTransform(progress, [from, to], fadeOut ? [1, 0] : [0, 1]);
  return useScrollStyle<HTMLElement>(opacity);
}

function mergeRefs<T>(...refs: Array<React.MutableRefObject<T | null> | React.Ref<T> | null>) {
  return function setRef(node: T | null) {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === "function") r(node);
      else (r as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/** cubic-bezier(ease.inOut) at t — matches Chapter's reveal feel. */
function easeInOutAt(t: number) {
  const [x1, y1, x2, y2] = ease.inOut;
  let lo = 0;
  let hi = 1;
  let s = t;
  for (let i = 0; i < 18; i++) {
    s = (lo + hi) / 2;
    const u = 1 - s;
    const x = 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s;
    if (x < t) lo = s;
    else hi = s;
  }
  const u = 1 - s;
  return 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s;
}

/* ── the reel inside the dark layer ────────────────────────────────── */

function ReelStage({
  progress,
  headingY,
}: {
  progress: MotionValue<number>;
  headingY: MotionValue<number>;
}) {
  const rowRef = useRef<HTMLUListElement | null>(null);
  const [overflow, setOverflow] = useState(0);

  useLayoutEffect(function measureRow() {
    function run() {
      const row = rowRef.current;
      if (!row) return;
      setOverflow(Math.max(0, row.scrollWidth - row.clientWidth));
    }
    run();
    window.addEventListener("resize", run);
    const t = window.setTimeout(run, 400);
    return function cleanup() {
      window.removeEventListener("resize", run);
      window.clearTimeout(t);
    };
  }, []);

  // The cards must finish arriving before the row moves: entrance runs
  // 0.50 → 0.58 (opacity 0.50 → 0.56, y 0.50 → 0.58), the pan 0.58 → 0.90,
  // then a hold in which the CTA lands.
  const rowX = useTransform(progress, [0.58, 0.9], [0, -overflow]);
  const cardsY = useTransform(progress, [0.5, 0.58], [80, 0]);
  const headingRef = useScrollOpacity(progress, 0.45, 0.6);
  const cardsRef = useScrollOpacity(progress, 0.5, 0.56);
  const ctaRef = useScrollOpacity(progress, 0.9, 0.96);

  const scrollCardIntoView = useCallback(function focusCard(slug: string) {
    const index = reelCards.findIndex((c) => c.slug === slug);
    if (index < 0) return;
    const wrapper = rowRef.current?.closest("[data-hero-wrapper]") as HTMLElement | null;
    if (!wrapper) return;
    const span = wrapper.offsetHeight - window.innerHeight;
    const p = 0.55 + (index / Math.max(1, reelCards.length - 1)) * 0.28;
    window.scrollTo({ top: wrapper.offsetTop + span * p, behavior: "auto" });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
        paddingTop: 96,
        paddingBottom: 72,
      }}
    >
      <motion.div
        ref={headingRef as React.Ref<HTMLDivElement>}
        style={{
          y: headingY,
          padding: "0 var(--gutter)",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <ReelHeading />
      </motion.div>

      <motion.ul
        ref={mergeRefs(rowRef, cardsRef)}
        style={{
          listStyle: "none",
          margin: 0,
          padding: "0 var(--gutter)",
          display: "flex",
          gap: 32,
          x: rowX,
          y: cardsY,
        }}
        className="reel-row"
      >
        {reelCards.map(function drawCard(card) {
          return (
            <li key={card.slug} style={{ display: "block" }}>
              <ReelCardTile card={card} width="38vw" onFocusCard={scrollCardIntoView} />
            </li>
          );
        })}
        {/* the reel attends to one card at a time: the others step back
            rather than the hovered one shouting. :has() keeps this in CSS,
            so no hover state has to live in React and re-render the row. */}
        <style>{`
          .reel-row :global(.reel-card) { transition: opacity ${duration.base}s ease; }
          .reel-row:has(.reel-card:hover) .reel-card:not(:hover),
          .reel-row:has(.reel-card:focus-visible) .reel-card:not(:focus-visible) { opacity: 0.7; }
          @media (prefers-reduced-motion: reduce) {
            .reel-row :global(.reel-card) { transition: none; }
          }
        `}</style>

        {/* A flex row's trailing padding is not counted in scrollWidth, so the
            pan stopped a gutter short and clipped the last card's tags. */}
        <li aria-hidden style={{ flex: "0 0 var(--gutter)" }} />
      </motion.ul>

      <div
        ref={ctaRef as React.Ref<HTMLDivElement>}
        style={{
          padding: "0 var(--gutter)",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <ReelCTA />
      </div>
    </div>
  );
}

/* ── ambient ground (kept from the previous hero) ──────────────────── */

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

/** Phones, short windows and reduced motion: no takeover, same fold. */
function FlatHero({ skip, film }: { skip: boolean; film: Film }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const phrase = useHeroPhrase(sectionRef);

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "var(--color-bg)",
          padding: "112px 0 96px",
        }}
      >
        <HeroGround />
        <HeroComposition skip={skip} film={film} phrase={phrase} />
      </section>

      <Chapter tone="dark" from="cream">
        <HeroReelStatic />
      </Chapter>
    </>
  );
}
