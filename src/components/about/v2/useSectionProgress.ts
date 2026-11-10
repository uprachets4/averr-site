import { useEffect, useRef } from "react";

/**
 * One rAF-throttled scroll loop for the whole About page.
 *
 * Three pinned sections each need their own 0–1 progress every frame.
 * Three listeners would mean three rAFs competing for the same frame;
 * this registers one listener and one rAF, and hands every registered
 * section its progress in a single pass.
 *
 * Progress is pushed to a callback that writes straight to the DOM —
 * never to React state. These values change on every scroll frame, and
 * a state write would re-render the page sixty times a second
 * (handoff 5.1).
 */

export type Section = {
  /**
   * A ref holding the tall element whose scroll span drives the pin.
   *
   * The REF, not the element: a section registers during the render
   * that creates it, and refs are only attached afterwards, so a
   * caller passing `ref.current` would register a null that nothing
   * ever replaces and the section would never receive a frame. The
   * loop reads `.current` fresh on every tick instead.
   */
  ref: { current: HTMLElement | null };
  /** Called with 0–1 progress through that span, every frame it moves. */
  onProgress: (p: number) => void;
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** The reference's easeInOutQuad, used for the mark pan and the portrait. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export function useSectionProgress(sections: Section[]) {
  /* Kept in a ref so adding a section never restarts the loop. */
  const live = useRef(sections);
  live.current = sections;

  useEffect(function oneLoop() {
    let raf = 0;

    function tick() {
      raf = 0;
      const vh = window.innerHeight;
      for (const s of live.current) {
        const el = s.ref.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const span = r.height - vh;
        /* A section shorter than the viewport has no scroll span of
           its own; treat it as fully progressed rather than dividing
           by zero. */
        s.onProgress(span <= 0 ? 1 : clamp(-r.top / span));
      }
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
  }, []);
}

/** True on a pointer device wide enough to pin. The page checks this in
 *  several places and they must agree. */
export function isDesktop() {
  return window.innerWidth > 900;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
