import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

const STATES = ["Done", "Done", "In progress", "Next", "Last step"];

/**
 * Web Apps 2 of 3 — the customer portal.
 *
 * The timeline advances with the beat's step, which the reference does
 * by counting the slot's own `s1..s4` classes in `updatePortal()`. Here
 * the count arrives as a prop, which is the same number without reading
 * it back out of the DOM.
 */
export default function A2Portal({ f, steps }: { f: Fields; steps: number }) {
  const t = f.trade;
  const reached = Math.min(4, 1 + steps);

  return (
    <>
      <Chrome url={<>my.{f.domain}</>} tint="#D5818C" />
      <div className="vp lt portal">
        <div className="phead r1">
          <span>
            <span className="mono mt">{f.name}</span>
            <br />
            <b>
              Hi {t.cust}, here's your {f.projl}.
            </b>
          </span>
          <span className="mono mt">Customer portal</span>
        </div>

        <div className="tl">
          {t.pst.map(function stage(label, i) {
            const done = i < reached;
            return (
              <div
                className={`x${done ? " done" : ""}${i === reached ? " now" : ""}`}
                key={label}
              >
                <i>{done ? "✓" : ""}</i>
                <span>
                  <b>{label}</b>
                  <span>{STATES[i]}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="pside">
          <div className="pcard r2">
            <span className="who">Latest update</span>
            <span>{f.pupd}</span>
          </div>
          <div className="pcard r3">
            <span className="who">Photos and files</span>
            <div className="files">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="pcard r4">
            <span className="who">Next visit</span>
            <b>{f.pnext}</b>
          </div>
        </div>
      </div>
    </>
  );
}
