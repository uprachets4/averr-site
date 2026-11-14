/**
 * Google Analytics 4 with Consent Mode v2 (advanced), by region.
 *
 * STANDARD regions (Ontario and the rest of Canada outside Quebec, the US,
 * everywhere not listed below): analytics is always on from the first
 * visit and is disclosed as such in the banner and the privacy page.
 * Advertising cookies stay off until "Accept all".
 *
 * STRICT regions (Quebec, the EU/EEA, the UK, Switzerland): everything is
 * off until "Accept all"; "Reject all" keeps it off. Until the region is
 * known, the strict defaults apply.
 *
 * Events: page_view, book_call_click, booking_complete, generate_lead,
 * save_contact, service_card_click, pass_step, finale_name_built.
 */

/** The GA4 web stream's Measurement ID (public by design). */
export const GA_ID = "G-5T6VJ4G2R8";

const KEY = "averr-consent-v2";
export type Choice = "all" | "essential";
export type Mode = "standard" | "strict";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const STRICT_COUNTRIES = new Set(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH".split(" ")
);

export const analyticsOn = () => typeof window !== "undefined" && !!GA_ID;

export function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

let mode: Mode = "strict";
export const currentMode = () => mode;

/** Region → rules. Falls back to strict if the lookup fails. */
export async function detectMode(): Promise<Mode> {
  try {
    const r = await fetch("/api/geo", { cache: "no-store" });
    const { country, region } = (await r.json()) as { country?: string; region?: string };
    if (!country) return "strict";
    if (STRICT_COUNTRIES.has(country)) return "strict";
    if (country === "CA" && region === "QC") return "strict";
    return "standard";
  } catch {
    return "strict";
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
    wait_for_update: 800,
  });
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Apply the region's rules plus the visitor's choice (if any). */
export function applyMode(m: Mode) {
  mode = m;
  apply(storedChoice());
}

function apply(c: Choice | null) {
  const analytics = mode === "standard" || c === "all" ? "granted" : "denied";
  const ads = c === "all" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function setConsent(c: Choice) {
  try {
    localStorage.setItem(KEY, c);
  } catch {
    /* private mode: the choice lasts this visit only */
  }
  apply(c);
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
