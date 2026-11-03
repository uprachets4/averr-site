import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

const SEQUENCE: [string, string, string][] = [
  ["1", "Email one · introduction", "Day 1"],
  ["⏱", "Wait", "3 days"],
  ["2", "Email two · recent work", "Day 4"],
  ["☎", "Call task", "Day 7"],
];

/** Marketing 2 of 3 — campaigns and outreach. */
export default function M2Campaigns({ f }: { f: Fields }) {
  const t = f.trade;
  /* the first campaign names the trade's own first service */
  const campaigns = [
    <>Search · {t.s[0]}</>,
    <>Local Services</>,
    <>Social · before and after</>,
  ];

  return (
    <>
      <Chrome url={<>ads · {f.domain}</>} tint="#569AFA" />
      <div className="vp lt camp">
        <div className="cl">
          <h6>Campaigns</h6>
          {campaigns.map(function campaign(label, i) {
            return (
              <div className="cr" key={i}>
                <span>{label}</span>
                <span className="sw2" />
              </div>
            );
          })}
          <div className="ad r2">
            <span className="sp1">Sponsored · {f.domain}</span>
            <b>{t.head}</b>
            <span style={{ color: "var(--ink-2)" }}>{t.sub}</span>
          </div>
        </div>

        <div className="cl">
          <h6 className="r3">Outreach · {t.aud}</h6>
          <div className="seq">
            {SEQUENCE.map(function step([icon, label, when], i) {
              return (
                <div className={`sq r3 d${i + 1}`} key={label}>
                  <i>{icon}</i>
                  <span>{label}</span>
                  <em>{when}</em>
                </div>
              );
            })}
          </div>
          <div className="livebar r4">
            <span className="ok" style={{ background: "#fff", color: "#2D5FB8" }}>
              ✓
            </span>
            Campaigns and outreach live
          </div>
        </div>
      </div>
    </>
  );
}
