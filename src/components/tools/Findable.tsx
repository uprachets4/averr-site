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
            This reads the HTML your server sends, the way a crawler does on its first pass, so
            anything your site draws with JavaScript afterwards is invisible to it. It also does{" "}
            <strong>not</strong> measure real page speed or look at your Google Business Profile —
            both need paid Google APIs, and a made-up grade would be worse than none. All three gaps
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

        {/* The page before anyone runs a check.
            The tool was 150 words of indexable text wrapped around a
            form, which is the shape of a page that earns links and
            ranks for nothing. This is what a crawler and a first-time
            visitor read: the four questions the check asks, in the
            order it asks them, and what to do about each answer.
            Hidden once there is a report, because by then the reader
            has the specific version of all of it. */}
        {!report ? (
          <section className="fnd-explain">
            <h2>What the check actually looks at</h2>
            <p>
              Four questions, in the order that decides whether a search engine can do anything
              useful with your site. Most of the answers come from the page itself; the rest from
              your robots.txt, your sitemap, and the response your server gives.
            </p>

            <h3>Can Google tell who you are?</h3>
            <p>
              Structured data is a block of machine-readable detail in the page — your business
              name, your phone number, where you work. Without it a search engine has to infer all
              of that from your paragraphs, and it often infers wrong or not at all. This is the
              single most common gap on a small business site, and for a local trade it is the one
              that costs the most: it is how Google connects a website to a business it can place
              on a map. If this group fails, start with{" "}
              <Link to="/guides/get-your-toronto-business-on-google-maps">
                getting your business on Google Maps
              </Link>
              , which matters more than anything on your website.
            </p>

            <h3>Can Google find your pages?</h3>
            <p>
              A title and a description on every page, one main heading, a canonical address so two
              URLs showing the same page do not compete with each other, and a sitemap and
              robots.txt a crawler can read. These are mechanical and cheap, and they are the
              difference between a site Google has catalogued and one it has merely visited. If
              you have never looked at what Google thinks of your site, the twenty-minute version
              is{" "}
              <Link to="/guides/set-up-google-search-console">setting up Search Console</Link>.
            </p>

            <h3>Does it work on a phone?</h3>
            <p>
              A declared mobile viewport, HTTPS, descriptions on your images, and a page that is
              not so heavy it stalls on a phone signal. Most people looking for a trade are
              standing somewhere holding a phone. A site that loads slowly there is not a ranking
              problem first, it is a lost enquiry first — the ranking follows.{" "}
              <Link to="/guides/why-your-website-is-slow">
                What actually makes a site slow
              </Link>{" "}
              goes through the causes in the order worth fixing them.
            </p>

            <h3>Will a customer trust it?</h3>
            <p>
              A phone number that is tappable rather than typed out as text, and the signals a
              person scans for before they call a stranger to come to their house. This group is
              the one that is about the visitor rather than the crawler, and on a trades site it is
              usually the one worth fixing first.
            </p>

            <h2>What a low score means, and what it does not</h2>
            <p>
              You get a score out of 100, which is every check counted as a pass, a half for a
              warning, or nothing. It is not a Google ranking and nothing here is a penalty — a
              site can score badly and still rank, and a perfect score guarantees nothing on its
              own. What it measures is how much a search engine is having to guess about your
              business, and guessing is where you lose to a competitor who made it obvious.
            </p>
            <p>
              Most failures here are one line of code. The exceptions are structured data, which is
              a short block someone has to write for your business specifically, and page weight,
              which usually means images nobody resized. If several of these fail at once and you
              are wondering why you cannot find yourself at all, that question has three different
              answers and{" "}
              <Link to="/guides/why-your-website-isnt-on-google">
                this is how to tell which one is yours
              </Link>
              .
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
