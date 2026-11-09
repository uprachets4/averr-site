import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

/** The five swatches on the brand board. Illustrative palette, the
 *  reference's own values. */
const SWATCHES: [string, string][] = [
  ["#0F1117", "Ink"],
  ["#F9AF97", "Peach"],
  ["#D5818C", "Rose"],
  ["#EFEEF5", "Mist"],
  ["#6E6E80", "Slate"],
];

/** Websites 1 of 3 — brand and design direction. */
export default function W1Brand({ f }: { f: Fields }) {
  return (
    <>
      <Chrome url={<>{f.domain} · brand</>} tint="#F9AF97" />
      <div
        className="vp lt brand"
        style={{ "--p1": "#F9AF97", "--p2": "#D5818C" } as CSSProperties}
      >
        <header className="r1">
          <span className="bmark">
            <em />
            <span>{f.name}</span>
          </span>
          <span className="mono mt">Brand board</span>
        </header>

        <div>
          <div className="sw">
            {SWATCHES.map(function swatch([hex, label], i) {
              return (
                <div
                  className={`r1 d${i + 1}`}
                  key={hex}
                  style={{ "--s": hex } as CSSProperties}
                >
                  <i />
                  <b>{label}</b>
                  <span className="mono mt">{hex}</span>
                </div>
              );
            })}
          </div>
          <div className="spec r2">
            <span className="aa">Aa</span>
            <span className="lines">
              <b>Geist, 600 and 400</b>
              <span>{f.trade.head}</span>
              <span className="mono mt">48 · 32 · 20 · 16 · 12</span>
            </span>
          </div>
        </div>

        <div className="lock">
          <div className="big r3">
            <span className="bmark">
              <em />
              <span>{f.name}</span>
            </span>
            <span className="mono" style={{ color: "rgba(255,255,255,.6)" }}>
              {f.trade.area}
            </span>
          </div>
          <div className="row r3 d2">
            <div>{f.initial}</div>
            <div>
              <span>{f.short}</span>
            </div>
          </div>
        </div>

        {/* #C2604F measured 4.13:1 on the white plate — an AA failure on
            11px text, and the border takes its colour from here too.
            #BF5745 is the same hue (8.85deg vs 8.87) and saturation,
            darkened just far enough to reach 4.50:1. */}
        <span
          className="stamp r4"
          style={{ position: "absolute", right: 30, bottom: 26, color: "#BF5745" }}
        >
          Approved
        </span>
      </div>
    </>
  );
}
