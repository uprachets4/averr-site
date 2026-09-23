import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease, spring } from "../lib/motion";
import { CharRevealInView } from "./CharReveal";
import ImageFrame from "./case-study/ImageFrame";

const STAGES = [
  {
    eyebrow: "The Studio",
    headline: "We started because most agency work looks the same.",
    body: "Every studio ships the same bento layout, the same hero gradient, the same testimonial carousel. The differentiator was gone.",
  },
  {
    eyebrow: "The Approach",
    headline: "So we built one that starts from the client's world.",
    body: "Palette from your space. Typography from your voice. Signature moments no template could ship. Then engineered to hold up in three years.",
  },
  {
    eyebrow: "The Result",
    headline: "Sites that earn their portfolio slot. Yours and ours.",
    body: "Every client site ships as Averr's next portfolio piece. No exceptions. No template shortcuts.",
  },
];

const CARDS = [
  { src: "/work/capitalcommand/01-overview.jpg", label: "CapitalCommand" },
  { src: "/work/cadencestack/01-command-center.jpg", label: "CadenceStack" },
  { src: "/work/sift/01-command-overview.jpg", label: "SIFT" },
  { src: "/work/cgwalls/hero.jpg", label: "CG Walls & Floors" },
];

const PARALLAX_WEIGHTS = [0.4, 0.6, 0.8, 1.0];

/**
 * Story So Far — 3-stage scroll-pinned narrative between Hero and Pillars.
 * Left column: stage text swaps on non-overlapping opacity windows.
 * Right column: 4 case study cards recompose continuously from loose scatter
 * (stage 1, ±15°) to organized cluster (stage 3, near 0°).
 * Mobile / reduced-motion: sticky collapses to stacked cards; right column
 * shows only the middle 2 as a static mini-cluster.
 */
export default function StorySoFar() {
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(function detect() {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 901px)");
    setIsDesktop(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const sticky = isDesktop && !reduce;

  if (!sticky) {
    return <StoryStacked />;
  }
  return <StoryPinned reduce={!!reduce} />;
}

function StoryPinned({ reduce }: { reduce: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.32, 1],
    [1, 1, 0, 0]
  );
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.4, 0.6, 0.65, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const stage3Opacity = useTransform(
    scrollYProgress,
    [0, 0.68, 0.73, 1],
    [0, 0, 1, 1]
  );
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -32]);

  // Cursor parallax across the right column
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sX = useSpring(rawX, spring.soft);
  const sY = useSpring(rawY, spring.soft);
  const rightRef = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!rightRef.current) return;
    const rect = rightRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 24);
    rawY.set(py * 24);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "300vh",
        backgroundColor: "var(--color-bg)",
      }}
      className="story-band"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "40% 60%",
          alignItems: "center",
          padding: "0 40px",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 520, paddingRight: 40, position: "relative" }}>
          <motion.div style={{ y: headlineY }}>
            <StageBlock
              stage={STAGES[0]}
              opacity={stage1Opacity}
            />
            <StageBlock
              stage={STAGES[1]}
              opacity={stage2Opacity}
            />
            <StageBlock
              stage={STAGES[2]}
              opacity={stage3Opacity}
            />
          </motion.div>
        </div>

        <div
          ref={rightRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            position: "relative",
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AmbientMarks reduce={reduce} />
          {CARDS.map(function drawCard(c, i) {
            return (
              <StoryCard
                key={c.src}
                src={c.src}
                label={c.label}
                index={i}
                scrollYProgress={scrollYProgress}
                parallaxX={sX}
                parallaxY={sY}
                reduce={reduce}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StageBlock({
  stage,
  opacity,
}: {
  stage: (typeof STAGES)[number];
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity,
      }}
    >
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-ink-soft)", marginBottom: 24 }}
      >
        {stage.eyebrow}
      </div>
      <h2
        className="type-display-l"
        style={{ color: "var(--color-ink)", marginBottom: 32 }}
      >
        {stage.headline}
      </h2>
      <p
        className="type-body-lg"
        style={{ color: "var(--color-ink)", margin: 0 }}
      >
        {stage.body}
      </p>
    </motion.div>
  );
}

// Per-card geometry across the three stages.
const SCATTER_ROT = [-15, -12, 12, 15];
const MID_ROT = [-8, -5, 5, 8];
const TIGHT_ROT = [-2, -0.5, 0.5, 2];
const SCATTER_OFFSET: Array<[number, number]> = [
  [-160, -80],
  [-70, -40],
  [70, 40],
  [160, 80],
];
const MID_OFFSET: Array<[number, number]> = [
  [-100, -50],
  [-40, -20],
  [40, 20],
  [100, 50],
];
const TIGHT_OFFSET: Array<[number, number]> = [
  [-50, -25],
  [-15, -10],
  [15, 10],
  [50, 25],
];

function StoryCard({
  src,
  label,
  index,
  scrollYProgress,
  parallaxX,
  parallaxY,
  reduce,
}: {
  src: string;
  label: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  reduce: boolean;
}) {
  // Interpolate rotation and offset across three stages.
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [SCATTER_ROT[index], MID_ROT[index], TIGHT_ROT[index]]
  );
  const offX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [SCATTER_OFFSET[index][0], MID_OFFSET[index][0], TIGHT_OFFSET[index][0]]
  );
  const offY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [SCATTER_OFFSET[index][1], MID_OFFSET[index][1], TIGHT_OFFSET[index][1]]
  );

  const weight = PARALLAX_WEIGHTS[index];
  const totalX = useTransform(
    [offX, parallaxX] as MotionValue<number>[],
    function combine([a, b]) {
      return (a as number) + (b as number) * weight * 0.5;
    }
  );
  const totalY = useTransform(
    [offY, parallaxY] as MotionValue<number>[],
    function combine([a, b]) {
      return (a as number) + (b as number) * weight * 0.5;
    }
  );

  const zIndex = index === 1 || index === 2 ? 3 : 2;
  const shadow =
    index === 0 || index === 3
      ? "0 8px 24px rgba(20,20,18,0.10)"
      : "0 18px 48px rgba(20,20,18,0.18)";

  return (
    <motion.figure
      style={{
        position: "absolute",
        width: "clamp(280px, 26vw, 440px)",
        margin: 0,
        rotate: reduce ? TIGHT_ROT[index] : rotate,
        x: reduce ? TIGHT_OFFSET[index][0] : totalX,
        y: reduce ? TIGHT_OFFSET[index][1] : totalY,
        zIndex,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: shadow,
      }}
    >
      <ImageFrame variant="hero">
        <img
          src={src}
          alt={label}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </ImageFrame>
    </motion.figure>
  );
}

function AmbientMarks({ reduce }: { reduce: boolean }) {
  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid var(--color-ink)",
          opacity: 0.22,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, 16, 0, -14, 0], y: [0, -10, 10, 0, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "12%",
          right: "8%",
          width: 22,
          height: 22,
          border: "1px solid var(--color-parch)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, -18, 0, 14, 0], y: [0, 14, -12, 0, 0] }}
        transition={{ duration: 55, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "48%",
          left: "3%",
          width: 40,
          height: 2,
          background: "var(--color-parch)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, 16, 0, -10, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: ease.inOut }}
      />
    </>
  );
}

/* ═════════ Mobile / reduced-motion fallback ═════════ */

function StoryStacked() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {STAGES.map(function drawStage(s, i) {
          return (
            <motion.div
              key={s.eyebrow}
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: reduce ? 0 : 0.6,
                ease: ease.outQuart,
                delay: reduce ? 0 : 0.1 + i * 0.05,
              }}
              style={{
                marginBottom: 64,
              }}
            >
              <div
                className="type-eyebrow"
                style={{ color: "var(--color-ink-soft)", marginBottom: 16 }}
              >
                {s.eyebrow}
              </div>
              <h2
                className="type-display-l"
                style={{ color: "var(--color-ink)", marginBottom: 20 }}
              >
                <CharRevealInView
                  text={s.headline}
                  style={{ color: "var(--color-ink)" }}
                />
              </h2>
              <p
                className="type-body-lg"
                style={{ color: "var(--color-ink)", margin: 0 }}
              >
                {s.body}
              </p>
            </motion.div>
          );
        })}
        {/* Static mini-cluster: middle 2 cards */}
        <div
          style={{
            position: "relative",
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {[CARDS[1], CARDS[2]].map(function drawCard(c, i) {
            const rot = i === 0 ? -3 : 3;
            const x = i === 0 ? -20 : 20;
            return (
              <figure
                key={c.src}
                style={{
                  position: "absolute",
                  width: 260,
                  margin: 0,
                  transform: `translate(${x}px, 0) rotate(${rot}deg)`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 14px 40px rgba(20,20,18,0.14)",
                }}
              >
                <ImageFrame variant="hero">
                  <img src={c.src} alt={c.label} loading="lazy" />
                </ImageFrame>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
