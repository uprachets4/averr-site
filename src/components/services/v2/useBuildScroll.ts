import { useCallback, useEffect, useRef, useState } from "react";
import { BEATS } from "../../../data/servicesBuild";

/**
 * The build's one scroll loop.
 *
 * Thirteen segments: the twelve beats, then "All four". The reference's
 * arithmetic, unchanged —
 *
 *   p    = -top / (height - vh), clamped
 *   seg  = p * 13
 *   beat = min(12, floor(seg))
 *   t    = min(1, seg - beat)
 *   step = min(4, 1 + floor(t / .17))
 *
 * Two kinds of output, deliberately split:
 *
 *   - `beat` and `step` are React state, but they change only when the
 *     pair changes — about fifty times across the whole build, not once
 *     a frame. The slots, cards and rail read them in render.
 *   - the rail's tick fill is continuous in `t`, so it is written
 *     straight onto the nodes inside the rAF. Putting that through
 *     state would re-render the stage sixty times a second
 *     (handoff 5.1).
 *
 * The stage's three fit scales are measured, not guessed: the mocks are
 * designed at 960x600, 300x620 and 560x640, and each is scaled to
 * whatever the stage actually is.
 */

export const SEGMENTS = BEATS.length + 1;
/** The last segment, where four mocks tile. */
export const ALL_FOUR_BEAT = BEATS.length;

export type BuildState = { beat: number; step: number };

export function useBuildScroll(
  buildRef: React.RefObject<HTMLElement | null>,
  stageRef: React.RefObject<HTMLElement | null>,
  railRef: React.RefObject<HTMLElement | null>
) {
  const [state, setState] = useState<BuildState>({ beat: 0, step: 1 });
  const key = useRef("");

  /* The stage is pinned, so its height drives how long the build is. */
  useEffect(
    function sizeTheBuild() {
      const build = buildRef.current;
      if (!build) return;
      function setHeight() {
        const per = window.innerWidth < 900 ? 62 : 72;
        build!.style.height = `${SEGMENTS * per + 100}vh`;
      }
      setHeight();
      window.addEventListener("resize", setHeight);
      return function stop() {
        window.removeEventListener("resize", setHeight);
      };
    },
    [buildRef]
  );

  /* Scale each mock to the stage it has to live in. */
  useEffect(
    function fitTheMocks() {
      const stage = stageRef.current;
      if (!stage) return;
      function fit() {
        const w = stage!.clientWidth;
        const h = stage!.clientHeight;
        stage!.style.setProperty("--fit", Math.min(w / 960, h / 600).toFixed(4));
        stage!.style.setProperty("--fitp", Math.min(h / 640, w / 320).toFixed(4));
        stage!.style.setProperty("--fita", Math.min(w / 560, h / 640).toFixed(4));
      }
      fit();
      window.addEventListener("resize", fit);
      return function stop() {
        window.removeEventListener("resize", fit);
      };
    },
    [stageRef]
  );

  useEffect(
    function followScroll() {
      const build = buildRef.current;
      if (!build) return;
      let raf = 0;

      function tick() {
        raf = 0;
        const el = buildRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
        const seg = p * SEGMENTS;
        const beat = Math.min(SEGMENTS - 1, Math.floor(seg));
        const t = Math.min(1, seg - beat);
        const step = Math.min(4, 1 + Math.floor(t / 0.17));

        /* continuous: straight to the nodes */
        const rail = railRef.current;
        if (rail) {
          Array.from(rail.children).forEach(function group(g, gi) {
            g.querySelectorAll("i").forEach(function tickMark(mark, j) {
              const bi = gi * 3 + j;
              const f = beat > bi ? 1 : beat === bi ? Math.min(1, t / 0.8) : 0;
              (mark as HTMLElement).style.setProperty("--f", f.toFixed(3));
            });
          });
        }

        const k = `${beat}:${step}`;
        if (k === key.current) return;
        key.current = k;
        setState({ beat, step });
      }

      function onScroll() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return function stop() {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [buildRef, railRef]
  );

  /** Scroll to the first beat of service `g`. */
  const jump = useCallback(
    function jump(g: number, instant = false) {
      const build = buildRef.current;
      if (!build) return;
      const reduce =
        instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = window.scrollY + build.getBoundingClientRect().top;
      const span = build.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + span * ((g * 3 + 0.05) / SEGMENTS),
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [buildRef]
  );

  return { ...state, jump };
}

/** How many of a slot's four steps are built at this point. */
export function stepsFor(slotIndex: number, beat: number, step: number, quad: boolean) {
  if (beat === ALL_FOUR_BEAT) return quad ? 4 : 0;
  if (beat > slotIndex) return 4;
  if (beat === slotIndex) return step;
  return 0;
}
