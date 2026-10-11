import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import { PHRASES } from "./heroPhrases";

/**
 * The hero's live scene: the studio's actual work, running.
 *
 * Each phrase owns one of /services' real screens — the Northgate
 * site, the local-search map, the agent console — reused, not rebuilt,
 * from the chunks /services already ships. They are driven by a
 * looping `local` value so each one performs its own micro-motion
 * while it is the active one.
 *
 * NOTHING here is on the hero's critical path. The window chrome and a
 * placeholder of the same ground hold the exact space from the first
 * frame; the screens are imported only after the LCP has happened —
 * on idle, or on the first pointer move or scroll, whichever comes
 * first — so the swap cannot shift anything and cannot delay the hero.
 */

type Screen = (p: { local: MotionValue<number>; compact?: boolean }) => React.ReactNode;

/** The three real screens, in phrase order. Loaded, not lazy-rendered:
 *  see `useScreens`. */
const LOADERS: Array<() => Promise<Screen>> = [
  async function loadSite() {
    return (await import("../services/build/BuildScreens")).ScreenLocalSite;
  },
  async function loadMap() {
    return (await import("../services/build/GrowScreens")).ScreenMap;
  },
  async function loadAgent() {
    return (await import("../services/build/AutomateScreens")).ScreenAgent;
  },
];

const TITLES = ["northgate.ca", "Local search — Northgate", "Northgate Ops — Agent"];

/**
 * Fetches all three screens once, after the hero has painted, and hands back
 * the ones that have arrived.
 *
 * `lazy` + `Suspense` cannot be used here. A lazy child inside an
 * `AnimatePresence` suspends the moment the reader switches to a phrase whose
 * chunk is not in yet, and a `fallback` of null then blanks the WHOLE scene —
 * which is exactly what it did on a phone: window chrome, correct title,
 * nothing inside. Fetching the modules into state instead means a switch is a
 * render, never a suspension, and a phrase whose chunk has not landed holds
 * the previous screen rather than emptying the window.
 */
/** Resolves when the main thread next has nothing better to do. */
function idle() {
  return new Promise<void>(function wait(done) {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback;
    if (ric) ric(() => done(), { timeout: 600 });
    else window.setTimeout(done, 120);
  });
}

function useScreens(on: boolean) {
  const [mods, setMods] = useState<Record<number, Screen>>({});
  useEffect(
    function load() {
      if (!on) return;
      let alive = true;
      (async function run() {
        for (let i = 0; i < LOADERS.length; i++) {
          // a breath between chunks, so three module evaluations in a row
          // do not add up to one long task
          if (i > 0) await idle();
          if (!alive) return;
          try {
            const S = await LOADERS[i]();
            if (!alive) return;
            setMods(function add(prev) {
              return { ...prev, [i]: S };
            });
          } catch {
            /* a chunk that will not load leaves the window empty, which is
               the same as not having reached it yet */
          }
        }
      })();
      return function stop() {
        alive = false;
      };
    },
    [on]
  );
  return mods;
}

/** Runs `local` around a slow loop so the active screen stays alive. */
function useLoop(active: boolean, reduce: boolean) {
  const local = useMotionValue(reduce ? 1 : 0);
  useEffect(
    function run() {
      if (!active) return;
      if (reduce) {
        local.set(1);
        return;
      }
      let raf = 0;
      const t0 = performance.now();
      const PERIOD = 9000;
      function frame(now: number) {
        local.set(((now - t0) % PERIOD) / PERIOD);
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      return function stop() {
        cancelAnimationFrame(raf);
      };
    },
    [active, reduce, local]
  );
  return local;
}

function LiveScreen({ Screen, reduce }: { Screen: Screen; reduce: boolean }) {
  const local = useLoop(true, reduce);
  return <Screen local={local} compact />;
}

export default function HeroScene({ index }: { index: number }) {
  const reduce = !!useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* after the hero has painted, never before */
  useEffect(function afterLcp() {
    if (reduce) {
      // still load, just without waiting on motion
      const t = window.setTimeout(() => setHydrated(true), 400);
      return () => window.clearTimeout(t);
    }
    let done = false;
    function go() {
      if (done) return;
      done = true;
      setHydrated(true);
    }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback;
    const id = ric ? ric(go, { timeout: 2500 }) : window.setTimeout(go, 1800);
    window.addEventListener("pointermove", go, { once: true, passive: true });
    window.addEventListener("scroll", go, { once: true, passive: true });
    return function off() {
      done = true;
      window.removeEventListener("pointermove", go);
      window.removeEventListener("scroll", go);
      if (!ric) window.clearTimeout(id as number);
    };
  }, [reduce]);

  /* The screen on show: the active phrase's, or the last one that loaded if
     its chunk has not landed yet. The title above always tells the truth
     about the phrase; this only decides what is inside the window. */
  const mods = useScreens(hydrated);
  const shownRef = useRef(0);
  if (mods[index]) shownRef.current = index;
  const shown = shownRef.current;
  const Screen = mods[shown];

  /* the window leans toward the cursor */
  const MAX = 6;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, spring.soft);
  const sRy = useSpring(ry, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !hostRef.current) return;
    const r = hostRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 2 * MAX);
    rx.set(-py * 2 * MAX);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const others = [0, 1, 2].filter((i) => i !== index);

  return (
    <div className="hs" ref={hostRef} onMouseMove={onMove} onMouseLeave={onLeave} aria-hidden="true">
      {/* the stack behind: the other two scenes' chrome, quiet */}
      {others.map((i, n) => (
        <div key={i} className="hs-ghost" style={{ transform: `translate(${(n + 1) * 16}px, ${(n + 1) * -14}px)` }}>
          <div className="hs-chrome"><span /><span /><span /></div>
        </div>
      ))}

      <motion.div
        className="hs-win"
        style={{
          rotateX: reduce ? 4 : sRx,
          rotateY: reduce ? -8 : sRy,
          transformPerspective: 1400,
        }}
        initial={false}
        animate={reduce ? {} : { rotateX: 4, rotateY: -8 }}
        transition={{ duration: 0 }}
      >
        <div className="hs-chrome">
          <span /><span /><span />
          {/* Follows the phrase while the window is empty, and whatever is
              actually inside it once a screen is there. */}
          <em className="hs-title">{TITLES[Screen !== undefined ? shown : index]}</em>
        </div>
        <div className="hs-body">
          {/* the reserve: present from the first frame, exactly the
              size the screen will be, in the screen's own ground */}
          <div className="hs-hold" />
          {Screen !== undefined ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown}
                className="hs-screen"
                initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 1.012 }}
                transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
              >
                <LiveScreen Screen={Screen} reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </motion.div>

      <style>{`
        .hs {
          position: relative;
          width: 100%;
          perspective: 1400px;
        }
        .hs-ghost {
          position: absolute; inset: 0;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(20,20,18,0.12);
          background: var(--color-bg-alt);
          opacity: 0.25;
          pointer-events: none;
        }
        .hs-win {
          position: relative;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(20,20,18,0.16);
          background: var(--color-bg);
          box-shadow: 0 40px 90px -42px rgba(20,20,18,0.45);
          will-change: transform;
        }
        .hs-chrome {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 14px;
          background: var(--color-bg-alt);
          border-bottom: 1px solid rgba(20,20,18,0.12);
        }
        .hs-chrome > span {
          width: 10px; height: 10px; border-radius: 50%;
          background: rgba(20,20,18,0.18);
        }
        .hs-title {
          margin-left: 10px; font-style: normal;
          font-family: var(--font-mono); font-size: 13px;
          color: var(--color-muted);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        /* a DEFINITE height, so the lazy screen cannot shift the hero */
        .hs-body { position: relative; height: min(46vh, 420px); }
        .hs-hold { position: absolute; inset: 0; background: var(--color-bg); }
        .hs-screen { position: absolute; inset: 0; overflow: hidden; }
        @media (max-width: 1023px) {
          .hs-ghost { display: none; }
          .hs-body { height: 300px; }
        }
      `}</style>
    </div>
  );
}

export { PHRASES };
