/**
 * Unit tests for the kickoff picker's date maths.
 *
 * Run with `npm run test:dates` (node's own test runner; Node strips the
 * types, so there is no build step and no extra dependency).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  addBusinessDays,
  addDays,
  civil,
  fromISO,
  isWeekend,
  longLabel,
  nextBusinessDay,
  scheduleFrom,
  toISO,
  weekdayShort,
} from "../src/lib/businessDays.ts";

test("a Friday pick: +3 business days lands on the next Wednesday", () => {
  const fri = civil(2026, 10, 9); // Friday
  assert.equal(weekdayShort(fri), "Fri");
  assert.equal(toISO(addBusinessDays(fri, 3)), "2026-10-14"); // Mon, Tue, Wed
  assert.equal(weekdayShort(addBusinessDays(fri, 3)), "Wed");
  // kickoff is CALENDAR days, so it may land on a weekend — it is a bound
  assert.equal(toISO(scheduleFrom(fri).kickoff), "2026-10-23");
});

test("a pick whose +3 crosses a weekend", () => {
  const thu = civil(2026, 10, 8); // Thursday
  // Fri, Mon, Tue — the weekend is skipped
  assert.equal(toISO(addBusinessDays(thu, 3)), "2026-10-13");
  const wed = civil(2026, 10, 7); // Wednesday
  // Thu, Fri, Mon
  assert.equal(toISO(addBusinessDays(wed, 3)), "2026-10-12");
});

test("month boundary", () => {
  const thu = civil(2026, 10, 29); // Thursday
  // Fri 30, Mon Nov 2, Tue Nov 3
  assert.equal(toISO(addBusinessDays(thu, 3)), "2026-11-03");
  assert.equal(toISO(addDays(thu, 14)), "2026-11-12");
});

test("year boundary", () => {
  const wed = civil(2026, 12, 30); // Wednesday
  // Thu 31, Fri Jan 1 (no holiday calendar), Mon Jan 4
  assert.equal(toISO(addBusinessDays(wed, 3)), "2027-01-04");
  assert.equal(toISO(addDays(wed, 14)), "2027-01-13");
  const s = scheduleFrom(civil(2026, 12, 28));
  assert.equal(toISO(s.proposal), "2026-12-31");
  assert.equal(toISO(s.kickoff), "2027-01-11");
});

test("weekends are never offered, and nextBusinessDay skips them", () => {
  const sat = civil(2026, 10, 10);
  const sun = civil(2026, 10, 11);
  assert.ok(isWeekend(sat) && isWeekend(sun));
  assert.equal(toISO(nextBusinessDay(sat)), "2026-10-12");
  assert.equal(toISO(nextBusinessDay(sun)), "2026-10-12");
  const mon = civil(2026, 10, 12);
  assert.equal(toISO(nextBusinessDay(mon)), "2026-10-12", "a business day is its own next");
});

test("a leap day survives the arithmetic", () => {
  const feb27 = civil(2028, 2, 27); // Sunday
  assert.equal(toISO(addDays(feb27, 3)), "2028-03-01");
  assert.equal(toISO(addDays(civil(2028, 2, 20), 14)), "2028-03-05");
});

test("ISO round-trips and rejects nonsense", () => {
  assert.equal(toISO(civil(2027, 1, 4)), "2027-01-04");
  assert.equal(toISO(fromISO("2027-01-04")!), "2027-01-04");
  assert.equal(fromISO("2027-02-30"), null, "a date that does not exist");
  assert.equal(fromISO("nope"), null);
});

test("labels read the civil day, not a local one", () => {
  assert.equal(longLabel(civil(2026, 10, 12)), "Monday, Oct 12");
  assert.equal(weekdayShort(civil(2026, 10, 12)), "Mon");
});
