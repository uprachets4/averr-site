import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { useSvReveal } from "../services/v2/useSvReveal";
import { useSetNavDarkOverride } from "../../lib/navTone";
import { useDeclarePageEndTone } from "../../lib/pageTone";
import { useDocumentMeta, META } from "../../lib/documentMeta";
import { track } from "../../lib/analytics";
import { readingMinutes } from "../../data/guides";
import { INDUSTRIES } from "../../data/industries";
import { INDUSTRY_COPY, industryGuides, industryProof } from "../../data/industryPages";
import { PILLARS } from "../../data/pillars";
import { pillarAccent } from "../../data/pillarPages";
import { SERVICE_NAMES } from "../../data/serviceColors";
import "../services/v2/services.css";
import "../services/pillar/pillar.css";

/**
 * One industry page, driven by its registry key.
 *
 * A sibling of `PillarPage` rather than a mode of it. The two render
 * the same five section shapes and share `pillar.css` outright — no
 * class names are duplicated — but a pillar is keyed by `ServiceId`
 * and drives every section from that id, so making one component serve
 * both meant a union key and a conditional in each section. Two small
 * components reading one stylesheet is less to hold than one component
 * with two modes.
 *
 * The section that differs is the second. A pillar lists capabilities
 * from `PILLAR_SERVICES` — what the studio sells. This lists what the
 * trade needs, which is a different claim and the reason the page
 * exists apart from /services/websites.
 *
 * The crumb trail goes Home → Services → <pillar> → here, which does
 * not match the /industries/ URL. That is deliberate: the hierarchy
 * that matters for search is service, then vertical, then the case
 * files, and every step of that trail is a real page. Routing verticals
 * under /services/<pillar>/ instead would have made URL and trail
 * agree, but verticals do not belong to one service — grocery is a web
 * app before it is a website — so the flat /industries/ namespace is
 * the honest one.
 */
export default function IndustryPage({
  industryKey,
  metaKey,
}: {
  industryKey: string;
  metaKey: keyof typeof META;
}) {
  const svRef = useRef<HTMLDivElement | null>(null);
  useSvReveal(svRef);
  useDocumentMeta(META[metaKey].title, META[metaKey].description);
  useDeclarePageEndTone("dark");

  /* `.sv` paints its own navy ground while the nav and the body behind
     it stay light. Without this the nav renders near-black on navy and
     the page flashes cream below the fold — the same thirteen contrast
     violations the first pillar page shipped with. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      const body = document.body;
      const prevBg = body.style.backgroundColor;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      body.style.backgroundColor = "#121C27";
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
        body.style.backgroundColor = prevBg;
      };
    },
    [setNavDark]
  );

  const industry = INDUSTRIES[industryKey];
  const copy = INDUSTRY_COPY[industryKey];
  /* No copy written means no page: the route should not exist, and an
     empty shell is worse than a 404. */
  if (!industry || !copy) return null;

  const pillar = PILLARS[industry.pillar];
  const pillarName = SERVICE_NAMES[industry.pillar];
  const proof = industryProof(industryKey);
  const guides = industryGuides(industryKey);

  return (
    <div
      className="sv sv-pillar"
      ref={svRef}
      style={{ "--acc": pillarAccent(industry.pillar) } as CSSProperties}
    >
      <nav className="wcrumbs wrap" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to={`/services/${pillar.slug}`}>{pillarName}</Link>
          </li>
          <li>
            <span aria-current="page">{industry.short}</span>
          </li>
        </ol>
      </nav>

      <header className="hero gut whero">
        <div className="wrap">
          <span className="eyebrow reveal">{copy.eyebrow}</span>
          <h1 className="reveal">
            {copy.head} <span className="wgt">{copy.headAccent}</span>
          </h1>
          <p className="sub reveal">{copy.sub}</p>
          <div className="ctas reveal">
            <Link
              to="/contact"
              className="pri"
              onClick={() => track("book_call_click", { from: `industry_${industry.slug}_hero` })}
            >
              Book a free 30-minute call
            </Link>
            <Link to={`/services/${pillar.slug}`} className="sec">
              {copy.closeAltLabel}
            </Link>
          </div>
        </div>
      </header>

      <section className="sec gut" aria-labelledby="inneeds">
        <div className="wrap">
          <span className="eyebrow reveal">{copy.needsEyebrow}</span>
          <h2 id="inneeds" className="reveal" style={{ marginTop: 18 }}>
            {copy.needsHead}
          </h2>
          <div className="inc">
            {copy.needs.map(function row(n) {
              return (
                <div className="incrow" key={n.name}>
                  <i aria-hidden="true" />
                  <b>{n.name}</b>
                  <p>{n.outcome}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec gut wproof" aria-labelledby="inproof">
        <div className="wrap">
          <span className="eyebrow reveal">{copy.proofEyebrow}</span>
          <h2 id="inproof" className="reveal" style={{ marginTop: 18 }}>
            {copy.proofHead}
          </h2>
          <p className="wlede reveal">{copy.proofLede}</p>
          <ul className="wcases">
            {proof.map(function card(p) {
              return (
                <li key={p.slug} className="wcase" style={{ "--c": p.c } as CSSProperties}>
                  <Link to={`/work/${p.slug}`} className="wcaselink">
                    <span className="wcasetop">
                      <i aria-hidden="true" />
                      <span className="wsector">{p.sector}</span>
                      <span className="wyear">{p.year}</span>
                    </span>
                    <strong className="wname">{p.name}</strong>
                    <span className="wthesis">{p.thesis}</span>
                    <span className="wmore" aria-hidden="true">
                      Read the case file →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {guides.length > 0 ? (
        <section className="sec gut wread" aria-labelledby="inread">
          <div className="wrap">
            <span className="eyebrow reveal">{copy.readEyebrow}</span>
            <h2 id="inread" className="reveal" style={{ marginTop: 18 }}>
              {copy.readHead}
            </h2>
            <ul className="wguides">
              {guides.map(function g(guide) {
                return (
                  <li key={guide.slug}>
                    <Link to={`/guides/${guide.slug}`}>
                      <strong>{guide.title}</strong>
                      <span className="wgdek">{guide.dek}</span>
                      <span className="wgmeta">{readingMinutes(guide)} min read</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="wend gut" aria-labelledby="inclose">
        <div className="wrap">
          <div className="box">
            <span className="eyebrow reveal">Start</span>
            <h2 id="inclose" className="reveal" style={{ marginTop: 18 }}>
              {copy.closeHead}
            </h2>
            <p>{copy.closeBody}</p>
            <div className="ctas">
              <Link
                to="/contact"
                className="pri"
                onClick={() => track("book_call_click", { from: `industry_${industry.slug}_close` })}
              >
                Book a free 30-minute call
              </Link>
              <Link to="/work" className="sec">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
