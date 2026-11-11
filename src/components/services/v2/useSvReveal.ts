import { useEffect, type RefObject } from "react";

/**
 * The reference's `.reveal` → `.reveal.in`, added from an
 * IntersectionObserver. The stylesheet hides every `.sv .reveal` until it
 * has `.in`, so without this the start pass, refusals and questions
 * headings never appear. The class names in the JSX are static strings,
 * so React never reconciles `.in` away.
 */
export function useSvReveal(root: RefObject<HTMLElement | null>) {
  useEffect(function observe() {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (!items.length) return;
    const io = new IntersectionObserver(
      function onView(entries) {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 }
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}
