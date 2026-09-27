import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";

/**
 * Chapter — the site's section-transition signature.
 *
 * A chapter paints its own surface (`tone`) over the tone above it (`from`) and
 * reveals itself with a scroll-linked clip-path: the surface starts inset from
 * both sides with rounded top corners and expands to full bleed by the time its
 * top reaches 35% of the viewport.
 *
 * Only clip-path animates — no layout properties — so the reveal never reflows
 * the sections inside it.
 */

export type Tone = "dark" | "cream" | "cream-alt" | "cream-warm";

const TONE_BG: Record<Tone, string> = {
  dark: "var(--color-dark)",
  cream: "var(--color-bg)",
  "cream-alt": "var(--color-bg-alt)",
  "cream-warm": "var(--color-bg-warm)",
};

// Desktop / mobile reveal geometry. X is the side inset, R the top-corner radius.
const DESKTOP = { r: 40 };
const MOBILE = { x: 12, r: 24 };
const MOBILE_QUERY = "(max-width: 767px)";

type Props = {
  tone: Tone;
  from: Tone;
  children: ReactNode;
  id?: string;
  as?: ElementType;
  /** Where the reveal finishes.
   *  "viewport" (default) — when the chapter top reaches 35% of the viewport.
   *  "end" — when the chapter bottom reaches the viewport bottom. Required for
   *  a trailing element like the footer: it is the last thing on the page, so
   *  its top can never scroll higher than (viewport - its height) and the 35%
   *  mark is unreachable, which would freeze the reveal part-open forever. */
  settle?: "viewport" | "end";
};

/** cubic-bezier(ease.inOut) evaluated at t — holds the inset wide on approach,
 *  spends the expansion mid-viewport, then settles. outQuart put ~90% of the
 *  travel in the first 15% of the range, which finished the reveal before the
 *  reader reached it. */
function easeInOut(t: number) {
  const [x1, y1, x2, y2] = ease.inOut;
  // Solve x(s) = t for s by bisection, then return y(s). 18 passes is well
  // inside sub-pixel for the inset range we map onto.
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

/** Matches --gutter: clamp(20px, 4vw, 64px). */
function gutterFor(width: number) {
  return Math.min(Math.max(20, width * 0.04), 64);
}

/** motion.create() returns a new component each call — cache per tag so the
 *  chapter's children aren't remounted on every render. */
const motionTags = new Map<string, ElementType>();
function motionTag(as: ElementType | undefined): ElementType {
  const key = typeof as === "string" ? as : "section";
  let cached = motionTags.get(key);
  if (!cached) {
    cached = motion.create(key) as ElementType;
    motionTags.set(key, cached);
  }
  return cached;
}

export default function Chapter({
  tone,
  from,
  children,
  id,
  as,
  settle = "viewport",
}: Props) {
  const reduce = useReducedMotion();

  // No boundary to draw, or motion is unwelcome — render a flat surface and
  // mount no scroll listener at all.
  if (reduce || tone === from) {
    return (
      <FlatChapter tone={tone} from={from} id={id} as={as}>
        {children}
      </FlatChapter>
    );
  }

  return (
    <AnimatedChapter tone={tone} from={from} id={id} as={as} settle={settle}>
      {children}
    </AnimatedChapter>
  );
}

function FlatChapter({ tone, from, children, id, as }: Props) {
  const Surface = (as || "section") as ElementType;
  return (
    <div style={{ backgroundColor: TONE_BG[from] }}>
      <Surface id={id} style={{ backgroundColor: TONE_BG[tone] }}>
        {children}
      </Surface>
    </div>
  );
}

function AnimatedChapter({ tone, from, children, id, as, settle }: Props) {
  const Surface = motionTag(as);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(outerRef, { margin: "10% 0px 10% 0px" });

  const [geometry, setGeometry] = useState(function readInitial() {
    const mobile = window.matchMedia(MOBILE_QUERY).matches;
    return mobile
      ? { x: MOBILE.x, r: MOBILE.r }
      : { x: gutterFor(window.innerWidth), r: DESKTOP.r };
  });

  useEffect(function trackViewport() {
    function measure() {
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      setGeometry(
        mobile
          ? { x: MOBILE.x, r: MOBILE.r }
          : { x: gutterFor(window.innerWidth), r: DESKTOP.r }
      );
    }
    measure();
    window.addEventListener("resize", measure);
    return function cleanup() {
      window.removeEventListener("resize", measure);
    };
  }, []);

  // 0 when the chapter top is at the viewport bottom, 1 once it reaches 35%.
  // Clamped at both ends, so it holds open after passing and reverses only if
  // the reader actually scrolls back up.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: settle === "end" ? ["start end", "end end"] : ["start end", "start 0.35"],
  });

  const clipPath = useTransform(scrollYProgress, function toClip(t) {
    const raw = t < 0 ? 0 : t > 1 ? 1 : t;
    const p = easeInOut(raw);
    const x = geometry.x * (1 - p);
    const r = geometry.r * (1 - p);
    return `inset(0px ${x}px 0px ${x}px round ${r}px ${r}px 0px 0px)`;
  });

  return (
    <div ref={outerRef} style={{ backgroundColor: TONE_BG[from] }}>
      <Surface
        id={id}
        style={{
          backgroundColor: TONE_BG[tone],
          clipPath,
          willChange: inView ? "clip-path" : "auto",
        }}
      >
        {children}
      </Surface>
    </div>
  );
}
