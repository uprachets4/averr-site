import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { easing, spring } from "../../lib/motion";
import { PLACED, gatherSlot, type Placed } from "./piecePlan";
import { PIECE_BY_ID, Piece } from "./pieces";

/**
 * The hero's room — now made of pieces, not screenshots.
 *
 * The mechanics are the ones Sessions 23 and 23b established and the
 * owner called the standard: one `preserve-3d` scene, a cursor-steered
 * camera, each object at its own translateZ so the near ones sweep and
 * the far ones barely shift, an even depth ladder so the fly-through is
 * never empty, and a key light that brightens whatever is passing.
 *
 * What changed is WHAT hangs in it. Fifteen crafted primitives, each
 * focusable and each with its own toy, instead of fifteen dashboards —
 * the project captures now appear exactly once on home, in the work
 * section.
 *
 * The dolly ends in a GATHER rather than on a landing frame: the same
 * DOM pieces swirl into a ring and carry into chapter two, so there is
 * no cut and no capture to cut to.
 */

/** Must match `perspective` / `perspective-origin` in the stylesheet. */
const PERSPECTIVE = 1400;
const ORIGIN_X = 50;
const ORIGIN_Y = 46;

const PUSH = 2400;
const PUSH_NARROW = 1250;

/** Where a piece is brightest: large on screen, before it clips past. */
const LIT_Z = 900;
const LIT_FALLOFF = 1150;

function PieceBox({
  p,
  i,
  n,
  dimmed,
  dolly,
  flying,
  push,
  onFocus,
  onBlur,
}: {
  p: Placed;
  i: number;
  n: number;
  dimmed: boolean;
  dolly: MotionValue<number>;
  flying: boolean;
  push: number;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const def = PIECE_BY_ID[p.id];

  /* depth decides how much of the dark it keeps — size and the rim do
     the rest, rather than fading the far ones to nothing */
  const base = p.z < -1300 ? 0.74 : p.z < -800 ? 0.84 : p.z < -250 ? 0.93 : 1;

  const near = useTransform(dolly, function light(t: number) {
    const zNow = p.z + push * easing.inOut(t);
    return Math.max(0, 1 - Math.abs(zNow - LIT_Z) / LIT_FALLOFF);
  });
  const exit = useTransform(dolly, function cull(t: number) {
    const zNow = p.z + push * easing.inOut(t);
    return 1 - Math.min(1, Math.max(0, (zNow - 980) / 320));
  });

  /* THE GATHER. Past 62% of the pin the pieces stop being a room and
     become a formation: a ring that tightens and turns, which is what
     chapter two picks up and flies to its slots. */
  const slot = gatherSlot(i, n);
  const gather = useTransform(dolly, [0.62, 1], [0, 1], { ease: easing.inOut });
  const gx = useTransform(gather, function gxx(g: number) {
    return g * (slot.ax * 190 - (p.x - 70) * 5.2);
  });
  const gy = useTransform(gather, function gyy(g: number) {
    return g * (slot.ay * 150 - (p.y - 50) * 3.4);
  });
  /* The piece's own scale rides on the gather value, because motion and
     the stylesheet cannot both own `transform` — see the slot below. */
  const gscale = useTransform(gather, [0, 1], [p.s, p.s * 0.58]);
  const grot = useTransform(gather, [0, 1], [0, i % 2 ? 26 : -26]);

  const lit = useTransform(
    [near, exit, gather] as MotionValue<number>[],
    function paint([nv, e, g]: number[]) {
      if (dimmed) return base * 0.5 * e;
      const floor = flying ? Math.max(base, 0.62) : base;
      /* the formation is lit evenly — it is one object now */
      return Math.min(1, Math.max(floor + 0.38 * nv, g * 0.92)) * Math.max(e, g * 0.9);
    }
  );

  /* x/y in the plan are where the piece LANDS ON SCREEN. translateZ
     moves it toward the perspective origin and shrinks it, so the plan
     is divided by its own foreshortening — authoring in layout
     coordinates is what once put half the field on the headline. */
  const k = PERSPECTIVE / (PERSPECTIVE - p.z);
  const style = {
    left: `${ORIGIN_X + (p.x - ORIGIN_X) / k}%`,
    top: `${ORIGIN_Y + (p.y - ORIGIN_Y) / k}%`,
    "--pf-z": `${p.z}px`,
    "--pf-yaw": `${p.yaw}deg`,
    "--pf-drift": `${p.drift[0]}px`,
    "--pf-period": `${p.drift[1]}s`,
    "--pc-delay": `${(i % 7) * 0.55}s`,
  } as React.CSSProperties;

  /* TWO ELEMENTS, ONE TRANSFORM EACH. motion writes its own `transform`
     string from x/y/scale/rotate, which replaces the stylesheet's —
     including the translateZ and the -50% centring that put the piece
     where the plan says. With both on one node the depth silently
     vanished and ten of fifteen pieces rendered off the frame. The slot
     owns the placement, the inner node owns the motion. */
  return (
    <div className="pf-slot" style={style}>
      <motion.div
        className="pf-gather"
        style={{ opacity: lit, x: gx, y: gy, rotateZ: grot, scale: gscale }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <Piece def={def} interactive />
      </motion.div>
    </div>
  );
}

export default function PieceField({
  dolly,
  inView,
}: {
  dolly: MotionValue<number>;
  inView: boolean;
}) {
  const reduce = !!useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(function watchWidth() {
    const mq = window.matchMedia("(max-width: 1023px)");
    function read() {
      setNarrow(mq.matches);
    }
    read();
    mq.addEventListener("change", read);
    return function off() {
      mq.removeEventListener("change", read);
    };
  }, []);

  /* the cursor camera */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const camX = useSpring(rx, spring.soft);
  const camY = useSpring(ry, spring.soft);

  useEffect(
    function steer() {
      if (reduce || narrow) return;
      function move(e: PointerEvent) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        ry.set((e.clientX / w - 0.5) * 11);
        rx.set(-(e.clientY / h - 0.5) * 7);
      }
      window.addEventListener("pointermove", move, { passive: true });
      return function off() {
        window.removeEventListener("pointermove", move);
      };
    },
    [reduce, narrow, rx, ry]
  );

  const push = narrow ? PUSH_NARROW : PUSH;
  const sceneZ = useTransform(dolly, function dollyZ(t: number) {
    return push * easing.inOut(t);
  });

  const list = narrow ? PLACED.filter((p) => p.mobile) : PLACED;
  const flying = true;

  return (
    <div
      ref={sceneRef}
      className={reduce ? "pf pf--still" : "pf"}
      data-breathing={!reduce && inView && !narrow ? "on" : "off"}
      aria-hidden={false}
    >
      <motion.div
        className="pf-scene"
        style={{
          rotateX: reduce || narrow ? 0 : camX,
          rotateY: reduce || narrow ? 0 : camY,
          z: reduce ? 0 : sceneZ,
        }}
      >
        {list.map(function one(p, i) {
          return (
            <PieceBox
              key={p.id}
              p={p}
              i={i}
              n={list.length}
              dimmed={held !== null && held !== i}
              dolly={dolly}
              flying={flying}
              push={push}
              onFocus={function f() {
                setHeld(i);
              }}
              onBlur={function b() {
                setHeld(null);
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
