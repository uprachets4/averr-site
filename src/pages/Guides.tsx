import { Link } from "react-router-dom";
import { GUIDES, readingMinutes, guideDate } from "../data/guides";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { useDeclarePageEndTone } from "../lib/pageTone";
import "../components/guides/guides.css";

/**
 * /guides — the index.
 *
 * Light, on the Nolana ground, where the rest of the site keeps navy
 * and black for the cinematic routes. These are the only pages on the
 * site someone reads for ten minutes rather than scrolls through, and
 * the layout is built around that rather than around a scroll
 * performance.
 *
 * No nav dark override: this route is light, so the bar is too.
 */
export default function Guides() {
  useDocumentMeta(META.guides.title, META.guides.description);
  useDeclarePageEndTone("cream");

  return (
    <div className="gd">
      <div className="gwrap">
        <header className="ghead">
          <span className="geyebrow">Guides</span>
          <h1>How to do the things we get asked about most.</h1>
          <p>
            Written from the work, for owners doing it themselves. No gated
            downloads, no sign-up — the whole thing is on the page.
          </p>
        </header>

        <div className="glist">
          {GUIDES.map(function guide(g) {
            return (
              /* The whole row is the link, not just the title: a card
                 where only the heading is clickable is a pitfall this
                 site has shipped before. */
              <Link className="gitem" to={`/guides/${g.slug}`} key={g.slug}>
                <h2>{g.title}</h2>
                <span className="gmeta">
                  {readingMinutes(g)} min read
                  <span aria-hidden="true">·</span>
                  <time dateTime={g.published}>{guideDate(g.published)}</time>
                </span>
                <p>{g.dek}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
