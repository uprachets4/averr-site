/**
 * Civil-date arithmetic for the kickoff picker.
 *
 * Dates here are CIVIL dates — a year, month and day in Toronto — not
 * instants. They are carried in a `Date` pinned to 12:00 UTC and read
 * only through UTC getters, so a DST boundary can never shift one onto
 * the day before or after. Building them with the local-time `Date`
 * constructor is what makes "add 14 days" land on the 13th twice a year.
 *
 * Weekends are Saturday and Sunday. THERE IS NO HOLIDAY CALENDAR: a
 * proposal due three business days after a pick that straddles Victoria
 * Day will read one working day early. The page only ever promises "3
 * business days", which is the same promise the old calendar made, but
 * the limitation is real and is recorded in the handoff.
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

/** The date itself if it is a business day, otherwise the next one. */
export function nextBusinessDay(d: CivilDate): CivilDate {
  let out = d;
  while (isWeekend(out)) out = addDays(out, 1);
  return out;
}

/**
 * `n` business days after `d`, skipping Saturdays and Sundays.
 *
 * Counting starts the day AFTER `d`: a Monday plus three business days
 * is Thursday, not Wednesday. If `d` itself is a weekend the count still
 * starts from the following day, so a Saturday plus one is Monday.
 */
export function addBusinessDays(d: CivilDate, n: number): CivilDate {
  let out = d;
  let left = n;
  while (left > 0) {
    out = addDays(out, 1);
    if (!isWeekend(out)) left--;
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
 * Only these three facts exist: the call is 20 minutes, the proposal
 * lands within 3 business days, and kickoff is within 14 calendar days.
 * Nothing here invents a fourth.
 */
export function scheduleFrom(call: CivilDate) {
  return {
    call,
    proposal: addBusinessDays(call, 3),
    kickoff: addDays(call, 14),
  };
}
