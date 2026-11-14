/**
 * Google Analytics 4 with Consent Mode v2 (advanced).
 *
 * - Every consent signal starts DENIED. With it denied, GA sets no cookies
 *   and sends only cookieless, anonymous pings that Google uses for modelling.
 * - "Accept" in the banner grants analytics and ads storage; "Decline" keeps
 *   everything denied. The choice is stored in this browser only.
 * - Nothing loads during prerender, or when GA_ID is empty.
 *
 * Events that matter for the studio: book_call_click (any Book / Cal.com
 * link), booking_complete (a Cal.com booking finished on the site),
 * generate_lead (contact form sent), save_contact (vCard download).
 */

/** The GA4 web stream's Measurement ID (public by design). */
export const GA_ID = "";

const KEY = "averr-consent-v1";
type Choice = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const analyticsOn = () => typeof window !== "undefined" && !!GA_ID;

export function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

let started = false;
export function initAnalytics() {
  if (started || !analyticsOn()) return;
  started = true;
  window.dataLayer = window.dataLayer || [];
  const gtag: Gtag = function () {
    // gtag needs the real `arguments` object, not a spread copy
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  if (storedChoice() === "granted") applyConsent("granted");
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function applyConsent(c: Choice) {
  window.gtag?.("consent", "update", {
    ad_storage: c,
    ad_user_data: c,
    ad_personalization: c,
    analytics_storage: c,
  });
}

export function setConsent(c: Choice) {
  try {
    localStorage.setItem(KEY, c);
  } catch {
    /* private mode: the choice lasts this visit only */
  }
  applyConsent(c);
  window.dispatchEvent(new CustomEvent("averr:consent", { detail: c }));
}

/** Re-open the banner (footer "Cookie settings"). */
export function openConsent() {
  window.dispatchEvent(new CustomEvent("averr:consent-open"));
}

export function track(name: string, params: Record<string, unknown> = {}) {
  if (!analyticsOn()) return;
  window.gtag?.("event", name, params);
}

export function pageview(path: string) {
  track("page_view", { page_path: path, page_location: location.href, page_title: document.title });
}
