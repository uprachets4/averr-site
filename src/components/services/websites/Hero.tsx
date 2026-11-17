import { Link } from "react-router-dom";
import { track } from "../../../lib/analytics";
import { WEBSITES_HERO, WEBSITES_TIMELINE } from "../../../data/serviceWebsites";

/**
 * The hero. The headline carries the page's one search ("web design
 * Toronto") and ends in the home page's locked phrase, so the service
 * page sounds like the site rather than like a landing page.
 *
 * Two calls to action, as every page on the site has: the
 * high-commitment one first, then the low-commitment one. The primary
 * fires `book_call_click`, the event GA4 already counts everywhere
 * else, so this page's bookings land in the same funnel.
 *
 * The three facts sit on a rule rather than in boxes — the timeline is
 * read from the pillar data, never typed here.
 */
const FACTS: [string, string][] = [
  ["Timeline", WEBSITES_TIMELINE],
  ["Pages", "Up to 15"],
  ["After launch", "30 days of adjustment"],
];

export default function Hero() {
  return (
    <section className="whero gut" aria-labelledby="wh1">
      <div className="beams" aria-hidden="true">
        <i className="beam" />
        <i className="beam" />
        <i className="beam" />
        <i className="beam" />
      </div>

      <div className="wrap">
        <span className="eyebrow">{WEBSITES_HERO.eyebrow}</span>

        <h1 id="wh1">
          {WEBSITES_HERO.head} <span className="gt">{WEBSITES_HERO.headEmphasis}</span>
        </h1>

        <p className="sub">{WEBSITES_HERO.sub}</p>

        <div className="ctas">
          <Link
            to="/contact"
            className="pri"
            onClick={() => track("book_call_click", { from: "services_websites_hero" })}
          >
            Book a free 30-minute call
          </Link>
          <Link to="/work" className="sec">
            See websites we've built
          </Link>
        </div>

        <div className="facts">
          {FACTS.map(function fact([label, value]) {
            return (
              <div className="fact" key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
