import type { Fields } from "../../../../data/servicesBuild";
import Chrome, { Spark } from "./Chrome";

/* Illustrative shapes, the reference's own. This beat carries the
   "Illustrative" tag because of them. */
const SPARKS: [number[], string][] = [
  [[30, 44, 38, 56, 50, 64, 58, 72, 80, 92], "#D5818C"],
  [[40, 36, 52, 48, 60, 56, 70, 66, 78, 84], "#9874E8"],
  [[70, 62, 66, 54, 58, 46, 50, 40, 44, 34], "#569AFA"],
];

/** Web Apps 1 of 3 — the team dashboard. */
export default function A1Dashboard({ f }: { f: Fields }) {
  const t = f.trade;
  return (
    <>
      <Chrome url={<>app.{f.domain}</>} tint="#D5818C" />
      <div className="vp dk app">
        <div className="aside">
          <span className="alogo">
            <em />
            <span>{f.name}</span>
          </span>
          <span className="anav on">
            <i />
            Today
          </span>
          <span className="anav">
            <i />
            <span>{t.entity}</span>
          </span>
          <span className="anav">
            <i />
            Calendar
          </span>
          <span className="anav">
            <i />
            Customers
          </span>
          <span className="anav">
            <i />
            Reports
          </span>
        </div>

        <div className="amain">
          <div className="ahead r1">
            <b>Today</b>
            <span>+ New</span>
          </div>

          <div className="kpis">
            {t.k.map(function kpi(label, i) {
              return (
                <div className={i ? `kpi r2 d${i}` : "kpi r2"} key={label}>
                  <span>{label}</span>
                  <Spark heights={SPARKS[i][0]} color={SPARKS[i][1]} />
                </div>
              );
            })}
          </div>

          <div className="table r3">
            <div className="th mono" style={{ color: "var(--mute)" }}>
              <span>{t.entity}</span>
              <span>Detail</span>
              <span>Status</span>
            </div>
            {t.rows.map(function row(r, i) {
              return (
                <div className={`tr r3 d${i + 1}${i ? "" : " first"}`} key={r[0] + i}>
                  <span>{r[0]}</span>
                  <span className="dim">{r[1]}</span>
                  <span className="st">
                    <span className="a">{r[2]}</span>
                    <span className="b">{r[3]} ✓</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="note r4">
          <i />
          Synced with your calendar
        </div>
      </div>
    </>
  );
}
