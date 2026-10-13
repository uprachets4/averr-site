import { motion, useTransform, type MotionValue } from "motion/react";
import Screenshot from "../Screenshot";

/**
 * The three objects that hover beside the giant words.
 *
 * All CSS/SVG 3D — no WebGL, no canvas. The only photographic material
 * is the real case-study captures in the website stack and the exploded
 * product; the orb and the rings are drawn abstractions, which is what
 * the asset rule asks for.
 */

type P = {
  assemble: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
};

/* ── Ch2 · a fan of real website captures ──────────────────────────── */

/* ASSET NOTE: the brief asked for "CG Walls + SIFT's marketing pages".
   SIFT has no marketing-page captures — all eight are product
   dashboards — so the stack is the four real CG Walls website captures,
   which are the only marketing-site captures in the repository. */
const SITE_STACK = [
  { src: "/work/cgwalls/hero.jpg", alt: "CG Walls & Floors — home page" },
  { src: "/work/cgwalls/gallery.jpg", alt: "CG Walls & Floors — project gallery" },
  { src: "/work/cgwalls/gallery2.jpg", alt: "CG Walls & Floors — before and after cards" },
  { src: "/work/cgwalls/testimonials.jpg", alt: "CG Walls & Floors — client testimonials" },
];

export function SiteStack({ assemble, tiltX, tiltY }: P) {
  return (
    <motion.div className="ob ob-stack" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1400 }}>
      {SITE_STACK.map(function card(s, i) {
        return <StackCard key={s.src} shot={s} i={i} assemble={assemble} />;
      })}
    </motion.div>
  );
}

function StackCard({
  shot,
  i,
  assemble,
}: {
  shot: { src: string; alt: string };
  i: number;
  assemble: MotionValue<number>;
}) {
  /* the fan opens as the chapter is read */
  const z = useTransform(assemble, [0, 1], [i * -70, i * -150]);
  const x = useTransform(assemble, [0, 1], [i * 14, i * 54]);
  const y = useTransform(assemble, [0, 1], [i * -10, i * -40]);
  const rot = useTransform(assemble, [0, 1], [i * -1.6, i * -5]);
  return (
    <motion.div className="ob-stack__card" style={{ z, x, y, rotateZ: rot }}>
      <Screenshot
        src={shot.src}
        alt={shot.alt}
        sizes="(min-width: 1024px) 30vw, 70vw"
        loading="lazy"
        style={{ height: "100%", objectFit: "cover" }}
      />
    </motion.div>
  );
}

/* ── Ch3 · one real product capture, exploded into z-layers ────────── */

const EXPLODE = "/work/capitalcommand/01-overview.jpg";
/** Bands of the SAME capture, masked — a genuine exploded view of one
 *  screen rather than five invented panels. */
const BANDS = [
  { clip: "inset(0% 78% 0% 0%)", label: "sidebar" },
  { clip: "inset(0% 0% 86% 22%)", label: "header" },
  { clip: "inset(14% 0% 56% 22%)", label: "cards" },
  { clip: "inset(44% 0% 24% 22%)", label: "chart" },
  { clip: "inset(76% 0% 0% 22%)", label: "table" },
];

export function Exploded({ assemble, tiltX, tiltY }: P) {
  return (
    <motion.div className="ob ob-explode" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1500 }}>
      {BANDS.map(function band(b, i) {
        return <Band key={b.label} band={b} i={i} assemble={assemble} />;
      })}
    </motion.div>
  );
}

function Band({
  band,
  i,
  assemble,
}: {
  band: { clip: string; label: string };
  i: number;
  assemble: MotionValue<number>;
}) {
  const mid = (BANDS.length - 1) / 2;
  /* The bands spread mostly in DEPTH. A wide lateral spread put the
     capture under the text column and took parch there to 3.9:1 — the
     only chapter that failed the contrast sweep. */
  /* The explosion goes BACKWARD. A band pushed toward the viewer is
     scaled up by the perspective — at +330 a 536px band renders ~700px
     and spilled into the text column, taking parch there to 3.9:1. Going
     away from the camera it shrinks, stays in its column, and still
     reads as an exploded view. */
  void mid;
  const z = useTransform(assemble, [0, 1], [0, i * -170]);
  const x = useTransform(assemble, [0, 1], [0, i * 16]);
  const y = useTransform(assemble, [0, 1], [0, i * -22]);
  return (
    <motion.div className="ob-explode__band" style={{ z, x, y, clipPath: band.clip }}>
      <Screenshot
        src={EXPLODE}
        alt=""
        sizes="(min-width: 1024px) 32vw, 72vw"
        loading="lazy"
        style={{ height: "100%", objectFit: "cover" }}
      />
    </motion.div>
  );
}

/* ── Ch4 · an orb of nodes ─────────────────────────────────────────── */

const N = 40;
/** A Fibonacci sphere, so the nodes are evenly spread rather than
 *  clustered at the poles. */
const NODES = Array.from({ length: N }, function node(_, i) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.sin(phi) * Math.sin(theta),
    z: Math.cos(phi),
    delay: (i % 9) * 0.45,
  };
});

export function Orb({ assemble, tiltX, tiltY }: P) {
  /* the orb tightens as the chapter is read */
  const r = useTransform(assemble, [0, 1], [1, 0.72]);
  return (
    <motion.div className="ob ob-orb" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}>
      <motion.div className="ob-orb__spin" style={{ scale: r }}>
        {NODES.map(function dot(n, i) {
          return (
            <span
              key={i}
              className="ob-orb__node"
              style={
                {
                  transform: `translate3d(${n.x * 130}px, ${n.y * 130}px, ${n.z * 130}px)`,
                  animationDelay: `${n.delay}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ── Ch5 · concentric rings on a tilted plane, with pins ───────────── */

const RINGS = [0, 1, 2, 3];
const PINS = [
  { x: -118, y: -46, h: 74 },
  { x: -28, y: 22, h: 108 },
  { x: 62, y: -14, h: 88 },
  { x: 128, y: 54, h: 62 },
  { x: -82, y: 72, h: 52 },
];

export function Rings({ assemble, tiltX, tiltY }: P) {
  return (
    <motion.div className="ob ob-rings" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1300 }}>
      <div className="ob-rings__plane">
        {RINGS.map(function ring(i) {
          return <Ring key={i} i={i} assemble={assemble} />;
        })}
        {PINS.map(function pin(p, i) {
          return <Pin key={i} pin={p} i={i} assemble={assemble} />;
        })}
      </div>
    </motion.div>
  );
}

function Ring({ i, assemble }: { i: number; assemble: MotionValue<number> }) {
  /* the rings push outward as the chapter is read */
  const scale = useTransform(assemble, [0, 1], [0.5 + i * 0.22, 0.78 + i * 0.4]);
  const op = useTransform(assemble, [0, 1], [0.5 - i * 0.08, 0.26 - i * 0.05]);
  return <motion.span className="ob-rings__ring" style={{ scale, opacity: op }} />;
}

function Pin({ pin, i, assemble }: { pin: { x: number; y: number; h: number }; i: number; assemble: MotionValue<number> }) {
  const h = useTransform(assemble, [0.1 + i * 0.06, 0.6 + i * 0.06], [0, pin.h]);
  return (
    <motion.span
      className="ob-rings__pin"
      style={{ x: pin.x, y: pin.y, height: h }}
    >
      <span className="ob-rings__head" />
    </motion.span>
  );
}
