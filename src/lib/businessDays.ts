/**
 * Civil-date arithmetic for the kickoff picker.
 *
 * Dates here are CIVIL dates — a year, month and day in Toronto — not
 * instants. They are carried in a `Date` pinned to 12:00 UTC and read
 * only through UTC getters, so a DST boundary can never shift one onto
 * the day before or after. Building them with the local-time `Date`
 * constructor is what makes "add 14 days" land on the 13th twice a year.
 *
 * Weekends are Saturday and Sunday, and Ontario's nine statutory
 * holidays are skipped in the business-day count — see HOLIDAYS. The
 * table is static and covers 2026–2027; past the end of it the maths
 * silently degrades to weekends only, which `holidayCoverageEndsAfter`
 * exists to let a caller notice.
 *
 * A weekend or holiday is still a perfectly good day to TALK — the call
 * can be any day. Only the three-business-day proposal count skips them.
 */

export type CivilDate = Date;

/** Midday UTC, so no timezone can move the calendar day. */
export function civil(y: number, m: number, d: number): CivilDate {
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function toISO(d: CivilDate): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(iso: string): CivilDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = civil(+m[1], +m[2], +m[3]);
  return toISO(d) === iso ? d : null;
}

/** Today in Toronto, as a civil date. */
export function todayInToronto(now: Date = new Date()): CivilDate {
  // en-CA gives YYYY-MM-DD, and the timeZone option does the conversion
  // that a local-time Date cannot be trusted to do on a CI box in UTC.
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return fromISO(iso) ?? civil(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

export function addDays(d: CivilDate, n: number): CivilDate {
  return new Date(d.getTime() + n * 86400000);
}

export function isWeekend(d: CivilDate): boolean {
  const w = d.getUTCDay();
  return w === 0 || w === 6;
}

/**
 * Ontario statutory holidays, 2026–2027.
 *
 * The nine public holidays under the Employment Standards Act. Easter
 * Monday, the Civic Holiday and Remembrance Day are NOT among them in
 * Ontario and are deliberately absent. The dates are written out rather
 * than computed because an Easter algorithm is a lot of surface area for
 * two years of data, and the test asserts the weekday of every rule-based
 * one so a typo cannot survive.
 */
export const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-02-16": "Family Day",
  "2026-04-03": "Good Friday",
  "2026-05-18": "Victoria Day",
  "2026-07-01": "Canada Day",
  "2026-09-07": "Labour Day",
  "2026-10-12": "Thanksgiving",
  "2026-12-25": "Christmas Day",
  "2026-12-26": "Boxing Day",
  "2027-01-01": "New Year's Day",
  "2027-02-15": "Family Day",
  "2027-03-26": "Good Friday",
  "2027-05-24": "Victoria Day",
  "2027-07-01": "Canada Day",
  "2027-09-06": "Labour Day",
  "2027-10-11": "Thanksgiving",
  "2027-12-25": "Christmas Day",
  "2027-12-26": "Boxing Day",
};

/** The last date the holiday table can speak for. */
export const holidayCoverageEndsAfter = civil(2027, 12, 31);

export function holidayName(d: CivilDate): string | null {
  return HOLIDAYS[toISO(d)] ?? null;
}

/** Neither a weekend nor an Ontario statutory holiday. */
export function isBusinessDay(d: CivilDate): boolean {
  return !isWeekend(d) && !holidayName(d);
}

/** The date itself if it is a business day, otherwise the next one. */
export function nextBusinessDay(d: CivilDate): CivilDate {
  let out = d;
  // bounded: a run of non-business days cannot plausibly exceed a week
  for (let i = 0; i < 14 && !isBusinessDay(out); i++) out = addDays(out, 1);
  return out;
}

/**
 * `n` business days after `d`, skipping weekends and Ontario stat days.
 *
 * Two anchors, because a call on a working day and a call on a Sunday do
 * not start the same clock:
 *
 *   - a call ON a business day counts from the day AFTER it, so a Monday
 *     call is Tue, Wed, Thu.
 *   - a call on a weekend or a holiday counts the following business day
 *     as day one, so a Saturday call is Mon, Tue, Wed.
 *
 * Without the second anchor a Saturday call would land a day later than
 * the Monday after it, which is not a promise anyone would make out loud.
 */
export function addBusinessDays(d: CivilDate, n: number): CivilDate {
  const onBusinessDay = isBusinessDay(d);
  let out = onBusinessDay ? d : nextBusinessDay(d);
  let left = onBusinessDay ? n : n - 1;
  while (left > 0) {
    out = addDays(out, 1);
    if (isBusinessDay(out)) left--;
  }
  return out;
}

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function weekdayShort(d: CivilDate): string {
  return WEEKDAYS_SHORT[d.getUTCDay()];
}

export function weekdayLong(d: CivilDate): string {
  return WEEKDAYS_LONG[d.getUTCDay()];
}

export function dayOfMonth(d: CivilDate): number {
  return d.getUTCDate();
}

/** "Monday, Oct 12" */
export function longLabel(d: CivilDate): string {
  return `${weekdayLong(d)}, ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "Oct 12" */
export function shortLabel(d: CivilDate): string {
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function sameDay(a: CivilDate, b: CivilDate): boolean {
  return a.getTime() === b.getTime();
}

/**
 * The three dates the section promises, from one chosen call date.
 *
 * Only these facts exist: the call is 20 minutes, the proposal lands
 * within 3 business days, and kickoff is within 14 calendar days.
 * Nothing here invents a fourth.
 */
export function scheduleFrom(call: CivilDate) {
  return {
    call,
    proposal: addBusinessDays(call, 3),
    kickoff: addDays(call, 14),
  };
}
