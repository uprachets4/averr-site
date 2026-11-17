import { Link } from "react-router-dom";
import { GUIDES, readingMinutes } from "../../data/guides";
import "./guidesBand.css";

/**
 * Home's way into the guides.
 *
 * Without this the section was an orphan: nothing on the site linked
 * to /guides except the guides' own breadcrumbs, so a visitor could
 * only reach it by typing the URL or arriving from a search result.
 * The footer link fixes findability on every page; this one is the
 * entry point that matters for ranking, because home carries the most
 * authority and passes the most of it on.
 *
 * It is DARK, not the cream the guides themselves use. The band sits
 * between the film's finale and the footer, both of which are dark,
 * and a cream strip between them would flash on the way past. A link
 * into the guides belongs to home and should look like home; the
 * guides can be cream once you are in them.
 *
 * Three, not all of them: this is a door, not the index. The three
 * most recent, so it keeps itself current as guides are added.
 *
 * Markup reuses `.sv`'s list idiom — the same rows as "What you get"
 * on /services — rather than inventing a second dark list for one
 * band.
 */
const SHOWN = 3;

export default function GuidesBand() {
  const latest = [...GUIDES]
    .sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, SHOWN);

  return (
    <section className="sv gband" aria-labelledby="gbandh">
      <div className="gut">
        <div className="wrap">
          <span className="eyebrow">Guides</span>
          <h2 id="gbandh">Answers, if you'd rather do it yourself.</h2>

          <div className="inc">
            {latest.map(function row(g) {
              return (
                /* Whole row is the link, as everywhere else on the site. */
                <Link className="incrow" to={`/guides/${g.slug}`} key={g.slug}>
                  <i aria-hidden="true" />
                  <b>{g.title}</b>
                  <p>{g.dek}</p>
                  <span className="gbmeta">{readingMinutes(g)} min</span>
                </Link>
              );
            })}
          </div>

          <Link className="gball" to="/guides">
            All guides
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
