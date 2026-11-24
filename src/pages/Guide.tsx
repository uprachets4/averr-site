import { Link, useParams } from "react-router-dom";
import {
  GUIDE_BY_SLUG,
  guideDate,
  readingMinutes,
  type Block,
  type Guide as GuideData,
} from "../data/guides";
import { pillarHref } from "../data/pillars";
import { industriesForGuide } from "../data/industries";
import { SERVICE_NAMES } from "../data/serviceColors";
import { useDocumentMeta, guideMeta } from "../lib/documentMeta";
import { useDeclarePageEndTone } from "../lib/pageTone";
import NotFound from "./NotFound";
import "../components/guides/guides.css";

/**
 * /guides/:slug — one guide.
 *
 * The article is rendered from structured data rather than written as
 * JSX, so every guide gets the same heading levels, the same anchored
 * sections and the same contents without anyone remembering to add
 * them. `tools/prerender.mjs` builds the Article schema and the meta
 * description from the same source, so the page and what Google reads
 * cannot describe different articles.
 *
 * The byline is not decoration: section 7 of the SEO checklist asks
 * for an author on every guide with Person schema linking to /about,
 * because for this kind of content Google weighs who wrote it. The
 * visible line and the schema both point at the same person.
 *
 * `checked` is published as well as `published`. A guide that states
 * another company's rules goes stale silently, and a visible "checked
 * on" date is the only honest way to say how much to trust it.
 */

/** A heading's anchor, derived so the contents and the section agree. */
export function sectionId(h: string): string {
  return h
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map(function block(b, i) {
        if (b.t === "p") return <p key={i}>{b.text}</p>;
        if (b.t === "ul")
          return (
            <ul key={i}>
              {b.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          );
        if (b.t === "ol")
          return (
            <ol key={i}>
              {b.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          );
        return (
          <aside className="gnote" key={i}>
            <b>{b.label}</b>
            <p>{b.text}</p>
          </aside>
        );
      })}
    </>
  );
}

/* `guideMeta` moved to lib/documentMeta beside `caseMeta`: both answer
   the same question, both are held to the same limits by
   tools/meta-lengths.test.ts, and that test cannot import a .tsx —
   node's type stripping does not do JSX. Re-exported here so the
   existing callers keep their import path. */
export { guideMeta };

function Article({ g }: { g: GuideData }) {
  const meta = guideMeta(g);
  useDocumentMeta(meta.title, meta.description);
  useDeclarePageEndTone("cream");

  return (
    <div className="gd">
      <div className="gcol">
        <nav className="gcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/guides">Guides</Link>
            </li>
            <li>
              <span aria-current="page">{g.title}</span>
            </li>
          </ol>
        </nav>

        <header className="ghero">
          <span className="geyebrow">Guide</span>
          <h1>{g.title}</h1>
          <p className="gdek">{g.dek}</p>

          <div className="gby">
            <span>
              By <Link to="/about">Prachets Upadhyay</Link>, founder of Averr Studios
            </span>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>{readingMinutes(g)} min read</span>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>
              Published <time dateTime={g.published}>{guideDate(g.published)}</time>
            </span>
            {g.checked !== g.published ? (
              <>
                <span className="sep" aria-hidden="true">
                  ·
                </span>
                <span>
                  Checked <time dateTime={g.checked}>{guideDate(g.checked)}</time>
                </span>
              </>
            ) : null}
          </div>

          {/* The service this guide belongs to. Every guide used to end
              at /contact and nowhere else, so a reader who arrived on
              "why is my website slow" and wanted it fixed had to work
              out for themselves that we do that. This is the cluster
              pointing at its pillar — the link a search engine follows
              to learn the two are about the same thing, and the one a
              reader follows when the article has convinced them. */}
          {g.svc.length > 0 ? (
            <p className="gpart">
              Part of{" "}
              {g.svc.map(function svc(id, i) {
                return (
                  <span key={id}>
                    {i > 0 ? (i === g.svc.length - 1 ? " and " : ", ") : null}
                    <Link to={pillarHref(id)}>{SERVICE_NAMES[id]}</Link>
                  </span>
                );
              })}
              {/* And down to the vertical, where one claims this guide.
                  The guide is usually the most specific page in the
                  cluster, so a reader who got here from a search for
                  their trade is one click from the page written for it —
                  and the vertical page gets an inbound link it would
                  otherwise have to wait on someone adding by hand. */}
              {industriesForGuide(g.slug).map(function ind(i) {
                return (
                  <span key={i.slug}>
                    {" · "}
                    <Link to={`/industries/${i.slug}`}>{i.name}</Link>
                  </span>
                );
              })}
            </p>
          ) : null}

          <nav className="gtoc" aria-labelledby="gtoch">
            <h2 id="gtoch">What's in this guide</h2>
            <ol>
              {g.sections.map((s) => (
                <li key={s.h}>
                  <a href={`#${sectionId(s.h)}`}>{s.h}</a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <article className="gbody">
          <Blocks blocks={g.intro} />

          {g.sections.map(function section(s) {
            return (
              <section key={s.h}>
                <h2 id={sectionId(s.h)}>{s.h}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            );
          })}

          <aside className="gend">
            <h2>Would you rather someone just did this?</h2>
            <p>{g.close}</p>
            <Link className="gcta" to="/contact">
              Book a free 30-minute call
            </Link>
          </aside>
        </article>
      </div>
    </div>
  );
}

export default function Guide() {
  const { slug } = useParams();
  const g = slug ? GUIDE_BY_SLUG[slug] : undefined;
  /* Same contract as a case file: an unknown slug is a real 404, not a
     blank article. */
  if (!g) return <NotFound />;
  return <Article g={g} />;
}
