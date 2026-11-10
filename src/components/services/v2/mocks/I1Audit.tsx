import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["9", "10", "11", "1", "2", "3"];

/**
 * AI Automation 1 of 3 — the workflow audit.
 *
 * The week grid is deterministic, not random: the reference derives
 * each cell from its own index, so the same week is drawn every time
 * and on every machine. Kept exactly, arithmetic included.
 */
function cellClass(r: number, c: number) {
  const v = ((r * 5 + c) * 7) % 11;
  const w = v < 8;
  const m = w && v % 3 === 0;
  const a = (m && (r + c) % 2 === 0) || (w && v === 7);
  return `cell${w ? " w" : ""}${m ? " m" : ""}${a ? " a" : ""}`;
}

export default function I1Audit({ f }: { f: Fields }) {
  return (
    <>
      <div className="chrome">
        <i />
        <i />
        <i />
        <span className="url">
          <em style={{ "--uc": "#9874E8" } as CSSProperties} />
          <span>Workflow audit · {f.name}</span>
        </span>
      </div>

      <div className="vp audit">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="mono" style={{ color: "var(--mute)" }}>
            Where the week goes
          </span>

          <div className="week">
            <span />
            {DAYS.map(function head(d) {
              return (
                <span className="dh" key={d}>
                  {d}
                </span>
              );
            })}
            {HOURS.map(function row(hour, r) {
              return (
                <Row key={hour} hour={hour} r={r} />
              );
            })}
          </div>

          <div className="legend">
            <span style={{ "--l": "rgba(86,154,250,.6)" } as CSSProperties}>
              <i />
              Client work
            </span>
            <span style={{ "--l": "rgba(213,129,140,.7)" } as CSSProperties}>
              <i />
              Admin
            </span>
            <span style={{ "--l": "#9874E8" } as CSSProperties}>
              <i />
              Can be automated
            </span>
          </div>
        </div>

        <div className="aud">
          <h6 className="r3">What can come off your plate</h6>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {f.trade.tasks.map(function task(x, i) {
              return (
                <div className={`it r3 d${i + 1}`} key={x}>
                  <span>{x}</span>
                  <em>Automate</em>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* A fragment per row keeps the grid flat, which is what the CSS grid
   expects — the reference emits one long run of spans. */
function Row({ hour, r }: { hour: string; r: number }) {
  return (
    <>
      <span className="hl">{hour}</span>
      {[0, 1, 2, 3, 4].map(function cell(c) {
        return (
          <span
            className={cellClass(r, c)}
            key={c}
            style={{ transitionDelay: `${(r * 5 + c) * 0.018}s` }}
          />
        );
      })}
    </>
  );
}
