import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

const NAV = ["Colour", "Type", "Spacing", "Buttons", "Inputs", "Tokens"];
const TOKENS: [string, string][] = [
  ["#F9AF97", "accent"],
  ["#D5818C", "accent-2"],
  ["#0F1117", "ink"],
  ["#EFEEF5", "surface"],
];

/** Web Apps 3 of 3 — the design system, light flipping to dark. */
export default function A3System({ f }: { f: Fields }) {
  return (
    <>
      <Chrome url={<>{f.domain} · design system</>} tint="#D5818C" />
      <div className="vp lt ds">
        <div className="dsnav">
          <b>{f.name}</b>
          {NAV.map(function item(n) {
            return <span key={n}>{n}</span>;
          })}
        </div>

        <div className="dsmain">
          <div className="dsrow r1">
            <span className="mono mt">Buttons · default, secondary, ghost, disabled</span>
            <div className="btns">
              <span className="p">{f.trade.cta}</span>
              <span className="s">Learn more</span>
              <span className="g">Cancel</span>
              <span className="x">Unavailable</span>
            </div>
          </div>

          <div className="dsrow r2">
            <span className="mono mt">Inputs · empty, focus, error</span>
            <div className="inputs">
              <span>Your name</span>
              <span className="f">Postal code</span>
              <span className="e">Enter a full postal code</span>
            </div>
          </div>

          <div className="dsrow r3">
            <span className="mono mt">Tokens</span>
            <div className="tokens">
              {TOKENS.map(function token([hex, label]) {
                return (
                  <div key={label} style={{ "--t": hex } as CSSProperties}>
                    <i />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="toggle r4">
            <b />
            Dark mode, same components
          </div>
        </div>
      </div>
    </>
  );
}
