/**
 * The booking side of the start pass, kept out of the component.
 *
 * Cal.com's embed runtime is NOT bundled and NOT fetched until the
 * reader shows intent — hovering, focusing or pressing the CTA. Calling
 * `getCalApi()` is what injects `app.cal.com/embed/embed.js`, so the
 * import is dynamic and happens no earlier than that.
 *
 * PRIVACY: the only field read off a successful booking is `startTime`.
 * `bookingSuccessfulV2` is used rather than the deprecated
 * `bookingSuccessful` precisely because the latter carries
 * `organizer.name` and `organizer.email`; V2 carries no attendee
 * identity at all. Nothing is stored, logged or sent anywhere.
 */

/* One declaration, in contact/calConfig.ts, imported here. It used to
   be written out in both files. */
export { CAL_LINK } from "../contact/calConfig";
import { CAL_LINK } from "../contact/calConfig";

type CalApi = (action: string, arg?: unknown) => void;

let apiPromise: Promise<CalApi> | null = null;

/** Load the embed once, on intent. Resolves to Cal's `cal()` function. */
export function warmEmbed(): Promise<CalApi> {
  if (apiPromise) return apiPromise;
  apiPromise = import("@calcom/embed-react")
    .then((m) => m.getCalApi({}))
    .then((cal) => {
      /* dark since spec 32: /services is a dark page end to end, and a
         white modal over it read as a different site opening. */
      (cal as unknown as CalApi)("ui", { hideEventTypeDetails: false, theme: "dark" });
      return cal as unknown as CalApi;
    });
  return apiPromise;
}

/** True once the embed has been asked for; used for the CTA's busy state. */
export function embedRequested() {
  return apiPromise !== null;
}

/** `date` and `month` are optional: /services always knows the day the
 *  visitor picked, /about's CTA does not and opens Cal on its own next
 *  available slot. */
export type BookingConfig = { date?: string; month?: string; notes?: string };

export async function openModal(config: BookingConfig) {
  const cal = await warmEmbed();
  cal("modal", {
    calLink: CAL_LINK,
    config: { layout: "month_view", ...config },
  });
}

/**
 * Subscribe to a successful booking. Returns an unsubscribe.
 *
 * The callback receives the ISO start time and nothing else.
 */
export async function onBooked(fn: (startTimeISO: string) => void) {
  const cal = await warmEmbed();
  function handler(e: unknown) {
    const detail = (e as { detail?: { data?: { startTime?: string } } })?.detail;
    const startTime = detail?.data?.startTime;
    if (typeof startTime === "string" && startTime) fn(startTime);
  }
  cal("on", { action: "bookingSuccessfulV2", callback: handler });
  return function off() {
    cal("off", { action: "bookingSuccessfulV2", callback: handler });
  };
}

/** "Wed, Oct 7 · 2:30 PM ET" from an ISO instant, in Toronto. */
export function bookedLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return { date, time: `${time} ET` };
}

/** "Wednesday, October 7 at 2:30 PM Eastern" — for aria-live. */
export function bookedSpoken(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `Booked: ${date} at ${time} Eastern.`;
}

/** The Toronto civil date (YYYY-MM-DD) an instant falls on. */
export function torontoISODate(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
