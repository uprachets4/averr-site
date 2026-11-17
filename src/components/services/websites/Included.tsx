import { WEBSITES_INCLUDED } from "../../../data/serviceWebsites";

/**
 * What a website build includes — the Design pillar's own five records,
 * read from `servicePillars` rather than restated, so this page and
 * /services can never describe a different offer.
 *
 * A list on one rule, not a card grid: the first line is the one people
 * read, and the rest step down from it. Equal-weight cards were the
 * template look the owner rejected.
 */
export default function Included() {
  return (
    <section className="sec gut" aria-labelledby="wincl">
      <div className="wrap">
        <span className="eyebrow reveal">What you get</span>
        <h2 id="wincl" className="reveal" style={{ marginTop: 18 }}>
          Five things, in every website we build.
        </h2>

        <div className="inc">
          {WEBSITES_INCLUDED.map(function row(s) {
            return (
              <div className="incrow" key={s.name}>
                <i aria-hidden="true" />
                <b>{s.name}</b>
                <p>{s.outcome}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
