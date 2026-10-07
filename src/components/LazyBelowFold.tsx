import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defer a below-the-fold section's code until the reader is near it.
 *
 * /services is a lazy route, so its LCP element — the hero subhead —
 * cannot paint until the whole route chunk has downloaded and executed.
 * Every session added to that chunk and the number crept toward the
 * 2.5s budget. Splitting the sections the hero does not need takes them
 * off that path entirely.
 *
 * The observer fires ONE VIEWPORT EARLY, so the import resolves while
 * the section is still off screen and the swap is never seen. The
 * placeholder holds the section's real height in the section's own
 * ground colour, so even a mistimed swap cannot shift anything that is
 * on screen.
 *
 * Without IntersectionObserver (or with it unsupported) the section
 * loads immediately rather than never.
 */
export default function LazyBelowFold({
  load,
  minHeight,
  background,
  children,
}: {
  /** The dynamic import. Called at most once. */
  load: () => Promise<unknown>;
  /** Reserved height while the chunk is in flight. */
  minHeight: string;
  /** The section's own ground, so the reserve is invisible. */
  background: string;
  /** Rendered once `load` has resolved. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(
    function watch() {
      let dead = false;
      function go() {
        load()
          .then(() => {
            if (!dead) setReady(true);
          })
          .catch(() => {
            // a failed chunk should still render rather than leave a hole
            if (!dead) setReady(true);
          });
      }
      if (typeof IntersectionObserver === "undefined" || !ref.current) {
        go();
        return function noop() {
          dead = true;
        };
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            go();
          }
        },
        { rootMargin: "100% 0px" }
      );
      io.observe(ref.current);
      return function off() {
        dead = true;
        io.disconnect();
      };
    },
    [load]
  );

  if (ready) return <>{children}</>;
  return <div ref={ref} aria-hidden style={{ minHeight, background }} />;
}
