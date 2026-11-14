import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  analyticsOn,
  applyMode,
  detectMode,
  initAnalytics,
  pageview,
  setConsent,
  storedChoice,
  track,
  type Mode,
} from "../lib/analytics";
import "./consent.css";

/**
 * The cookie banner, page views and the site-wide conversion clicks.
 * Mounted once in App. Renders nothing until a GA4 ID is configured.
 *
 * Standard regions: "Analytics is always on" + Accept all / Essential only.
 * Strict regions (Quebec, EU/EEA, UK, CH): Accept all / Reject all.
 */
export default function Consent() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("strict");

  useEffect(function boot() {
    if (!analyticsOn()) return;
    initAnalytics();
    let alive = true;
    detectMode().then((m) => {
      if (!alive) return;
      applyMode(m);
      setMode(m);
      if (!storedChoice()) setOpen(true);
    });
    const reopen = () => setOpen(true);
    window.addEventListener("averr:consent-open", reopen);

    /* One listener for every Book / Cal.com / Save-contact / service link. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const text = (a.textContent || "").trim().slice(0, 60);
      if (href.includes("cal.com/") || href === "/contact" || href.startsWith("/contact?")) {
        track("book_call_click", { link_text: text, from_page: location.pathname });
      } else if (href.endsWith(".vcf")) {
        track("save_contact", { from_page: location.pathname });
      } else if (href.startsWith("/services#")) {
        track("service_card_click", { service: href.slice(10), from_page: location.pathname });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => {
      alive = false;
      window.removeEventListener("averr:consent-open", reopen);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(
    function onRoute() {
      if (!analyticsOn()) return;
      /* after the page has set its own title */
      const t = window.setTimeout(() => pageview(pathname), 80);
      return () => window.clearTimeout(t);
    },
    [pathname]
  );

  if (!open) return null;
  const choose = (c: "all" | "essential") => {
    setConsent(c);
    setOpen(false);
  };
  const strict = mode === "strict";
  return (
    <div className="ck" role="dialog" aria-modal="false" aria-labelledby="ck-h">
      <p id="ck-h" className="ck-t">
        {strict ? (
          <>We&rsquo;d like to use cookies to see which pages help and to measure our ads.</>
        ) : (
          <>
            We use analytics cookies to see how the site is used. They&rsquo;re always on. Optional
            advertising cookies help us measure our ads.
          </>
        )}{" "}
        <Link to="/privacy#cookies">Privacy</Link>
      </p>
      <div className="ck-b">
        <button type="button" className="ck-no" onClick={() => choose("essential")}>
          {strict ? "Reject all" : "Essential only"}
        </button>
        <button type="button" className="ck-yes" onClick={() => choose("all")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
