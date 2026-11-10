import type { CSSProperties } from "react";
import type { Fields } from "../../../../data/servicesBuild";

/** AI Automation 3 of 3 — the human review queue. */
export default function I3Review({ f }: { f: Fields }) {
  const t = f.trade;
  /* the customer's own message first, then three of the dashboard rows */
  const queue: [string, string][] = [
    [t.cust, t.msg],
    ...t.rows.slice(1, 4).map((r) => [r[0], r[1]] as [string, string]),
  ];

  return (
    <>
      <div className="chrome">
        <i />
        <i />
        <i />
        <span className="url">
          <em style={{ "--uc": "#9874E8" } as CSSProperties} />
          <span>Review queue · {f.name}</span>
        </span>
      </div>

      <div className="vp inbox">
        <div className="ilist">
          <div className="ih mono">
            <span>Waiting for you</span>
            <span>4</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {queue.map(function item([who, line], i) {
              return (
                <div className={`ii r1 d${i + 1}${i ? "" : " sel"}`} key={who + i}>
                  <b>{who}</b>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="iread">
          <span className="mono" style={{ color: "var(--mute)" }}>
            Drafted by AI · {t.kind} request
          </span>
          <h6 className="r2">Reply to {t.cust}</h6>

          <div className="dbody r2">
            <span>{t.draft}</span>
            <span className="ins">{t.ins}</span>
          </div>

          <span className="ed mono r3">✎ Edited by you</span>

          <div className="iact r2">
            <span className="snd">Approve and send</span>
            <span>Request changes</span>
            <span
              className="mono r4"
              style={{ color: "var(--ai)", border: 0, padding: 0 }}
            >
              Sent · approved by you
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
