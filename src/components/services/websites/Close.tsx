import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { track } from "../../../lib/analytics";
import { SERVICES } from "../../../data/servicesBuild";
import { SERVICE_SLUG } from "../../../data/serviceColors";
import { WEBSITES_TIMELINE } from "../../../data/serviceWebsites";

/**
 * The close: book the call, then the other three services.
 *
 * The three links point at their deep links on /services, which is
 * where those services live today. When /services/web-apps,
 * /ai-automation and /marketing ship, these become those URLs — until
 * then they are real destinations, not placeholder anchors.
 *
 * Each of the three names a different service, so each takes its own
 * colour; the rules in `serviceColors` reserve a single service colour
 * for a surface that shows that one service.
 */
export default function Close() {
  const others = SERVICES.filter((s) => s.id !== "websites");

  return (
    <section className="wend gut" aria-labelledby="wend">
      <div className="wrap">
        <div className="box">
          <span className="eyebrow reveal">Start</span>
          <h2 id="wend" className="reveal" style={{ marginTop: 18 }}>
            Thirty minutes, and you'll know what it takes.
          </h2>
          <p>
            Tell me what you do and who it's for. You'll get a fixed scope, a fixed
            timeline and a fixed price in writing within 3 business days — and if the
            answer is that you don't need a new site, you'll hear that instead. Websites
            take {WEBSITES_TIMELINE}.
          </p>
          <div className="ctas">
            <Link
              to="/contact"
              className="pri"
              onClick={() => track("book_call_click", { from: "services_websites_close" })}
            >
              Book a free 30-minute call
            </Link>
            <Link to="/services" className="sec">
              All four services
            </Link>
          </div>
        </div>

        <div className="other">
          <span>Also built here</span>
          {others.map(function other(s) {
            return (
              <Link
                to={`/services#${SERVICE_SLUG[s.id]}`}
                key={s.id}
                style={{ "--oc": s.color } as CSSProperties}
              >
                <i aria-hidden="true" />
                {s.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
