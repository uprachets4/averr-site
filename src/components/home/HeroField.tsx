import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { easing, spring } from "../../lib/motion";
import { Link as RouterLink } from "react-router-dom";
import Screenshot from "../Screenshot";
import { PLANES, clientFor, figureFor, type Plane } from "./fieldPlan";

/**
 * The hero's field: the studio's actual work, hung in a room.
 *
 * Sixteen planes in a CSS 3D scene — twelve real case-study captures
 * through the WebP pipeline and four of the live /services screens.
 * No WebGL, no canvas: transforms on elements, which keeps the images
 * real images and the screens real components.
 *
 * Three things move it:
 *
 *   CAMERA    the cursor steers the scene's yaw and pitch on a soft
 *             spring. Because every plane sits at its own translateZ
 *             inside one `preserve-3d` scene, the near ones sweep and
 *             the far ones barely shift — real perspective, not a
 *             parallax multiplier per layer.
 *   AMBIENT   each plane drifts on its own loop, and the whole scene
 *             breathes ±1.5° over 40s. Both stop when the hero is off
 *             screen.
 *   DOLLY     one scroll value pushes the camera forward through the
 *             field; see `dolly`.
 *
 * Hovering or focusing a plane pulls it forward and dims the rest, and
 * its label shows the project and — only where caseStudies.ts has one —
 * its verified figure.
 */

/** Created once at module scope: motion.create returns a new component
 *  each call and would remount every plane on every render. */
const MotionLink = motion.create(RouterLink);

/** What the one shared label shows. */
type Tip = { name: string; figure?: { value: string; caption: string } };

/** Must match `perspective` and `perspective-origin` in the stylesheet. */
const PERSPECTIVE = 1400;
const ORIGIN_X = 50;
const ORIGIN_Y = 46;

/** The four planes that carry the first paint. */
const EAGER = new Set(["cg-hero", "sift-overview", "cc-overview", "cad-center"]);

/** How far the dolly pushes the whole scene. The phone's scale-through
 *  is shorter: fewer planes, less room to travel. */
const PUSH = 2400;
const PUSH_NARROW = 1250;
/** Where a plane is at its brightest: just short of the eye, while it is
 *  large on screen and before it clips past. */
const LIT_Z = 900;
const LIT_FALLOFF = 1150;

function PlaneBox({
  p,
  active,
  dimmed,
  onEnter,
  onLeave,
  dolly,
  flying,
  push,
}: {
  p: Plane;
  active: boolean;
  dimmed: boolean;
  onEnter: (rect: DOMRect | null, info: Tip) => void;
  onLeave: () => void;
  dolly: MotionValue<number>;
  flying: boolean;
  push: number;
}) {
  const figure = figureFor(p.slug);
  const client = clientFor(p.slug);
  const boxRef = useRef<HTMLAnchorElement | null>(null);

  /* depth decides how much of the dark it keeps */
  /* The falloff had the middle of the room at 0.62, which read as murk
     rather than distance. The floor is higher and the curve flatter;
     depth comes from SIZE and the hairline, not from fading to nothing. */
  const base = p.z < -1300 ? 0.62 : p.z < -800 ? 0.78 : p.z < -250 ? 0.92 : 1;

  /* THE KEY LIGHT. A plane brightens as it comes toward the camera, so
     the fly-through is lit by what is passing rather than by nothing.
     Measured against the at-rest frame, the pin had a crater at 40% —
     mean luminance 23.5 against 51.8 — in the gap between the near
     planes leaving and the landing arriving. This fills it. */
  const near = useTransform(dolly, function light(t: number) {
    const zNow = p.z + push * easing.inOut(t);
    return Math.max(0, 1 - Math.abs(zNow - LIT_Z) / LIT_FALLOFF);
  });
  /* A plane that reaches the eye magnifies one pixel across the whole
     frame. Fade it out as it arrives rather than letting it smear. */
  const exit = useTransform(dolly, function cull(t: number) {
    const zNow = p.z + push * easing.inOut(t);
    return 1 - Math.min(1, Math.max(0, (zNow - 980) / 320));
  });
  const lit = useTransform([near, exit] as const, function paint([n, e]: number[]) {
    if (dimmed) return base * 0.55 * e;
    /* no plane in the frustum sits under 0.62 while the camera moves */
    const floor = flying ? Math.max(base, 0.62) : base;
    return Math.min(1, floor + 0.38 * n) * e;
  });
  const rim = useTransform(near, [0.25, 1], [0, 1]);

  const inner = (
    <>
      <motion.span className="hf-chrome" aria-hidden style={{ "--hf-rim": rim } as never}>
        <i /><i /><i />
        <em>{p.label}</em>
      </motion.span>
      <span className="hf-shot">
        <Screenshot
          src={p.src}
          alt={`${p.label} — product screen`}
          sizes="(min-width: 1024px) 38vw, 70vw"
          loading={EAGER.has(p.id) ? "eager" : "lazy"}
          fetchPriority="low"
        />
      </span>
      <motion.span className="hf-sheen" aria-hidden style={{ opacity: rim }} />
    </>
  );

  /* x/y/w in the plan are where the plane should LAND ON SCREEN. A
     translateZ moves a plane toward the perspective origin and shrinks
     it, so authoring layout coordinates directly put far planes in the
     middle of the frame — six to eight of them sat on the headline at
     every width. Undo the projection here: k is the perspective
     foreshortening, and dividing by it means the plan reads as the
     composition you actually see. */
  const k = PERSPECTIVE / (PERSPECTIVE - p.z);
  const style = {
    left: `${ORIGIN_X + (p.x - ORIGIN_X) / k}%`,
    top: `${ORIGIN_Y + (p.y - ORIGIN_Y) / k}%`,
    width: `${p.w / k}%`,
    "--hf-z": `${p.z}px`,
    "--hf-yaw": `${p.yaw}deg`,
    "--hf-drift": `${p.drift[0]}px`,
    "--hf-period": `${p.drift[1]}s`,
  } as React.CSSProperties;

  const cls = `hf-plane${active ? " hf-plane--on" : ""}`;
  const motionStyle = { ...style, opacity: lit };

  function enter() {
    onEnter(boxRef.current?.getBoundingClientRect() ?? null, {
      name: client ?? p.label,
      figure,
    });
  }

  if (p.slug) {
    return (
      <MotionLink
        ref={boxRef}
        to={`/work/${p.slug}`}
        className={cls}
        style={motionStyle}
        onMouseEnter={enter}
        onMouseLeave={onLeave}
        onFocus={enter}
        onBlur={onLeave}
        aria-label={`${client ?? p.label} — open the case study`}
      >
        {inner}
      </MotionLink>
    );
  }
  return (
    <MotionLink
      ref={boxRef}
      to="/services"
      className={cls}
      style={motionStyle}
      onMouseEnter={enter}
      onMouseLeave={onLeave}
      onFocus={enter}
      onBlur={onLeave}
      aria-label={`${p.label} — see the services`}
    >
      {inner}
    </MotionLink>
  );
}

export default function HeroField({
  dolly,
  inView,
}: {
  /** 0 at rest, 1 at the end of the fly-through. */
  dolly: MotionValue<number>;
  inView: boolean;
}) {
  const reduce = !!useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  /* Which plane owns the label right now. A ref, because the leaving
     plane's blur fires around the arriving plane's focus and the two
     must not race: clearing from inside a setState updater let one
     plane's exit wipe the next plane's label, and only the first plane
     in the field ever showed one. */
  const ownerRef = useRef<string | null>(null);
  /* ONE label, rendered outside the 3D scene and clamped to the frame.
     Per-plane labels could not be kept on screen: `right: 0` inside a
     plane whose own right edge is past the viewport is still past the
     viewport, and a px nudge inside a 3D-transformed parent is itself
     transformed. Six of sixteen clipped at 1280 and two at 1920. */
  const [tip, setTip] = useState<{ x: number; y: number; info: Tip } | null>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(function watch() {
    const mq = window.matchMedia("(max-width: 1023px)");
    function on(e: MediaQueryList | MediaQueryListEvent) {
      setNarrow(e.matches);
    }
    on(mq);
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);

  /* ── the cursor camera ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const camY = useSpring(mx, spring.soft);
  const camX = useSpring(my, spring.soft);

  useEffect(
    function steer() {
      if (reduce || narrow || !inView) return;
      function on(e: PointerEvent) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        mx.set((e.clientX / w - 0.5) * 20);
        my.set(-(e.clientY / h - 0.5) * 14);
      }
      window.addEventListener("pointermove", on, { passive: true });
      return function off() {
        window.removeEventListener("pointermove", on);
      };
    },
    [reduce, narrow, inView, mx, my]
  );

  /* ── the fly-through ── */
  const push = useTransform(dolly, [0, 1], [0, narrow ? PUSH_NARROW : PUSH], { ease: easing.inOut });
  /* the camera straightens as it accelerates, so the landing is square */
  const settle = useTransform(dolly, [0, 0.55], [1, 0]);
  const rotY = useTransform([camY, settle] as const, function y([c, s]: number[]) {
    return c * s;
  });
  const rotX = useTransform([camX, settle] as const, function x([c, s]: number[]) {
    return c * s;
  });

  const shown = narrow ? PLANES.filter(function six(p) { return p.mobile; }) : PLANES;

  /* True while the camera is moving: the brightness floor only applies
     during the pin, so the at-rest composition keeps its depth falloff. */
  const [flying, setFlying] = useState(false);
  useMotionValueEvent(dolly, "change", function moving(t) {
    setFlying(t > 0.015);
  });

  return (
    <div
      ref={hostRef}
      className={reduce ? "hf hf--still" : "hf"}
      data-breathing={!reduce && inView && !narrow ? "on" : "off"}
    >
      <motion.div
        className="hf-scene"
        style={{
          rotateX: reduce ? 0 : rotX,
          rotateY: reduce ? 0 : rotY,
          z: reduce ? 0 : push,
        }}
      >
        {shown.map(function one(p) {
          return (
            <PlaneBox
              key={p.id}
              p={p}
              dolly={dolly}
              flying={flying}
              push={narrow ? PUSH_NARROW : PUSH}
              active={hover === p.id}
              dimmed={hover !== null && hover !== p.id}
              onEnter={function enter(rect, info) {
                ownerRef.current = p.id;
                setHover(p.id);
                const host = hostRef.current?.getBoundingClientRect();
                if (!rect || !host) return;
                const W = 260;
                const H = 64;
                setTip({
                  x: Math.min(Math.max(rect.left - host.left, 12), host.width - W - 12),
                  y: Math.min(Math.max(rect.bottom - host.top + 10, 12), host.height - H - 12),
                  info,
                });
              }}
              onLeave={function leave() {
                if (ownerRef.current !== p.id) return;
                ownerRef.current = null;
                setHover(null);
                setTip(null);
              }}
            />
          );
        })}
      </motion.div>

      {tip ? (
        <span className="hf-tip" style={{ left: tip.x, top: tip.y }}>
          <span className="hf-label__name">{tip.info.name}</span>
          {tip.info.figure ? (
            <span className="hf-label__fig">
              <b>{tip.info.figure.value}</b> {tip.info.figure.caption}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
