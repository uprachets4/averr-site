import { Link, useParams } from "react-router-dom";
import {
  GUIDE_BY_SLUG,
  guideDate,
  readingMinutes,
  type Block,
  type Guide as GuideData,
} from "../data/guides";
import { useDocumentMeta } from "../lib/documentMeta";
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

/** Title and description for a guide, shared by the page and prerender. */
export function guideMeta(g: GuideData): { title: string; description: string } {
  const title = `${g.title} | Averr Studios`;
  const description =
    g.dek.length <= 158 ? g.dek : g.dek.slice(0, g.dek.lastIndexOf(" ", 157)) + "…";
  return { title, description };
}

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
            <p>
              Setting up a Google Business Profile is part of what we do for
              clients in Toronto and the GTA, along with the website it points
              at. Thirty minutes on a call and you'll know what it takes.
            </p>
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
