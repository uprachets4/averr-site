import { useCallback, useEffect, useRef, useState } from "react";
import { screen } from "../../../data/builtByAverr";

/**
 * Inside the build — the screens, in the reference's bento, each one
 * opening full size in a lightbox.
 *
 * The patterns are the reference's two: four screens run big / 2 / 2 /
 * wide, eight run big / 2 / 2 / 3 / 3 / 2 / 2 / 2, and any other count
 * falls back to a plain two-column run. `w2` carries no rule in the
 * reference — it is the default span — so here it is simply no class.
 *
 * The lightbox traps the tab ring while it is open, closes on click or
 * Escape, and hands focus back to the thumbnail that opened it.
 */

const PATTERNS: Record<number, string[]> = {
  4: ["big", "w2", "w2", "w6"],
  8: ["big", "w2", "w2", "w3", "w3", "w2", "w2", "w2"],
};

function spanClass(count: number, i: number) {
  const pattern = PATTERNS[count];
  const key = pattern ? pattern[i] : "w2";
  return key === "w2" ? "" : ` bb-${key}`;
}

export default function Gallery({
  items,
  name,
}: {
  items: { image: string; caption: string }[];
  name: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(function close() {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(
    function lightboxKeys() {
      if (open === null) return;
      lightboxRef.current?.focus({ preventScroll: true });

      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
          return;
        }
        /* one focusable thing is open, so the ring stays on it */
        if (e.key === "Tab") e.preventDefault();
      }
      document.addEventListener("keydown", onKey, true);
      return function stop() {
        document.removeEventListener("keydown", onKey, true);
      };
    },
    [open, close]
  );

  const shown = open === null ? null : items[open];

  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label bb-reveal">
          <h2 className="bb-eyebrow">Inside the build</h2>
          <span className="bb-n">{items.length} screens</span>
        </div>
        <div className="bb-gallery">
          {items.map(function thumb(g, i) {
            return (
              <button
                className={`bb-g bb-reveal${spanClass(items.length, i)}`}
                type="button"
                key={g.image}
                aria-label={`Open screen: ${g.caption}`}
                onClick={function openIt(e) {
                  openerRef.current = e.currentTarget;
                  setOpen(i);
                }}
              >
                <img
                  src={screen(g.image).small}
                  alt={`${name}: ${g.caption}`}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{g.caption}</figcaption>
              </button>
            );
          })}
        </div>
      </div>

      {shown ? (
        <div
          className="bb-lb"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={shown.caption}
          tabIndex={-1}
          onClick={close}
        >
          <img src={screen(shown.image).large} alt={`${name}: ${shown.caption}`} />
          <span>{shown.caption}</span>
        </div>
      ) : null}
    </section>
  );
}
