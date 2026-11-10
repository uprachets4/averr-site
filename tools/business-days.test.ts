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
  HOLIDAYS,
  holidayName,
  isBusinessDay,
  isWeekend,
  longLabel,
  nextBusinessDay,
  scheduleFrom,
  toISO,
  weekdayLong,
  weekdayShort,
} from "../src/lib/businessDays.ts";

test("a Friday pick: +3 business days lands on the next Wednesday", () => {
  const fri = civil(2026, 10, 9); // Friday
  assert.equal(weekdayShort(fri), "Fri");
  // Mon Oct 12 is Thanksgiving, so: Tue 13, Wed 14, Thu 15
  assert.equal(toISO(addBusinessDays(fri, 3)), "2026-10-15");
  assert.equal(weekdayShort(addBusinessDays(fri, 3)), "Thu");
  // kickoff is CALENDAR days, so it may land on a weekend — it is a bound
  assert.equal(toISO(scheduleFrom(fri).kickoff), "2026-10-23");
});

test("a pick whose +3 crosses a weekend", () => {
  const thu = civil(2026, 10, 8); // Thursday
  // Fri 9, (Sat/Sun), (Mon 12 Thanksgiving), Tue 13, Wed 14
  assert.equal(toISO(addBusinessDays(thu, 3)), "2026-10-14");
  // a clean weekend with no holiday in it: Thu Nov 5 -> Fri 6, Mon 9, Tue 10
  assert.equal(toISO(addBusinessDays(civil(2026, 11, 5), 3)), "2026-11-10");
});

test("month boundary", () => {
  const thu = civil(2026, 10, 29); // Thursday
  // Fri 30, Mon Nov 2, Tue Nov 3
  assert.equal(toISO(addBusinessDays(thu, 3)), "2026-11-03");
  assert.equal(toISO(addDays(thu, 14)), "2026-11-12");
});

test("year boundary", () => {
  const wed = civil(2026, 12, 30); // Wednesday
  // Thu 31, (Fri Jan 1 is New Year's Day), Mon Jan 4, Tue Jan 5
  assert.equal(toISO(addBusinessDays(wed, 3)), "2027-01-05");
  assert.equal(toISO(addDays(wed, 14)), "2027-01-13");
  const s = scheduleFrom(civil(2026, 12, 28));
  // Mon 28 -> Tue 29, Wed 30, Thu 31 (Jan 1 is the next year's holiday)
  assert.equal(toISO(s.proposal), "2026-12-31");
  assert.equal(toISO(s.kickoff), "2027-01-11");
});

test("nextBusinessDay skips weekends AND stat holidays", () => {
  const sat = civil(2026, 10, 10);
  const sun = civil(2026, 10, 11);
  assert.ok(isWeekend(sat) && isWeekend(sun));
  // Mon Oct 12 2026 is Thanksgiving, so the next business day is Tuesday
  assert.equal(toISO(nextBusinessDay(sat)), "2026-10-13");
  assert.equal(toISO(nextBusinessDay(sun)), "2026-10-13");
  const tue = civil(2026, 10, 13);
  assert.equal(toISO(nextBusinessDay(tue)), "2026-10-13", "a business day is its own next");
});

test("a SATURDAY call counts from the following Monday", () => {
  // Sat Nov 7 2026 -> clock starts Mon Nov 9 -> Tue 10, Wed 11
  const sat = civil(2026, 11, 7);
  assert.equal(weekdayLong(sat), "Saturday");
  assert.equal(toISO(addBusinessDays(sat, 3)), "2026-11-11");
  assert.equal(weekdayLong(addBusinessDays(sat, 3)), "Wednesday");
  // and kickoff is plain calendar days from the call itself
  assert.equal(toISO(scheduleFrom(sat).kickoff), "2026-11-21");
});

test("a SUNDAY call lands on the same Wednesday as the Saturday before it", () => {
  const sun = civil(2026, 11, 8);
  assert.equal(weekdayLong(sun), "Sunday");
  assert.equal(toISO(addBusinessDays(sun, 3)), "2026-11-11");
  // a Monday call starts the same day, so it lands a day earlier
  assert.equal(toISO(addBusinessDays(civil(2026, 11, 9), 3)), "2026-11-12");
});

test("a +3 that straddles a stat holiday loses that day", () => {
  // Thanksgiving Mon Oct 12 2026. A Friday Oct 9 call: Tue 13, Wed 14, Thu 15
  const fri = civil(2026, 10, 9);
  assert.equal(holidayName(civil(2026, 10, 12)), "Thanksgiving");
  assert.equal(toISO(addBusinessDays(fri, 3)), "2026-10-15");
  // Christmas Fri 25 + Boxing Sat 26 2026: a Wed Dec 23 call -> Thu 24, Mon 28, Tue 29
  assert.equal(toISO(addBusinessDays(civil(2026, 12, 23), 3)), "2026-12-29");
  // Good Friday Apr 3 2026: a Wed Apr 1 call -> Thu 2, Mon 6, Tue 7
  assert.equal(toISO(addBusinessDays(civil(2026, 4, 1), 3)), "2026-04-07");
});

test("the holiday table is internally consistent", () => {
  // every rule-based holiday must fall on the weekday its rule names
  const mondays = ["Family Day", "Victoria Day", "Labour Day", "Thanksgiving"];
  for (const [iso, name] of Object.entries(HOLIDAYS)) {
    const d = fromISO(iso);
    assert.ok(d, `${iso} is a real date`);
    assert.equal(isBusinessDay(d!), false, `${name} is not a business day`);
    if (mondays.includes(name)) {
      assert.equal(weekdayLong(d!), "Monday", `${name} ${iso} must be a Monday`);
    }
    if (name === "Good Friday") {
      assert.equal(weekdayLong(d!), "Friday", `Good Friday ${iso} must be a Friday`);
    }
  }
  // both years are covered
  assert.equal(Object.keys(HOLIDAYS).filter((k) => k.startsWith("2026")).length, 9);
  assert.equal(Object.keys(HOLIDAYS).filter((k) => k.startsWith("2027")).length, 9);
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
