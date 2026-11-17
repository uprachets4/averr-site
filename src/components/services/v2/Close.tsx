import { Link } from "react-router-dom";
import { track } from "../../../lib/analytics";

/**
 * The close — the last thing on the page, after the questions.
 *
 * The page used to end on the final answer of the FAQ and then the
 * footer, which left the visitor at the bottom with the booking pass
 * several screens behind them. This puts the call back in front of
 * them once their questions have been answered, which is the point at
 * which someone is most likely to take it.
 *
 * `book_call_click` is the same event the rest of the site fires, so
 * these bookings land in the funnel GA4 already counts rather than in
 * a new one nobody is watching.
 */
export default function Close() {
  return (
    <section className="wend gut" aria-labelledby="closeh">
      <div className="wrap">
        <div className="box">
          <span className="eyebrow reveal">Start</span>
          <h2 id="closeh" className="reveal" style={{ marginTop: 18 }}>
            Thirty minutes, and you'll know what it takes.
          </h2>
          <p>
            Tell me what you do and who it's for. You'll get a fixed scope, a fixed
            timeline and a fixed price in writing within 3 business days — and if the
            answer is that you don't need what you came here for, you'll hear that
            instead.
          </p>
          <div className="ctas">
            <Link
              to="/contact"
              className="pri"
              onClick={() => track("book_call_click", { from: "services_close" })}
            >
              Book a free 30-minute call
            </Link>
            <Link to="/work" className="sec">
              See the work first
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
