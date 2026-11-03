/**
 * 01 — the problem: one line that lights up word by word as it is
 * read, and three pointers under it.
 *
 * The words are plain spans; which of them are lit is decided by the
 * page's scroll loop in `CaseStudy.tsx`, which owns the only rAF on
 * the route. Splitting on whitespace with a capturing group keeps the
 * gaps, so the line's own spacing is untouched.
 */
export default function Problem({
  problem,
  points,
  number,
}: {
  problem: string;
  points: readonly string[];
  number: string;
}) {
  const tokens = problem.split(/(\s+)/);

  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label">
          <h2 className="bb-eyebrow">The problem</h2>
          <span className="bb-n">{number}</span>
        </div>
        <p className="bb-prob">
          {tokens.map(function token(t, i) {
            if (/^\s+$/.test(t) || !t) return t;
            return (
              <span className="bb-w" key={i}>
                {t}
              </span>
            );
          })}
        </p>
        <div className="bb-ptrs">
          {points.map(function point(t) {
            return (
              <div className="bb-ptr bb-reveal" key={t}>
                <i />
                <span>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
