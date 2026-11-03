import { memo, useEffect, useRef } from "react";
import { BUILT, screen } from "../../../data/builtByAverr";

/**
 * The wall behind the title: columns of real product screens, tilted
 * back on a 1500px perspective and drifting at seven different speeds.
 *
 * Ported from the reference's `#plane` block. Every number is its own:
 * seven columns above 900px and five below, five screens per column
 * doubled so the -50% drift loops seamlessly, a 70–109s period per
 * column, and alternate columns reversed.
 *
 * The plane flattens and pulls back as the intro scrolls, driven by one
 * custom property. `--p` is written straight to the node inside a rAF
 * and never put into React state: it changes on every scroll frame, and
 * a state write here would re-render seventy images per frame
 * (handoff 5.1).
 *
 * The drift pauses the moment the intro has fully scrolled away, so a
 * reader further down the page is not paying for seventy animated
 * elements they cannot see.
 */

/* Every screen the case files show, gallery before approach, in page
   order — the same list the reference builds, so the same screens land
   in the same columns. */
const UNIQUE = [
  ...new Set(
    BUILT.flatMap(function screensOf(p) {
      return [...p.gallery.map((g) => g.image), ...p.approach.map((a) => a.image)];
    })
  ),
];

const WIDE_COLUMNS = 7;
const NARROW_COLUMNS = 5;

function columnsFor(width: number) {
  return width < 900 ? NARROW_COLUMNS : WIDE_COLUMNS;
}

/** The reference's own stride: five per column, every third screen. */
function pickFor(column: number) {
  const out: string[] = [];
  for (let j = 0; j < 5; j++) out.push(UNIQUE[(column * 5 + j * 3) % UNIQUE.length]);
  return out;
}

function ScreenWall({ introRef }: { introRef: React.RefObject<HTMLElement | null> }) {
  const planeRef = useRef<HTMLDivElement | null>(null);

  /* Read once, on the first render: the column count is baked into the
     markup, and flipping it in an effect would build the seven-column
     wall on a phone and then throw it away. */
  const columns = useRef(
    typeof window === "undefined" ? WIDE_COLUMNS : columnsFor(window.innerWidth)
  ).current;

  useEffect(
    function trackScroll() {
      const intro = introRef.current;
      if (!intro) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let last = -1;
      let frame = 0;

      function tick() {
        frame = 0;
        const el = introRef.current;
        if (!el) return;
        const height = el.offsetHeight || 1;
        const p = Math.min(1, Math.max(0, window.scrollY / height));
        /* the reference's own threshold: below this the transform is
           indistinguishable and the write is wasted */
        if (Math.abs(p - last) > 0.002) {
          last = p;
          el.style.setProperty("--p", p.toFixed(3));
        }
        el.classList.toggle("bb-paused", p >= 1);
      }

      function onScroll() {
        if (!frame) frame = requestAnimationFrame(tick);
      }

      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      return function stop() {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
      };
    },
    [introRef]
  );

  return (
    <div className="bb-wall" aria-hidden="true">
      <div className="bb-plane" ref={planeRef}>
        {Array.from({ length: columns }, function column(_, c) {
          const pick = pickFor(c);
          /* only the middle columns are eager: the edges are mostly
             off-screen behind the veil at every width */
          const loading = c < 2 || c > columns - 3 ? "lazy" : "eager";
          return (
            <div
              className={c % 2 ? "bb-col bb-col--rev" : "bb-col"}
              key={c}
              style={{ "--d": `${70 + ((c * 17) % 40)}s` } as React.CSSProperties}
            >
              {[...pick, ...pick].map(function image(src, i) {
                return (
                  <img
                    key={`${src}-${i}`}
                    src={screen(src).small}
                    alt=""
                    decoding="async"
                    loading={loading}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="bb-veil" />
    </div>
  );
}

/* Nothing above it changes while the page is open, and a re-render
   would rebuild seventy <img> elements. */
export default memo(ScreenWall);
