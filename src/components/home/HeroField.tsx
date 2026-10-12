import { lazy, Suspense, useEffect, useRef, useState } from "react";
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

const Site = lazy(async function a() {
  return { default: (await import("../services/build/BuildScreens")).ScreenLocalSite };
});
const Brand = lazy(async function b() {
  return { default: (await import("../services/build/BuildScreens")).ScreenBrandBoard };
});
const Agent = lazy(async function c() {
  return { default: (await import("../services/build/AutomateScreens")).ScreenAgent };
});
const Map = lazy(async function d() {
  return { default: (await import("../services/build/GrowScreens")).ScreenMap };
});

const SCREENS = { site: Site, brand: Brand, agent: Agent, map: Map } as const;

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

/** How far the dolly pushes the whole scene. Must match `push` below. */
const PUSH = 2400;
/** Where a plane is at its brightest: just short of the eye, while it is
 *  large on screen and before it clips past. */
const LIT_Z = 900;
const LIT_FALLOFF = 1150;

function PlaneBox({
  p,
  active,
  dimmed,
  live,
  onEnter,
  onLeave,
  localValue,
  dolly,
  flying,
}: {
  p: Plane;
  active: boolean;
  dimmed: boolean;
  live: boolean;
  onEnter: (rect: DOMRect | null, info: Tip) => void;
  onLeave: () => void;
  localValue: MotionValue<number>;
  dolly: MotionValue<number>;
  flying: boolean;
}) {
  const figure = figureFor(p.slug);
  const client = clientFor(p.slug);
  const Screen = p.screen ? SCREENS[p.screen] : null;
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
    const zNow = p.z + PUSH * easing.inOut(t);
    return Math.max(0, 1 - Math.abs(zNow - LIT_Z) / LIT_FALLOFF);
  });
  /* A plane that reaches the eye magnifies one pixel across the whole
     frame. Fade it out as it arrives rather than letting it smear. */
  const exit = useTransform(dolly, function cull(t: number) {
    const zNow = p.z + PUSH * easing.inOut(t);
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
        {p.kind === "shot" && p.src ? (
          <Screenshot
            src={p.src}
            alt={`${p.label} — product screen`}
            sizes="(min-width: 1024px) 38vw, 70vw"
            loading={EAGER.has(p.id) ? "eager" : "lazy"}
            fetchPriority="low"
          />
        ) : Screen && live ? (
          <Suspense fallback={null}>
            <span className="hf-live">
              <Screen local={localValue} compact />
            </span>
          </Suspense>
        ) : (
          <span className="hf-hold" aria-hidden />
        )}
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
  /* ONE label, rendered outside the 3D scene and clamped to the frame.
     Per-plane labels could not be kept on screen: `right: 0` inside a
     plane whose own right edge is past the viewport is still past the
     viewport, and a px nudge inside a 3D-transformed parent is itself
     transformed. Six of sixteen clipped at 1280 and two at 1920. */
  const [tip, setTip] = useState<{ x: number; y: number; info: Tip } | null>(null);
  const [live, setLive] = useState(false);
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

  /* the live screens mount after the hero has painted */
  useEffect(function afterPaint() {
    let done = false;
    function go() {
      if (done) return;
      done = true;
      setLive(true);
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback;
    const id = ric ? ric(go, { timeout: 2600 }) : window.setTimeout(go, 1900);
    window.addEventListener("pointermove", go, { once: true, passive: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
    return function off() {
      done = true;
      window.removeEventListener("pointermove", go);
      window.removeEventListener("scroll", go);
      if (!ric) window.clearTimeout(id as number);
    };
  }, []);

  /* one value drives every live screen's own micro-motion */
  const localValue = useMotionValue(reduce ? 1 : 0);
  useEffect(
    function loop() {
      if (!live || reduce || !inView) return;
      let raf = 0;
      const t0 = performance.now();
      function frame(now: number) {
        localValue.set(((now - t0) % 11000) / 11000);
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      return function stop() {
        cancelAnimationFrame(raf);
      };
    },
    [live, reduce, inView, localValue]
  );

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
  const push = useTransform(dolly, [0, 1], [0, 2400], { ease: easing.inOut });
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
              live={live}
              dolly={dolly}
              flying={flying}
              active={hover === p.id}
              dimmed={hover !== null && hover !== p.id}
              localValue={localValue}
              onEnter={function enter(rect, info) {
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
                setHover(function clear(cur: string | null) {
                  if (cur === p.id) {
                    setTip(null);
                    return null;
                  }
                  return cur;
                });
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
