import { INCLUDED } from "../../../data/servicesBuild";

/**
 * What you get — five things true whichever of the four services the
 * visitor starts with. This sits where "What we don't do" used to.
 *
 * A list on one rule, not a card grid: the first line is the one people
 * read, and the rest step down from it. The pinned stage above is dense
 * and interactive, so this section is deliberately the quiet one — it
 * is where the page stops demonstrating and states its terms.
 *
 * The accent is the gradient, not a service colour: every line here is
 * true of all four services, and painting the dots one service's colour
 * would say the opposite.
 */
export default function Included() {
  return (
    <section className="sec gut" aria-labelledby="inch">
      <div className="wrap">
        <span className="eyebrow reveal">What you get</span>
        <h2 id="inch" className="reveal" style={{ marginTop: 18 }}>
          Five things, whichever service you start with.
        </h2>

        <div className="inc">
          {INCLUDED.map(function row(s) {
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
