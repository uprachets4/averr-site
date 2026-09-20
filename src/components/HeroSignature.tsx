import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ease, spring } from "../lib/motion";

const VIEW_W = 900;
const VIEW_H = 800;

type CircleSpec = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  drawDelay: number; // seconds
  rotateDuration: number; // seconds
  clockwise: boolean;
  parallaxStrength: number; // px displacement at edge
};

const CIRCLES: CircleSpec[] = [
  { id: "c1", cx: 400, cy: 200, r: 240, drawDelay: 0.4, rotateDuration: 90, clockwise: true, parallaxStrength: 8 },
  { id: "c2", cx: 500, cy: 400, r: 260, drawDelay: 0.5, rotateDuration: 120, clockwise: false, parallaxStrength: 12 },
  { id: "c3", cx: 450, cy: 600, r: 220, drawDelay: 0.6, rotateDuration: 100, clockwise: true, parallaxStrength: 6 },
];

const DRAW_DURATION = 0.8;
const REST_OPACITY = 0.55;
const MAX_MOUSE_DIST = 500; // px from center to reach full displacement

export default function HeroSignature() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // One motion value pair per circle — normalized -1..1
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const snx = useSpring(nx, spring.soft);
  const sny = useSpring(ny, spring.soft);

  useEffect(function trackMouse() {
    if (reduce) return;
    function onMove(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) {
        nx.set(0);
        ny.set(0);
        return;
      }
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const clamp = (v: number) =>
        Math.max(-1, Math.min(1, v / MAX_MOUSE_DIST));
      nx.set(clamp(dx));
      ny.set(clamp(dy));
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return function cleanup() {
      window.removeEventListener("mousemove", onMove);
      nx.set(0);
      ny.set(0);
    };
  }, [nx, ny, reduce]);

  return (
    <div
      ref={containerRef}
      className="hero-signature"
      aria-hidden
      style={{
        position: "absolute",
        top: 80,
        right: -280,
        width: VIEW_W,
        height: VIEW_H,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <linearGradient
            id="hs-stroke"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2={VIEW_W}
            y2={VIEW_H}
            gradientTransform="rotate(0)"
          >
            <stop offset="0%" stopColor="#C9B896" />
            <stop offset="50%" stopColor="#A8916D" />
            <stop offset="100%" stopColor="#C9B896" />
          </linearGradient>
        </defs>

        {CIRCLES.map((c) => (
          <SignatureCircle
            key={c.id}
            spec={c}
            snx={snx}
            sny={sny}
            reduce={!!reduce}
          />
        ))}
      </svg>

      <style>{`
        @media (max-width: 768px) {
          .hero-signature {
            transform: scale(0.6);
            transform-origin: top right;
            opacity: 0.64; /* combined with per-circle 0.55 → ~0.35 */
          }
        }
      `}</style>
    </div>
  );
}

function SignatureCircle({
  spec,
  snx,
  sny,
  reduce,
}: {
  spec: CircleSpec;
  snx: MotionValue<number>;
  sny: MotionValue<number>;
  reduce: boolean;
}) {
  const C = 2 * Math.PI * spec.r;

  // Per-circle parallax — derive absolute displacement from shared normalized motion values.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring.soft);
  const sy = useSpring(py, spring.soft);

  useEffect(
    function bindParallax() {
      if (reduce) return;
      const unsubX = snx.on("change", (v) => px.set(v * spec.parallaxStrength));
      const unsubY = sny.on("change", (v) => py.set(v * spec.parallaxStrength));
      return function cleanup() {
        unsubX();
        unsubY();
      };
    },
    [snx, sny, px, py, reduce, spec.parallaxStrength]
  );

  return (
    <motion.g style={{ x: sx, y: sy }}>
      <motion.g
        style={{ transformOrigin: `${spec.cx}px ${spec.cy}px` }}
        animate={
          reduce
            ? undefined
            : { rotate: spec.clockwise ? 360 : -360 }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: spec.rotateDuration,
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        <motion.circle
          cx={spec.cx}
          cy={spec.cy}
          r={spec.r}
          fill="none"
          stroke="url(#hs-stroke)"
          strokeWidth={1.5}
          strokeDasharray={C}
          initial={
            reduce
              ? { strokeDashoffset: 0, opacity: REST_OPACITY }
              : { strokeDashoffset: C, opacity: 0 }
          }
          animate={{ strokeDashoffset: 0, opacity: REST_OPACITY }}
          transition={
            reduce
              ? { duration: 0.01 }
              : {
                  duration: DRAW_DURATION,
                  ease: ease.outExpo,
                  delay: spec.drawDelay,
                }
          }
        />
      </motion.g>
    </motion.g>
  );
}
