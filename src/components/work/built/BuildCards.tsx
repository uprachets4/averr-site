/**
 * 03 — what we built: the full inventory as compact cards.
 *
 * The body text is `rgba(245,244,249,.78)` on the card surface, which
 * the spec sets as the floor for this text and the stylesheet carries.
 */
export default function BuildCards({
  items,
  number,
}: {
  items: { title: string; text: string }[];
  number: string;
}) {
  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label bb-reveal">
          <h2 className="bb-eyebrow">What we built</h2>
          <span className="bb-n">{number}</span>
        </div>
        <div className="bb-ledger">
          {items.map(function card(it) {
            return (
              <div className="bb-li bb-reveal" key={it.title}>
                <h3>
                  <i />
                  {it.title}
                </h3>
                <p>{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
