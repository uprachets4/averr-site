import { NOT_DOING, splitRefusal } from "../../../data/servicesBuild";

/**
 * What we don't do — three refusals, each with a rule drawn across the
 * thing being refused.
 *
 * The struck phrase is checked to be a verbatim substring of its own
 * sentence, so the rule can never be drawn across words that are not
 * there. `splitRefusal` throws in development if one drifts and
 * degrades to no strike in production rather than rendering a lie.
 *
 * The strike is decorative: a screen reader gets the whole sentence.
 */
export default function Refusals() {
  return (
    <section className="sec gut" aria-labelledby="noh">
      <div className="wrap">
        <span className="eyebrow reveal">What we don't do</span>
        <h2 id="noh" className="reveal" style={{ marginTop: 18 }}>
          Three things you won't get from us.
        </h2>
        <div className="nos">
          {NOT_DOING.map(function refusal(r) {
            const { before, struck, after } = splitRefusal(r);
            return (
              <div className="no" key={r.text}>
                {before}
                {struck ? <s>{struck}</s> : null}
                {after}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
