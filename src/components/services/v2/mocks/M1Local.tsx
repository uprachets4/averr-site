import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";

/** Marketing 1 of 3 — local search, on a phone. */
export default function M1Local({ f }: { f: Fields }) {
  return (
    <>
      <div className="notch" />
      <div className="serp">
        <div className="qbar">
          <i />
          <span>{f.trade.query}</span>
        </div>

        <div className="map">
          <span className="road" />
          <i className="pin" style={{ left: "22%", top: "26%" }} />
          <i className="pin" style={{ left: "68%", top: "20%" }} />
          <i className="pin" style={{ left: "80%", top: "62%" }} />
          <i className="pin me" style={{ left: "44%", top: "46%" }} />
        </div>

        <div className="res">
          {["o1", "o2", "o3"].map(function other(cls, i) {
            return (
              <div className={`ri ${cls}`} key={cls} style={{ "--i": i } as CSSProperties}>
                <span className="sk w1" />
                <span className="sk w2" />
              </div>
            );
          })}
          <div className="ri me" style={{ "--i": 3 } as CSSProperties}>
            <b>{f.name}</b>
            <span className="stars">
              <i />
              <i />
              <i />
              <i />
              <i />
              <em>Open now · {f.trade.area}</em>
            </span>
          </div>
        </div>

        <div className="callbar">
          <i />
          Calling {f.name}
        </div>
      </div>
    </>
  );
}
