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
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { META } from "../src/lib/documentMeta.ts";
import { BUILT } from "../src/data/builtByAverr.ts";
import { GUIDES } from "../src/data/guides.ts";

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
    /* The key is `card`; the route it ships at is /prachets. The
       sitemap check below is what caught that mismatch. */
    card: "/prachets",
    guides: "/guides",
    notFound: "404",
  };

  for (const key of Object.keys(META) as (keyof typeof META)[]) {
    out.push({ url: routes[key], target: META[key].target });
  }
  for (const p of BUILT) {
    out.push({ url: `/work/${p.slug}`, target: p.target });
  }
  /* Guides are the fastest-growing set of pages on the site and the
     most likely to collide — one a week, all about the same handful of
     subjects. They are exactly what the uniqueness check is for. */
  for (const g of GUIDES) {
    out.push({ url: `/guides/${g.slug}`, target: g.target });
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

test("the map covers every URL in the sitemap", function complete() {
  /* Counting the map against itself proves nothing — both sides come
     from the same arrays. The sitemap is the independent list: it is
     what the build actually shipped and what Google is told to crawl,
     so a URL in it with no entry here is a page nobody chose a search
     for, and an entry here that never shipped is a stale decision.
     Skipped when there is no build to compare against. */
  const sitemap = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "sitemap.xml");
  if (!existsSync(sitemap)) {
    console.log("  (no dist/sitemap.xml — run npm run build to include this check)");
    return;
  }

  const shipped = new Set(
    [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      new URL(m[1]).pathname.replace(/(.)\/$/, "$1")
    )
  );
  const mapped = new Set(entries().filter((e) => e.url !== "404").map((e) => e.url));

  const missing = [...shipped].filter((u) => !mapped.has(u));
  const stale = [...mapped].filter((u) => !shipped.has(u));

  assert.deepEqual(missing, [], `in the sitemap but not the keyword map: ${missing.join(", ")}`);
  assert.deepEqual(stale, [], `in the keyword map but not the sitemap: ${stale.join(", ")}`);
});
