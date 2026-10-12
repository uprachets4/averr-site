import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { spring } from "../../lib/motion";
import { PRESETS, presetFor, type PresetId } from "./sketch/presets";

/**
 * The browser window the sketch is built inside.
 *
 * It sits across the lower half of the hero, bleeds off the right edge
 * like a film frame, and leans toward the cursor. On scroll it un-tilts
 * and scales until it fills the viewport, which is the handover to the
 * real work below.
 *
 * NOTHING HERE IS ON THE CRITICAL PATH. The chrome, the window's box and
 * a static first frame of the default sketch are plain markup at a
 * DEFINITE height, so they paint immediately and cannot shift anything.
 * The generator — seven presets, the art, the monogram — is imported
 * only after the hero has painted, on idle or on the first pointer move.
 */

const LABEL = "A 10-SECOND SKETCH · THE REAL ONE TAKES TWO WEEKS";

type Gen = (p: { name: string; presetId: PresetId; compact?: boolean }) => React.ReactNode;

/**
 * The first frame: the default sketch's opening screen in plain divs.
 * It exists so the window is never an empty rectangle and so the real
 * generator swaps into the same box. Deliberately dumb — no presets, no
 * SVG art, no imports.
 */
function StaticFrame({ compact }: { compact?: boolean }) {
  const p = PRESETS.local.palette;
  return (
    <div className="sw-static" style={{ background: p.bg }} aria-hidden>
      <div className="sw-static__nav" style={{ background: p.surface }}>
        <span className="sw-static__mark" style={{ background: p.accent }} />
        <span className="sw-static__name" style={{ background: p.ink, opacity: 0.8 }} />
        <span className="sw-static__pill" style={{ background: p.accent }} />
      </div>
      <div className="sw-static__art" style={{ background: `color-mix(in srgb, ${p.accent} 10%, transparent)` }} />
      <div className="sw-static__body">
        <span className="sw-static__line" style={{ background: p.ink, width: compact ? "80%" : "58%" }} />
        <span className="sw-static__line" style={{ background: p.ink, width: compact ? "60%" : "40%" }} />
        <span className="sw-static__sub" style={{ background: p.muted, width: compact ? "90%" : "46%" }} />
        <span className="sw-static__sub" style={{ background: p.muted, width: compact ? "70%" : "34%" }} />
        <span className="sw-static__btn" style={{ background: p.accent }} />
      </div>
    </div>
  );
}

export default function SketchWindow({
  name,
  fill,
  compact = false,
}: {
  name: string;
  /** 0 = sitting in the hero, 1 = filling the viewport. */
  fill?: MotionValue<number>;
  compact?: boolean;
}) {
  const reduce = !!useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const winRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<HTMLDivElement | null>(null);

  const [Gen, setGen] = useState<Gen | null>(null);
  const [hover, setHover] = useState(false);
  const presetId = presetFor(name);

  /* ── the generator, after the hero has painted ── */
  useEffect(function loadAfterPaint() {
    let alive = true;
    let done = false;
    function go() {
      if (done || !alive) return;
      done = true;
      import("./sketch/SketchSite")
        .then(function take(m) {
          if (alive) setGen(function hold() {
            return m.default as unknown as Gen;
          });
        })
        .catch(function ignore() {
          /* the static frame stays; the window is never empty */
        });
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback;
    const id = ric ? ric(go, { timeout: 2500 }) : window.setTimeout(go, 1800);
    window.addEventListener("pointermove", go, { once: true, passive: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
    window.addEventListener("keydown", go, { once: true });
    return function off() {
      alive = false;
      window.removeEventListener("pointermove", go);
      window.removeEventListener("scroll", go);
      window.removeEventListener("keydown", go);
      if (!ric) window.clearTimeout(id as number);
    };
  }, []);

  /* ── the lean toward the cursor ── */
  const TILT = 5;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring.soft);
  const sy = useSpring(py, spring.soft);

  /* ── where it has to go to fill the viewport ── */
  const [target, setTarget] = useState({ scale: 1, x: 0, y: 0 });
  useLayoutEffect(function measureFill() {
    function run() {
      const host = hostRef.current;
      const win = winRef.current;
      if (!host || !win) return;
      const w = win.getBoundingClientRect();
      if (!w.width) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setTarget({
        scale: Math.max(vw / w.width, vh / w.height),
        x: vw / 2 - (w.left + w.width / 2),
        y: vh / 2 - (w.top + w.height / 2),
      });
    }
    run();
    window.addEventListener("resize", run);
    const t = window.setTimeout(run, 400);
    return function off() {
      window.removeEventListener("resize", run);
      window.clearTimeout(t);
    };
  }, [compact]);

  /* One scroll value drives the whole hand-over. */
  const zero = useMotionValue(0);
  const f = fill ?? zero;
  const ease01 = useTransform(f, [0, 1], [0, 1]);

  const rotateX = useTransform([ease01, sy] as const, function rx([p, t]: number[]) {
    return (reduce ? 6 : 6 + t) * (1 - p);
  });
  const rotateY = useTransform([ease01, sx] as const, function ry([p, t]: number[]) {
    return (reduce ? -10 : -10 + t) * (1 - p);
  });
  const scale = useTransform(ease01, [0, 1], [1, target.scale]);
  const tx = useTransform(ease01, [0, 1], [0, target.x]);
  const ty = useTransform(ease01, [0, 1], [0, target.y]);
  const radius = useTransform(ease01, [0, 1], [16, 0]);
  /** The label and the lean go as soon as the hand-over starts. */
  const chromeFade = useTransform(ease01, [0, 0.35], [1, 0]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || compact || !winRef.current) return;
    const r = winRef.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2 * TILT);
    py.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * TILT);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
    setHover(false);
  }

  /* ── the page inside scrolls itself, so it reads as a live site ── */
  const pageY = useMotionValue(0);
  const ghost = useMotionValue(0);
  const [ghostAt, setGhostAt] = useState({ x: 0, y: 0, down: false });

  useEffect(
    function selfScroll() {
      if (reduce) {
        pageY.set(0);
        return;
      }
      let raf = 0;
      const PERIOD = 26000;
      const t0 = performance.now();
      function frame(now: number) {
        raf = requestAnimationFrame(frame);
        if (hover) return;
        const page = pageRef.current;
        const view = viewRef.current;
        if (!page || !view) return;
        const travel = Math.max(0, page.scrollHeight - view.clientHeight);
        const k = ((now - t0) % PERIOD) / PERIOD;
        // out and back, eased at both ends so it never snaps
        const tri = k < 0.5 ? k * 2 : (1 - k) * 2;
        const eased = tri * tri * (3 - 2 * tri);
        pageY.set(-travel * eased);
        ghost.set(k);
      }
      raf = requestAnimationFrame(frame);
      return function stop() {
        cancelAnimationFrame(raf);
      };
    },
    [reduce, hover, pageY, ghost]
  );

  /* the ghost cursor reaches the booking button once per loop */
  useMotionValueEvent(ghost, "change", function move(k) {
    if (reduce || compact) return;
    const view = viewRef.current;
    if (!view) return;
    const btn = view.querySelector("[data-sk-book]");
    if (!btn) return;
    const vb = view.getBoundingClientRect();
    const bb = btn.getBoundingClientRect();
    const tx2 = bb.left - vb.left + bb.width / 2;
    const ty2 = bb.top - vb.top + bb.height / 2;
    // idle at the lower left, then travel to the button between .56 and .72
    const start = { x: vb.width * 0.16, y: vb.height * 0.82 };
    const t = k < 0.56 ? 0 : k > 0.78 ? 0 : Math.min(1, (k - 0.56) / 0.12);
    const e = t * t * (3 - 2 * t);
    setGhostAt({
      x: start.x + (tx2 - start.x) * e,
      y: start.y + (ty2 - start.y) * e,
      down: k > 0.69 && k < 0.73,
    });
  });

  return (
    <div
      className={compact ? "sw sw--compact" : "sw"}
      ref={hostRef}
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseEnter={function enter() {
        setHover(true);
      }}
      onMouseLeave={onLeave}
    >
      <motion.div
        ref={winRef}
        className="sw-win"
        style={{
          rotateX,
          rotateY,
          scale,
          x: tx,
          y: ty,
          borderRadius: radius,
          transformPerspective: 1800,
        }}
      >
        <div className="sw-chrome">
          <span /><span /><span />
          <em className="sw-url">
            {/* accents fold rather than vanish: "Café" was becoming
                "caf", which reads as a typo rather than a domain */}
            {(name.trim() || "your business")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "")
              .slice(0, 22) || "yourbusiness"}
            .ca
          </em>
        </div>

        <div className="sw-view" ref={viewRef}>
          <motion.div className="sw-page" ref={pageRef} style={{ y: pageY }}>
            {Gen ? <Gen name={name} presetId={presetId} compact={compact} /> : <StaticFrame compact={compact} />}
          </motion.div>

          {/* the ghost cursor */}
          {!reduce && !compact ? (
            <span
              className={ghostAt.down ? "sw-ghost sw-ghost--down" : "sw-ghost"}
              style={{ transform: `translate3d(${ghostAt.x}px, ${ghostAt.y}px, 0)` }}
            >
              <svg viewBox="0 0 16 20" width="16" height="20">
                <path d="M1 1 L1 17 L5.2 13.2 L7.8 19 L10.6 17.7 L8 12 L13.6 12 Z" fill="#141412" stroke="#F4F0E6" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </span>
          ) : null}
        </div>
      </motion.div>

      <motion.p className="sw-label" style={{ opacity: chromeFade }}>
        {LABEL}
      </motion.p>
    </div>
  );
}
