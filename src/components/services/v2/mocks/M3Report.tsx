import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

/* Illustrative proportions, the reference's own. */
const SOURCES: [string, string, number][] = [
  ["Local search", "#569AFA", 0.92],
  ["Outreach", "#9874E8", 0.64],
  ["Paid ads", "#D5818C", 0.48],
  ["Referrals", "#F9AF97", 0.3],
];

/** Marketing 3 of 3 — the monthly report. */
export default function M3Report({ f }: { f: Fields }) {
  return (
    <>
      <Chrome url={<>report · {f.domain}</>} tint="#569AFA" />
      <div className="vp lt rep">
        <header className="r1">
          <b>Monthly report</b>
          <span className="mono mt">{f.name}</span>
        </header>

        <div className="bars r1">
          <span className="mono mt">Where new enquiries came from</span>
          {SOURCES.map(function bar([label, color, width]) {
            return (
              <div className="brow" key={label}>
                <b style={{ fontWeight: 500 }}>{label}</b>
                <span style={{ "--bc": color, "--w": width } as CSSProperties} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="worked r3">
            <b>What worked</b>
            <span>
              Most new enquiries came from local search this month. We'll put more
              behind it next month.
            </span>
          </div>
          <div className="sent r4">
            <span className="ok">✓</span>
            Sent to {f.name}
          </div>
        </div>
      </div>
    </>
  );
}
