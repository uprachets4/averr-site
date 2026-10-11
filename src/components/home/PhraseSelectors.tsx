import { useRef } from "react";
import { PHRASES } from "./heroPhrases";

/**
 * The hero's three outcomes, as controls.
 *
 * Toggle buttons with `aria-pressed`, not a tablist: a tablist promises
 * tab panels, and the scene these switch is decorative and aria-hidden.
 * A screen reader hears "Design, pressed" — true — rather than being sent
 * looking for a panel that does not exist.
 *
 * ← and → move between them while the row has focus, which is where arrow
 * keys belong. Bound to the row rather than the window so they cannot take
 * the arrow keys away from the rest of the page.
 */
export default function PhraseSelectors({
  index,
  onChoose,
}: {
  index: number;
  onChoose: (i: number) => void;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  function focusAt(i: number) {
    const row = rowRef.current;
    if (!row) return;
    const btn = row.querySelectorAll<HTMLButtonElement>("button")[i];
    btn?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    if (!back && !fwd) return;
    e.preventDefault();
    const n = PHRASES.length;
    const i = ((index + (fwd ? 1 : -1)) % n + n) % n;
    onChoose(i);
    focusAt(i);
  }

  return (
    <div
      ref={rowRef}
      className="pz"
      role="group"
      aria-label="What you want for your business"
      onKeyDown={onKeyDown}
    >
      {PHRASES.map(function one(p, i) {
        const on = i === index;
        return (
          <button
            key={p.pillar}
            type="button"
            className={on ? "pz-btn pz-btn--on" : "pz-btn"}
            aria-pressed={on}
            onClick={function pick() {
              onChoose(i);
            }}
          >
            <span className="pz-dot" aria-hidden="true" />
            {p.label}
          </button>
        );
      })}

      <style>{`
        .pz { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
        .pz-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px 9px 13px;
          border: 1px solid rgba(20,20,18,0.16);
          border-radius: 999px;
          background: transparent;
          color: var(--color-muted);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .pz-btn:hover { color: var(--color-ink); border-color: rgba(20,20,18,0.34); }
        .pz-btn--on {
          color: var(--color-parch);
          background: var(--color-dark);
          border-color: var(--color-dark);
        }
        .pz-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor; opacity: 0.45;
          transition: opacity 0.2s ease;
        }
        .pz-btn--on .pz-dot { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .pz-btn, .pz-dot { transition: none; }
        }
      `}</style>
    </div>
  );
}
