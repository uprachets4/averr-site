import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease } from "../lib/motion";

type Step = {
  n: string;
  name: string;
  duration: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    name: "Direction",
    duration: "Week 1",
    body: "Palette, typography, signature moves, interaction plan. One checkpoint. Locked before any code.",
  },
  {
    n: "02",
    name: "Design",
    duration: "Week 1-2",
    body: "Section-by-section build. Self-critique per section. Portfolio-quality bar before moving to the next.",
  },
  {
    n: "03",
    name: "Build",
    duration: "Week 2-3",
    body: "Framer or Next.js. Motion, interaction, responsive system. Zero template sections.",
  },
  {
    n: "04",
    name: "Refine",
    duration: "Week 3",
    body: "Polish pass. Accessibility audit. Mobile-first review. Reduced-motion verified.",
  },
  {
    n: "05",
    name: "Ship",
    duration: "Week 3-4",
    body: "Launch, monitor, iterate. 30-day post-launch window included.",
  },
];

export default function ProcessTimeline() {
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const dashOffset: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.15, 0.6],
    [1, 0]
  );

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {isDesktop ? (
        <HorizontalTimeline
          reduce={!!reduce}
          dashOffset={dashOffset}
        />
      ) : (
        <VerticalTimeline
          reduce={!!reduce}
          dashOffset={dashOffset}
        />
      )}
    </div>
  );
}

function HorizontalTimeline({
  reduce,
  dashOffset,
}: {
  reduce: boolean;
  dashOffset: MotionValue<number>;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* Connecting line across the top of the number row */}
      <svg
        aria-hidden
        viewBox="0 0 1000 4"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: 40,
          width: "80%",
          height: 4,
          zIndex: 0,
        }}
      >
        <motion.line
          x1="0"
          y1="2"
          x2="1000"
          y2="2"
          stroke="var(--color-ink)"
          strokeOpacity="0.4"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          style={{
            strokeDashoffset: reduce ? 0 : dashOffset,
          }}
        />
      </svg>

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 24,
          zIndex: 1,
        }}
      >
        {STEPS.map(function drawStep(step, i) {
          return <StepCard key={step.n} step={step} index={i} reduce={reduce} />;
        })}
      </div>
    </div>
  );
}

function VerticalTimeline({
  reduce,
  dashOffset,
}: {
  reduce: boolean;
  dashOffset: MotionValue<number>;
}) {
  return (
    <div style={{ position: "relative", paddingLeft: 44 }}>
      {/* Left connecting line */}
      <svg
        aria-hidden
        viewBox="0 0 4 1000"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: 20,
          top: 40,
          bottom: 40,
          width: 4,
          height: "calc(100% - 80px)",
          zIndex: 0,
        }}
      >
        <motion.line
          x1="2"
          y1="0"
          x2="2"
          y2="1000"
          stroke="var(--color-ink)"
          strokeOpacity="0.4"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          style={{
            strokeDashoffset: reduce ? 0 : dashOffset,
          }}
        />
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        {STEPS.map(function drawStep(step, i) {
          return <StepCard key={step.n} step={step} index={i} reduce={reduce} />;
        })}
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  reduce,
}: {
  step: Step;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{
        duration: reduce ? 0.001 : 0.6,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.15 + index * 0.12,
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: 20,
      }}
    >
      <div
        className="type-display-l"
        style={{
          color: "var(--color-ink)",
          opacity: 0.25,
          lineHeight: 1,
        }}
      >
        {step.n}
      </div>
      <div
        className="type-h2"
        style={{
          color: "var(--color-ink)",
          margin: 0,
        }}
      >
        {step.name}
      </div>
      <div
        className="type-eyebrow"
        style={{ color: "#B18544" }}
      >
        {step.duration}
      </div>
      <p
        className="type-body"
        style={{
          color: "var(--color-ink)",
          maxWidth: "40ch",
          margin: 0,
        }}
      >
        {step.body}
      </p>
    </motion.div>
  );
}
