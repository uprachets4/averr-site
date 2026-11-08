import { BRIEF_SERVICES } from "../../../data/contactBrief";
import type { BriefState } from "./briefState";

/**
 * Part 01: the four service tiles, the "which parts?" chips that
 * open under them, and the "Not sure yet" escape.
 *
 * The chips reveal with the reference's `grid-template-rows: 0fr ->
 * 1fr`, and the state class is `.show`. It is NOT `.open`: `.open`
 * is the opening section's own class, and the reference itself hit
 * that and opened a 900px gap.
 */

export default function ServiceTiles({
  state,
  toggleService,
  toggleSub,
  toggleUnsure,
  firstTileRef,
}: {
  state: BriefState;
  toggleService: (key: string) => void;
  toggleSub: (key: string, sub: string) => void;
  toggleUnsure: () => void;
  firstTileRef: (el: HTMLButtonElement | null) => void;
}) {
  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));

  return (
    <>
      <div className="tiles" role="group" aria-label="Services">
        {BRIEF_SERVICES.map(function tile(s, i) {
          const on = state.services.includes(s.key);
          return (
            <button
              type="button"
              className="tile"
              key={s.key}
              style={{ "--sc": s.color } as React.CSSProperties}
              aria-pressed={on}
              aria-controls="ct-subs"
              onClick={() => toggleService(s.key)}
              ref={i === 0 ? firstTileRef : undefined}
            >
              <span className="top">
                <span className="dot" />
                <span className="chk" aria-hidden="true">
                  ✓
                </span>
              </span>
              <b>{s.name}</b>
              <span className="d">{s.description}</span>
            </button>
          );
        })}
      </div>

      <div className={`subs${chosen.length ? " show" : ""}`} id="ct-subs">
        <div>
          {chosen.map(function group(s) {
            const picked = state.subs[s.key] ?? [];
            return (
              <div
                className="subgrp"
                key={s.key}
                style={{ "--sc": s.color } as React.CSSProperties}
              >
                <div className="sh">{s.name} · which parts?</div>
                <div className="chips" role="group" aria-label={`${s.name}: which parts`}>
                  {s.subs.map(function chip(x) {
                    return (
                      <button
                        type="button"
                        className="chip"
                        key={x}
                        aria-pressed={picked.includes(x)}
                        onClick={() => toggleSub(s.key, x)}
                      >
                        {x}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="unsure"
        aria-pressed={state.unsure}
        onClick={toggleUnsure}
      >
        <i>✓</i>Not sure yet. Let's work it out on a call.
      </button>
    </>
  );
}
