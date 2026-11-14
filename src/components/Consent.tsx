import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { analyticsOn, initAnalytics, pageview, setConsent, storedChoice, track } from "../lib/analytics";
import "./consent.css";

/**
 * The cookie banner, page views and the site-wide conversion clicks.
 * Mounted once in App. Renders nothing until a GA4 ID is configured.
 */
export default function Consent() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(function boot() {
    if (!analyticsOn()) return;
    initAnalytics();
    if (!storedChoice()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("averr:consent-open", reopen);

    /* One listener for every Book / Cal.com / Save-contact link. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.includes("cal.com/") || href === "/contact" || href.startsWith("/contact?")) {
        track("book_call_click", { link_text: (a.textContent || "").trim().slice(0, 60), from_page: location.pathname });
      } else if (href.endsWith(".vcf")) {
        track("save_contact", { from_page: location.pathname });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => {
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
  const choose = (c: "granted" | "denied") => {
    setConsent(c);
    setOpen(false);
  };
  return (
    <div className="ck" role="dialog" aria-modal="false" aria-labelledby="ck-h">
      <p id="ck-h" className="ck-t">
        We use cookies to see which pages help and to measure our ads.{" "}
        <Link to="/privacy#cookies">Privacy</Link>
      </p>
      <div className="ck-b">
        <button type="button" className="ck-no" onClick={() => choose("denied")}>
          Decline
        </button>
        <button type="button" className="ck-yes" onClick={() => choose("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
