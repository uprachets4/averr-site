import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { useSvReveal } from "../v2/useSvReveal";
import { useSetNavDarkOverride } from "../../../lib/navTone";
import { useDeclarePageEndTone } from "../../../lib/pageTone";
import { useDocumentMeta, META } from "../../../lib/documentMeta";
import { track } from "../../../lib/analytics";
import { readingMinutes } from "../../../data/guides";
import { PILLARS } from "../../../data/pillars";
import { industriesForPillar } from "../../../data/industries";
import {
  PILLAR_COPY,
  pillarAccent,
  pillarCapabilities,
  pillarGuides,
  pillarProof,
} from "../../../data/pillarPages";
import { SERVICE_NAMES, type ServiceId } from "../../../data/serviceColors";
import "../v2/services.css";
import "./pillar.css";

/**
 * One service pillar page, driven by its id.
 *
 * Built on the same `.sv` vocabulary as /services so the family reads
 * as one, but deliberately quieter: /services opens with a pinned
 * stage that builds deliverables for a business the visitor names,
 * which is the most interactive thing on the site. A weaker echo of it
 * here would invite the comparison. A visitor who arrived from a search
 * for this one service wants three things — what it includes, who else
 * you did it for, and what it costs them in time.
 *
 * Five sections, and two are deliberately absent on every pillar. No
 * FAQ: those questions were merged onto /services and two FAQPages on
 * one subject put both in the running for one rich result. No process
 * rail: /services renders the five steps and /about renders the same
 * steps split into what you do and what I do, so a third telling would
 * be the section that exists because service pages have one.
 */
export default function PillarPage({ id, metaKey }: { id: ServiceId; metaKey: keyof typeof META }) {
  const svRef = useRef<HTMLDivElement | null>(null);
  useSvReveal(svRef);
  useDocumentMeta(META[metaKey].title, META[metaKey].description);
  /* `.wend .box` is the navy card, so the footer below it takes the
     dark tone — the same declaration /services makes. */
  useDeclarePageEndTone("dark");

  /* `.sv` paints its own navy ground while the nav and the body behind
     it stay light, so without this the nav renders near-black on navy
     and the page flashes cream below the fold. Thirteen contrast
     violations the first time this was missed. */
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

  const copy = PILLAR_COPY[id];
  const pillar = PILLARS[id];
  /* A pillar with no copy written has no page: the route should not
     exist, and rendering an empty shell would be worse than a 404. */
  if (!copy) return null;

  const capabilities = [...pillarCapabilities(id), ...(copy.extraIncluded ?? [])];
  const proof = pillarProof(id);
  const guides = pillarGuides(id);
  const name = SERVICE_NAMES[id];
  /* Derived, not written into the copy: a vertical page needs its
     inbound link from the moment it goes live, and anything that waits
     on someone editing prose will eventually ship orphaned — which is
     exactly how /industries/contractors first shipped. */
  const verticals = industriesForPillar(id);

  return (
    <div
      className="sv sv-pillar"
      ref={svRef}
      style={{ "--acc": pillarAccent(id) } as CSSProperties}
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
            <span aria-current="page">{name}</span>
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
              onClick={() => track("book_call_click", { from: `${pillar.slug}_hero` })}
            >
              Book a free 30-minute call
            </Link>
            <Link to="/work" className="sec">
              See the work
            </Link>
          </div>
        </div>
      </header>

      <section className="sec gut" aria-labelledby="winch">
        <div className="wrap">
          <span className="eyebrow reveal">{copy.includedEyebrow}</span>
          <h2 id="winch" className="reveal" style={{ marginTop: 18 }}>
            {copy.includedHead}
          </h2>
          <div className="inc">
            {capabilities.map(function row(c) {
              return (
                <div className="incrow" key={c.name}>
                  <i aria-hidden="true" />
                  <b>{c.name}</b>
                  <p>{c.outcome}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec gut wproof" aria-labelledby="wproofh">
        <div className="wrap">
          <span className="eyebrow reveal">{copy.proofEyebrow}</span>
          <h2 id="wproofh" className="reveal" style={{ marginTop: 18 }}>
            {copy.proofHead}
          </h2>
          <p className="wlede reveal">{copy.proofLede}</p>
          {verticals.length > 0 ? (
            <p className="wvert reveal">
              Built for a particular trade?{" "}
              {verticals.map(function v(ind, n) {
                return (
                  <span key={ind.slug}>
                    {n > 0 ? ", " : null}
                    <Link to={`/industries/${ind.slug}`}>{ind.name.toLowerCase()}</Link>
                  </span>
                );
              })}
              .
            </p>
          ) : null}
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
        <section className="sec gut wread" aria-labelledby="wreadh">
          <div className="wrap">
            <span className="eyebrow reveal">{copy.readEyebrow}</span>
            <h2 id="wreadh" className="reveal" style={{ marginTop: 18 }}>
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

      <section className="wend gut" aria-labelledby="wcloseh">
        <div className="wrap">
          <div className="box">
            <span className="eyebrow reveal">Start</span>
            <h2 id="wcloseh" className="reveal" style={{ marginTop: 18 }}>
              {copy.closeHead}
            </h2>
            <p>{copy.closeBody}</p>
            <div className="ctas">
              <Link
                to="/contact"
                className="pri"
                onClick={() => track("book_call_click", { from: `${pillar.slug}_close` })}
              >
                Book a free 30-minute call
              </Link>
              {/* The questions live on /services, where all eleven are
                  answered together. Sending people there beats repeating
                  a subset here and splitting the search result. */}
              <Link to="/services" className="sec">
                {copy.closeAltLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
