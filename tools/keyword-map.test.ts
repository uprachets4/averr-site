/**
 * The keyword map, enforced rather than trusted.
 *
 * "One main search per page, so pages don't compete with each other"
 * is the whole reason the map exists, and it is exactly the kind of
 * rule that holds for a month and then quietly breaks when someone
 * writes a second page about websites. So it is a test, not a note.
 *
 * What this asserts:
 *
 *   1. No two pages claim the same search. Two pages targeting one
 *      query split their own signals and Google picks one, usually the
 *      wrong one — this is the failure the map is for.
 *   2. Every indexable page has a target, or is explicitly `null`.
 *      `null` says "this page is not a search target"; a missing or
 *      empty one says nobody decided.
 *   3. Targets are written in one shape — lower case, single spaces,
 *      no punctuation — so "Web Design Toronto" and "web design
 *      toronto" can never both be in the map and both look unique.
 *
 * What this deliberately does NOT assert: that a page's title or
 * description contains its target's words. That check was written,
 * and it forced bad keywords — the case files would have had to
 * target "home renovation website case study", a phrase nobody
 * searches, just to match a generated title. A target is what the
 * page should win, which is sometimes ahead of what it currently
 * says. Where the two have drifted the comment on `BuiltProject.target`
 * records it.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { META } from "../src/lib/documentMeta.ts";
import { BUILT } from "../src/data/builtByAverr.ts";

/** Every URL on the site that carries a search target decision. */
function entries(): { url: string; target: string | null }[] {
  const out: { url: string; target: string | null }[] = [];

  const routes: Record<keyof typeof META, string> = {
    home: "/",
    services: "/services",
    about: "/about",
    contact: "/contact",
    work: "/work",
    privacy: "/privacy",
    card: "/card",
    notFound: "404",
  };

  for (const key of Object.keys(META) as (keyof typeof META)[]) {
    out.push({ url: routes[key], target: META[key].target });
  }
  for (const p of BUILT) {
    out.push({ url: `/work/${p.slug}`, target: p.target });
  }
  return out;
}

test("no two pages target the same search", function unique() {
  const seen = new Map<string, string>();
  for (const { url, target } of entries()) {
    if (target === null) continue;
    const prev = seen.get(target);
    assert.equal(
      prev,
      undefined,
      `"${target}" is claimed by both ${prev} and ${url}. ` +
        `Two pages on one search compete with each other — give one of them its own.`
    );
    seen.set(target, url);
  }
});

test("every page has a target or an explicit null", function decided() {
  for (const { url, target } of entries()) {
    if (target === null) continue;
    assert.equal(
      typeof target,
      "string",
      `${url} has no search target. Give it one, or set target: null to say it is not a search page.`
    );
    assert.ok(
      target.trim().length > 0,
      `${url} has an empty search target. Set target: null if that is deliberate.`
    );
  }
});

test("targets are written in one shape", function normalised() {
  for (const { url, target } of entries()) {
    if (target === null) continue;
    assert.equal(
      target,
      target.toLowerCase(),
      `${url}: targets are lower case, so the same search can't appear twice in different cases.`
    );
    assert.ok(
      !/\s{2,}|^\s|\s$/.test(target),
      `${url}: single spaces, no leading or trailing space.`
    );
    assert.ok(
      /^[a-z0-9 ]+$/.test(target),
      `${url}: letters, digits and spaces only — punctuation makes two spellings of one search look unique.`
    );
  }
});

test("the map covers every indexable route", function complete() {
  /* 12 live URLs: 7 routes in META that are real pages (notFound is a
     status, not a URL), plus the 5 case files. If this count moves,
     a page was added or removed and the map needs the same change. */
  const urls = entries().filter((e) => e.url !== "404");
  assert.equal(urls.length, 12, `expected 12 live URLs in the keyword map, found ${urls.length}`);
});
