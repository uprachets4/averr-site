import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../about/v2/useSectionProgress";

/**
 * The reference's `.rv` → `.rv.in` reveal, as state rather than a
 * class written onto the node.
 *
 * The reference adds `.in` imperatively from an IntersectionObserver,
 * which is fine when nothing re-renders. Here the letter re-renders
 * on every keystroke, and React would reconcile `className` straight
 * back to what the JSX says and drop `.in` — the letter would vanish
 * mid-sentence. So the flag is state, and the JSX owns the class.
 *
 * Under reduced motion it is revealed from the first render; the
 * stylesheet also forces `.rv` visible, so nothing waits on scroll.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(() => prefersReducedMotion());

  useEffect(function observe() {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      function onView(entries) {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Spread onto the element: `<div className={`letter ${cls}`} …>` */
  return { ref, cls: shown ? "rv in" : "rv" };
}
