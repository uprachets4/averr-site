import { Link } from "react-router-dom";
import { WEBSITES_PROOF } from "../../../data/serviceWebsites";

/**
 * The websites we have shipped — the case files whose own `svc` array
 * says Websites was delivered, filtered rather than listed, so a
 * renamed or removed project cannot leave a dead card behind.
 *
 * The whole card is the link, not a "read more" at the bottom: the
 * owner has tapped a project's name and its screen and had nothing
 * happen (playbook 05, pitfall 10). The figure is the case file's own
 * `figure`, which some projects do not have; those render the outcome
 * headline instead of a fabricated number.
 */
export default function Proof() {
  return (
    <section className="sec gut" aria-labelledby="wproof" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">Proof</span>
        <h2 id="wproof" className="reveal" style={{ marginTop: 18 }}>
          Sites we built, and what they did.
        </h2>

        <div className="wproof">
          {WEBSITES_PROOF.map(function card(p) {
            return (
              <Link className="wcase" to={`/work/${p.slug}`} key={p.slug}>
                <span className="top">
                  <i aria-hidden="true" />
                  {p.sector}
                  <span aria-hidden="true">·</span>
                  {p.year}
                </span>

                <h3>{p.name}</h3>
                <p className="thesis">{p.thesis}</p>

                <span className="fig">
                  {p.figure ? (
                    <>
                      <b>{p.figure.value}</b>
                      <span>{p.figure.caption}</span>
                    </>
                  ) : (
                    <span>{p.outcome.headline}</span>
                  )}
                </span>

                <span className="go">
                  Read the case file
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
