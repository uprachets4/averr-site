/**
 * 06 — what's next, and what it was built with.
 *
 * Hidden entirely when a project has neither, which is Express
 * Contractors: a finished site with no roadmap published and no stack
 * listed. The page simply goes from the outcome to the next case file.
 */
export default function NextUp({
  next,
  stack,
  number,
}: {
  next: string[];
  stack: string[];
  number: string;
}) {
  if (!next.length && !stack.length) return null;

  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label bb-reveal">
          <h2 className="bb-eyebrow">What's next</h2>
          <span className="bb-n">{number}</span>
        </div>

        {next.length ? (
          <div className="bb-nextup bb-reveal">
            <h3>The next chapter.</h3>
            <ul>
              {next.map(function item(t) {
                return <li key={t}>{t}</li>;
              })}
            </ul>
          </div>
        ) : null}

        {stack.length ? (
          <div className="bb-stack bb-reveal">
            <b>Built with</b>
            {stack.map(function tool(s) {
              return <span key={s}>{s}</span>;
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
