import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { useSvReveal } from "../components/services/v2/useSvReveal";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { track } from "../lib/analytics";
import { readingMinutes } from "../data/guides";
import {
  WEBSITES_ACCENT,
  WEBSITES_GUIDES,
  WEBSITES_HERO,
  WEBSITES_INCLUDED,
  WEBSITES_PROOF,
  WEBSITES_PROOF_INTRO,
  WEBSITES_TIMELINE,
} from "../data/serviceWebsites";
import "../components/services/v2/services.css";
import "../components/services/websites/websites.css";

/**
 * /services/websites — the Websites pillar page.
 *
 * Built on the same `.sv` vocabulary as /services so the two read as
 * one family rather than one page and its cousin. What differs is the
 * rhythm: /services opens with a pinned stage that builds deliverables
 * for a business the visitor names, which is the most interactive thing
 * on the site. Repeating that here would be a weaker copy of it. This
 * page is quieter and shorter, because its visitor arrived from a
 * search for a custom website and wants three things — what it
 * includes, who else you did it for, and what it costs them in time.
 *
 * Five sections, and the two it does not have are described in
 * `data/serviceWebsites.ts`: no FAQ, because /services answers those
 * five questions already and two FAQPages on one subject split the
 * result; no process rail, because /services and /about each render
 * the same five steps and a third would be filler.
 */
export default function ServiceWebsites() {
  const svRef = useRef<HTMLDivElement | null>(null);
  useSvReveal(svRef);
  useDocumentMeta(META.serviceWebsites.title, META.serviceWebsites.description);

  /* The same declaration /services makes, and omitting it was not a
     cosmetic miss: `.sv` paints its own navy ground, but the nav and
     the body behind it stay in their light state, so the nav rendered
     near-black on navy at 1.05 contrast and the page flashed cream
     behind the fold. Thirteen axe violations, all from this and the
     pale card below. */
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
  /* `.wend .box` is the navy card, so the footer below it needs the dark
     tone — the same declaration /services makes, for the same reason. */
  useDeclarePageEndTone("dark");

  return (
    <div className="sv sv-web" ref={svRef} style={{ "--acc": WEBSITES_ACCENT } as React.CSSProperties}>
      <nav className="wcrumbs wrap" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <span aria-current="page">Websites</span>
          </li>
        </ol>
      </nav>

      <header className="hero gut whero">
        <div className="wrap">
          <span className="eyebrow reveal">{WEBSITES_HERO.eyebrow}</span>
          <h1 className="reveal">
            {WEBSITES_HERO.head}{" "}
            <span className="wgt">{WEBSITES_HERO.headEmphasis}</span>
          </h1>
          <p className="sub reveal">{WEBSITES_HERO.sub}</p>
          <div className="ctas reveal">
            <Link
              to="/contact"
              className="pri"
              onClick={() => track("book_call_click", { from: "websites_hero" })}
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
          <span className="eyebrow reveal">What a build includes</span>
          <h2 id="winch" className="reveal" style={{ marginTop: 18 }}>
            Direction first, then the site itself.
          </h2>
          <div className="inc">
            {WEBSITES_INCLUDED.map(function row(r) {
              return (
                <div className="incrow" key={r.name}>
                  <i aria-hidden="true" />
                  <b>{r.name}</b>
                  <p>{r.outcome}</p>
                </div>
              );
            })}
            <div className="incrow">
              <i aria-hidden="true" />
              <b>The person you brief builds it</b>
              <p>
                No handover to a production team. You review each section as it is
                ready and change what doesn't feel like you.
              </p>
            </div>
            <div className="incrow">
              <i aria-hidden="true" />
              <b>Thirty days after you launch</b>
              <p>
                Live, watched and adjusted, so the small things found in the first
                weeks get fixed while it still matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec gut wproof" aria-labelledby="wproofh">
        <div className="wrap">
          <span className="eyebrow reveal">Where it's gone live</span>
          <h2 id="wproofh" className="reveal" style={{ marginTop: 18 }}>
            Sites doing real work.
          </h2>
          <p className="wlede reveal">{WEBSITES_PROOF_INTRO}</p>

          <ul className="wcases">
            {WEBSITES_PROOF.map(function card(p) {
              return (
                <li key={p.slug} className="wcase" style={{ "--c": p.c } as React.CSSProperties}>
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

      {WEBSITES_GUIDES.length > 0 ? (
        <section className="sec gut wread" aria-labelledby="wreadh">
          <div className="wrap">
            <span className="eyebrow reveal">Before you decide</span>
            <h2 id="wreadh" className="reveal" style={{ marginTop: 18 }}>
              Worth reading first, whoever you hire.
            </h2>
            <ul className="wguides">
              {WEBSITES_GUIDES.map(function g(guide) {
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
              Thirty minutes, and you'll know what your site needs.
            </h2>
            <p>
              Tell me what you do and who it's for. You'll get a fixed scope, a fixed
              timeline and a fixed price in writing within 3 business days — on the{" "}
              {WEBSITES_TIMELINE} build above. If a site builder would serve you
              better for now, you'll hear that instead.
            </p>
            <div className="ctas">
              <Link
                to="/contact"
                className="pri"
                onClick={() => track("book_call_click", { from: "websites_close" })}
              >
                Book a free 30-minute call
              </Link>
              {/* The questions live on /services, where all eleven are
                  answered together. Sending people there beats repeating
                  five of them here and splitting the search result. */}
              <Link to="/services" className="sec">
                All four services, and the questions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
