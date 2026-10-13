import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { spring } from "../../lib/motion";
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

/* ── Ch4 · a sphere of nodes ───────────────────────────────────────── */

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

/* ── Ch3 · three real products, stacked in depth ───────────────────── */

/** The three product captures. Each is a real screen through the WebP
 *  pipeline — the masked-band "exploded" treatment it replaces was one
 *  capture cut into five strips, which read as muddy overlapping panels
 *  rather than as three products we built. */
export const PRODUCTS: Array<{ slug: string; src: string; name: string }> = [
  { slug: "capitalcommand", src: "/work/capitalcommand/01-overview.jpg", name: "CapitalCommand" },
  { slug: "sift", src: "/work/sift/01-command-overview.jpg", name: "SIFT" },
  { slug: "cadencestack", src: "/work/cadencestack/01-command-center.jpg", name: "CadenceStack" },
];

export function ProductStack({
  assemble,
  tiltX,
  tiltY,
  front,
  reduce,
}: P & { front: number; reduce: boolean }) {
  return (
    <motion.div
      className="ob ob-pstack"
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1500 }}
    >
      {PRODUCTS.map(function card(p, i) {
        return (
          <ProductCard key={p.name} p={p} i={i} assemble={assemble} front={front} reduce={reduce} />
        );
      })}
    </motion.div>
  );
}

function ProductCard({
  p,
  i,
  assemble,
  front,
  reduce,
}: {
  p: { src: string; name: string };
  i: number;
  assemble: MotionValue<number>;
  front: number;
  reduce: boolean;
}) {
  /* A card's place in the stack is its RANK FROM THE FRONT, not its
     index, so the three can take turns without the composition moving:
     rank 0 is the readable one, rank 2 is furthest back. Springing the
     RANK ITSELF — rather than animating each offset — is what makes a
     swap read as one plate sliding back while another rises, and it
     stays transforms only: no layout, no repaint. */
  const rank = (i - front + PRODUCTS.length) % PRODUCTS.length;
  const raw = useMotionValue(rank);
  useEffect(
    function follow() {
      raw.set(rank);
    },
    [rank, raw]
  );
  const sprung = useSpring(raw, spring.soft);
  /* Reduced motion swaps instantly: the spring is bypassed, not sped up. */
  const r = reduce ? raw : sprung;

  /* The spread is the chapter's own scroll: they arrive stacked and
     open as it is read. The cascade goes UP and left so every title bar
     clears the one in front of it, and BACKWARD in z because a plane
     pushed toward the camera is scaled up by the perspective and spills
     into the text column. */
  const spread = useTransform(assemble, [0.05, 0.7], [0.1, 1]);
  const pair = [r, spread] as MotionValue<number>[];
  const z = useTransform(pair, function zz([rv, sv]: number[]) {
    return rv * -210 * sv;
  });
  const x = useTransform(pair, function xx([rv, sv]: number[]) {
    return rv * -78 * sv;
  });
  const y = useTransform(pair, function yy([rv, sv]: number[]) {
    return rv * -84 * sv;
  });
  const nameOpacity = useTransform(assemble, [0.18, 0.4], [0, 1]);

  return (
    <motion.div className="ob-pstack__card" style={{ z, x, y }}>
      <span className="ob-pstack__chrome" aria-hidden>
        <i /><i /><i />
        <motion.em style={{ opacity: nameOpacity }}>{p.name}</motion.em>
      </span>
      <span className="ob-pstack__shot">
        <Screenshot
          src={p.src}
          alt=""
          sizes="(min-width: 1024px) 34vw, 76vw"
          loading="lazy"
          style={{ height: "100%", objectFit: "cover", objectPosition: "top left" }}
        />
      </span>
    </motion.div>
  );
}
