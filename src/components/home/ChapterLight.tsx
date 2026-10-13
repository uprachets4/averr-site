import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { LIGHTS, blend } from "./lightPlan";

/**
 * The one light in the room.
 *
 * A single fixed layer behind everything. As the reader scrolls, it reads
 * which two chapters they are between and interpolates the colour,
 * intensity and position across them — so the page's colour FLOWS rather
 * than cutting at a boundary, which is the whole point of retiring the
 * cream/ink chapter grounds.
 *
 * Written straight to the node on a rAF-throttled scroll listener: this
 * is one gradient string per frame, and handing a scroll-linked
 * `background` to motion would put it on the accelerated path for no
 * benefit.
 *
 * Under reduced motion it still colours each chapter — it simply snaps to
 * the nearest chapter's light instead of interpolating.
 */
export default function ChapterLightLayer() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  useEffect(
    function track() {
      function read() {
        raf.current = 0;
        const el = ref.current;
        if (!el) return;
        const mid = window.innerHeight * 0.45;

        /* where each chapter's centre sits relative to the reader */
        let i = 0;
        for (let n = 0; n < LIGHTS.length; n++) {
          const sec = document.getElementById(LIGHTS[n].id);
          if (!sec) continue;
          const r = sec.getBoundingClientRect();
          if (r.top <= mid) i = n;
        }
        const here = document.getElementById(LIGHTS[i].id);
        const next = LIGHTS[i + 1] ? document.getElementById(LIGHTS[i + 1].id) : null;

        let t = 0;
        if (here && next) {
          const a = here.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          const span = b.top - a.top;
          /* the next chapter's light starts arriving a third of the way
             through the current one, so colour leads content */
          if (span > 0) t = Math.min(1, Math.max(0, (mid - a.top) / span - 0.34) / 0.66);
        }

        const out = reduce
          ? blend(LIGHTS[i], LIGHTS[i], 0)
          : blend(LIGHTS[i], LIGHTS[Math.min(LIGHTS.length - 1, i + 1)], t);
        el.style.background = out.horizonCss;
        el.style.setProperty("--cl-rgb", out.rgb.join(","));
        el.style.setProperty("--cl-beam", out.alpha.toFixed(3));
        /* vw/vh, not %, because the beams are MOVED BY TRANSFORM.
           Writing left/top every frame is a layout change, and the
           browser scores it as a layout shift: these two spans alone
           took the crash-scroll CLS to 6.64 against a 0.1 budget. */
        el.style.setProperty("--cl-x", out.x.toFixed(1) + "vw");
        el.style.setProperty("--cl-y", out.y.toFixed(1) + "vh");
        /* published so anything else can read where the room's light is.
           Session 26: FOREGROUND accents no longer consume this — they
           use the one accent set — but the chapter hue still drives the
           light itself. */
        const root = document.documentElement;
        root.style.setProperty("--chapter-rgb", out.rgb.join(","));
      }

      function onScroll() {
        if (raf.current) return;
        raf.current = requestAnimationFrame(read);
      }
      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return function off() {
        cancelAnimationFrame(raf.current);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [reduce]
  );

  return (
    <div ref={ref} className="clight" aria-hidden>
      <span className="clight__beam clight__beam--a" />
      <span className="clight__beam clight__beam--b" />
    </div>
  );
}
