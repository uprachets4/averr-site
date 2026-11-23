import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSetNavDarkOverride } from "../../lib/navTone";
import { useDeclarePageEndTone } from "../../lib/pageTone";
import { useDocumentMeta, META } from "../../lib/documentMeta";
import { track } from "../../lib/analytics";
import type { Report } from "../../../api/_findability";
import "./findable.css";

/**
 * /tools/findable — the findability checker.
 *
 * The page is a thin shell around /api/findability. All of the
 * judgement is in src/lib/findability.ts; this renders what comes back
 * and sets expectations before it does.
 *
 * Two decisions worth stating.
 *
 * No FAQ block, deliberately. The pillar pages carry none for a reason
 * written down in PillarPage.tsx — /services answers all eleven
 * questions, and two FAQPages on one subject put both in the running
 * for one rich result. Adding a third here would contradict that for
 * the sake of a section nobody asked for.
 *
 * The limits are stated before the result rather than in a footnote
 * after it. A visitor who gets a score and only then learns that speed
 * and their Google profile were not examined has been misled for the
 * length of the page, and this tool's entire value is that it reads as
 * honest rather than as a lead magnet.
 */
export default function Findable() {
  useDocumentMeta(META.toolFindable.title, META.toolFindable.description);
  useDeclarePageEndTone("dark");

  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);

  /* `.sv` paints a navy ground while the nav and body behind it stay
     light; without this the nav renders near-black on navy. Same
     override the pillar and industry pages make. */
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

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    setReport(null);
    track("findability_check", { from: "tools_findable" });
    try {
      const res = await fetch(`/api/findability?url=${encodeURIComponent(url.trim())}`);
      const body = await res.json();
      if (!res.ok || body.error) {
        setError(body.error || "Something went wrong reading that site.");
        setState("error");
        return;
      }
      setReport(body as Report);
      setState("done");
      /* Move focus to the result rather than leaving it on the button:
         a screen-reader user otherwise has no idea anything happened. */
      window.requestAnimationFrame(() => resultRef.current?.focus());
    } catch {
      setError("Could not reach the checker. Try again in a moment.");
      setState("error");
    }
  }

  const band = report ? (report.score >= 85 ? "good" : report.score >= 60 ? "mid" : "poor") : "mid";

  return (
    <div className="sv fnd">
      <nav className="wcrumbs wrap" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <span aria-current="page">Findability check</span>
          </li>
        </ol>
      </nav>

      <header className="fnd-hero gut">
        <div className="wrap">
          <span className="eyebrow">Free tool</span>
          <h1>
            Can a customer in the GTA <span className="fnd-acc">actually find you?</span>
          </h1>
          <p className="fnd-sub">
            Put in your website address. In about ten seconds you will get the list of things a
            search engine can and cannot work out about your business, with the reason each one
            matters. No email, no sign-up, nothing stored.
          </p>

          <form className="fnd-form" onSubmit={run}>
            <label className="sr-only" htmlFor="fnd-url">
              Your website address
            </label>
            <input
              id="fnd-url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              placeholder="yourbusiness.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={state === "running"}
            />
            <button type="submit" disabled={state === "running" || !url.trim()}>
              {state === "running" ? "Checking…" : "Check my site"}
            </button>
          </form>

          {/* Stated before the result, not after it. */}
          <p className="fnd-limits">
            This reads your page the way a crawler does. It does{" "}
            <strong>not</strong> measure real page speed or look at your Google Business Profile —
            both need paid Google APIs, and a made-up grade would be worse than none. Those two gaps
            are named again with your results.
          </p>
        </div>
      </header>

      <div className="wrap" aria-live="polite">
        {state === "error" ? (
          <div className="fnd-err" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        {state === "running" ? (
          <div className="fnd-wait">
            <p>Reading the page, robots.txt and the sitemap…</p>
          </div>
        ) : null}

        {report ? (
          <div className="fnd-out" ref={resultRef} tabIndex={-1}>
            <div className={`fnd-score fnd-${band}`}>
              <strong>{report.score}</strong>
              <span>out of 100</span>
            </div>
            <p className="fnd-head">{report.headline}</p>
            <p className="fnd-for">
              Checked <span>{report.finalUrl}</span>
            </p>

            {report.groups.map(function group(g) {
              return (
                <section className="fnd-group" key={g.id}>
                  <h2>{g.title}</h2>
                  <ul>
                    {g.checks.map(function row(c) {
                      return (
                        <li key={c.id} className={`fnd-${c.status}`}>
                          <span className="fnd-mark" aria-hidden="true" />
                          <div>
                            <b>
                              {c.label}
                              <i className="fnd-tag">
                                {c.status === "pass" ? "OK" : c.status === "warn" ? "Could be better" : "Costing you"}
                              </i>
                            </b>
                            <p>{c.detail}</p>
                            <p className="fnd-why">{c.why}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}

            <section className="fnd-group fnd-not">
              <h2>What this did not check</h2>
              <ul>
                {report.notChecked.map(function row(n) {
                  return (
                    <li key={n} className="fnd-none">
                      <span className="fnd-mark" aria-hidden="true" />
                      <div>
                        <p>{n}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="fnd-end">
              <h2>Want the list dealt with rather than read?</h2>
              <p>
                Most of what fails here is a single line of code and an afternoon. If you would
                rather not spend the afternoon, the call is thirty minutes and you will get a
                straight answer about which of these actually matter for your trade — including the
                ones that do not.
              </p>
              <div className="fnd-ctas">
                <Link
                  to="/contact"
                  className="pri"
                  onClick={() => track("book_call_click", { from: "tools_findable_result" })}
                >
                  Book a free 30-minute call
                </Link>
                <Link to="/guides" className="sec">
                  Read the guides instead
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
