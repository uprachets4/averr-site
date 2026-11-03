import type { Fields } from "../../../../data/servicesBuild";

/**
 * AI Automation 2 of 3 — the enquiry agent.
 *
 * Four nodes and three wires light in order. The reference drives them
 * from the scroll loop with `an`: node i is lit at `an >= i+1` and done
 * at `an > i+1`, and wire i lights at `an >= i+2`. That arithmetic
 * arrives here as one number rather than being written onto the DOM.
 */
export default function I2Agent({ f, an }: { f: Fields; an: number }) {
  const t = f.trade;
  const node = (i: number) =>
    `node n${i + 1}${an >= i + 1 ? " lit" : ""}${an > i + 1 ? " done" : ""}`;
  const wire = (i: number) => `wire${an >= i + 2 ? " lit" : ""}`;

  return (
    <div className="vp canvas" style={{ inset: 0 }}>
      <div className="flowhead mono">
        <span>
          Enquiry intake · <b>AI Automation</b>
        </span>
        <span>Runs on every message</span>
      </div>

      <div className="flow">
        <div className={node(0)}>
          <div className="nh mono">
            <i>✉</i>Inbox
          </div>
          <span className="nt">A new message</span>
          <div className="msg r1">
            <span className="who mono">Customer</span>
            <span>{t.msg}</span>
          </div>
          <span className="mono r4" style={{ marginTop: "auto", color: "var(--ai)" }}>
            Reply sent ✓
          </span>
        </div>

        <div className={wire(0)}>
          <i />
        </div>

        <div className={node(1)}>
          <div className="nh mono">
            <i>✦</i>AI agent
          </div>
          <span className="nt">Drafts the reply</span>
          <div className="typing">
            <i />
            <i />
            <i />
          </div>
          <div className="msg me r2">
            <span className="who mono">Draft</span>
            <span>{t.draft}</span>
          </div>
        </div>

        <div className={wire(1)}>
          <i />
        </div>

        <div className={node(2)}>
          <div className="nh mono">
            <i>✓</i>You approve
          </div>
          <span className="nt">Nothing goes out unchecked</span>
          <div className="appr">
            <span style={{ fontSize: 13, color: "var(--mute)" }}>
              One tap to send, or edit first.
            </span>
            <div className="abtn">
              <span className="a1">Approve and send</span>
              <span className="a2">Approved ✓</span>
            </div>
          </div>
        </div>

        <div className={wire(2)}>
          <i />
        </div>

        <div className={node(3)}>
          <div className="nh mono">
            <i>▤</i>CRM and calendar
          </div>
          <span className="nt">Logged and booked</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="dcard r4">
              <b className="mono">CRM</b>
              <span>{t.crm}</span>
            </div>
            <div className="dcard r4 d2">
              <b className="mono">Calendar</b>
              <span>{t.cal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flowfoot">
        <i />
        AI drafts, your team approves, and every enquiry lands where it belongs.
      </div>
    </div>
  );
}
