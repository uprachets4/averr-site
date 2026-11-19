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
import { PILLARS } from "../src/data/pillars.ts";
import type { ServiceId } from "../src/data/serviceColors.ts";

/**
 * Every URL on the site that carries a search target decision.
 *
 * `shipped: false` marks a decision with no page behind it yet — a
 * pillar that has reserved its search while it is being built. Those
 * take part in the uniqueness check, which is the point of reserving a
 * phrase, but are excluded from the sitemap comparison, which is about
 * what actually went live.
 */
function entries(): { url: string; target: string | null; shipped?: boolean }[] {
  const out: { url: string; target: string | null; shipped?: boolean }[] = [];

  const routes: Record<keyof typeof META, string> = {
    home: "/",
    services: "/services",
    serviceWebsites: "/services/websites",
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
  /* Pillars that have reserved a search but have no page yet. The
     phrase is decided once, so a guide written next week cannot
     quietly claim the search its own pillar is for.
     A live pillar is not pushed here: it has a META entry of its own
     above, which reads its target straight off the registry, so adding
     it again would be the same decision counted twice. */
  for (const id of Object.keys(PILLARS) as ServiceId[]) {
    const p = PILLARS[id];
    if (p.live || p.target === null) continue;
    out.push({ url: `/services/${p.slug}`, target: p.target, shipped: false });
  }
  return out;
}

/* ── the pillar hierarchy ───────────────────────────────────────────
   Uniqueness stops two pages fighting over one search. These rules
   stop the other failure, which is the one that actually looked
   tempting: four service pages built off one skeleton with the noun
   swapped, each with nothing behind it. That is the doorway-page
   pattern and Google filters it. So a pillar has to earn its page. */

/**
 * Case studies where this service was the job, not a side effect.
 *
 * Counting every tag was the first version of this rule and it was
 * wrong in a way worth recording: by tag counts Marketing had two
 * case studies and read as ready to ship a page, when both were build
 * engagements that happened to include a growth phase. A service page
 * needs work where that service was what the client hired for, so
 * this counts lead appearances only — `BuiltProject.svc[0]`.
 */
function proofFor(id: ServiceId) {
  return BUILT.filter((p) => p.svc[0] === id);
}

/** Every case study that touched this service, lead or not. Context
 *  for the readiness report; not what the threshold is measured on. */
function touchedBy(id: ServiceId) {
  return BUILT.filter((p) => p.svc.includes(id));
}

/** Guides that hand their reader up to this service. */
function clusterFor(id: ServiceId) {
  return GUIDES.filter((g) => g.svc.includes(id));
}

/* One guide is a page with a link on it. Two is the smallest thing
   that behaves like a cluster: a reader who bounces off the first has
   somewhere else to go, and the pillar has a reason to exist beyond
   the nav. */
const MIN_GUIDES = 2;
const MIN_PROOF = 1;

const ids = Object.keys(PILLARS) as ServiceId[];

test("a live pillar is a ready pillar", function ready() {
  for (const id of ids) {
    const p = PILLARS[id];
    if (!p.live) continue;
    const proof = proofFor(id);
    const cluster = clusterFor(id);
    assert.ok(
      proof.length >= MIN_PROOF,
      `/services/${p.slug} is live with ${proof.length} case studies. ` +
        `A service page with no work behind it is a claim, not a page — tag a case study with "${id}" or take the page down.`
    );
    assert.ok(
      cluster.length >= MIN_GUIDES,
      `/services/${p.slug} is live with ${cluster.length} supporting guide(s), needs ${MIN_GUIDES}. ` +
        `A pillar with no cluster is a leaf: nothing links up to it and it earns nothing. Write the guides first.`
    );
    assert.equal(
      typeof p.target,
      "string",
      `/services/${p.slug} is live but owns no search. Give it one — that is what the page is for.`
    );
  }
});

test("a pillar that is not live says what it is waiting on", function honest() {
  for (const id of ids) {
    const p = PILLARS[id];
    if (p.live) continue;
    assert.ok(
      p.waitingOn && p.waitingOn.trim().length > 0,
      `${id} has no page and no reason recorded. Say what it is waiting on, so the next person decides rather than guesses.`
    );
  }
});

test("every guide names a service it supports", function clustered() {
  for (const g of GUIDES) {
    assert.ok(
      Array.isArray(g.svc) && g.svc.length > 0,
      `/guides/${g.slug} supports no service. A guide that sells nothing is traffic with nowhere to go — name the pillar it hands the reader to.`
    );
  }
});

test("every guide closes in its own words", function ownCloser() {
  /* The closing paragraph was hardcoded in the page for a while, so
     all four guides offered to set up a Google Business Profile and
     three of them were closing on a subject the reader had not been
     reading about. Requiring the copy to be present and to differ
     from every other guide's is what catches that: identical closing
     copy across two guides is the signature of exactly this mistake,
     whether it comes from a shared constant or a paste. */
  const seen = new Map<string, string>();
  for (const g of GUIDES) {
    const close = (g.close ?? "").trim();
    assert.ok(
      close.length > 0,
      `/guides/${g.slug} has no closing copy. That is the paragraph a convinced reader sees last — write it for this guide.`
    );
    const first = seen.get(close);
    assert.equal(
      first,
      undefined,
      `/guides/${g.slug} and /guides/${first} close with identical copy. One of them is talking about the wrong subject.`
    );
    seen.set(close, g.slug);
  }
});

test("no guide targets its own pillar's search", function noCannibalising() {
  for (const g of GUIDES) {
    for (const id of g.svc) {
      const p = PILLARS[id];
      if (p.target === null) continue;
      assert.notEqual(
        g.target,
        p.target,
        `/guides/${g.slug} and /services/${p.slug} both target "${g.target}". ` +
          `A cluster page competing with its own pillar is the worst version of this: they split the signal and the weaker page usually wins.`
      );
    }
  }
});

test("only live pillars ship a page", function noGhosts() {
  const sitemap = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "sitemap.xml");
  if (!existsSync(sitemap)) {
    console.log("  (no dist/sitemap.xml — run npm run build to include this check)");
    return;
  }
  const shipped = new Set(
    [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  );
  for (const id of ids) {
    const p = PILLARS[id];
    if (p.live) continue;
    assert.ok(
      !shipped.has(`/services/${p.slug}`),
      `/services/${p.slug} is in the sitemap but PILLARS.${id}.live is false. ` +
        `Either the page is real and the flag is stale, or a page shipped that nobody decided to ship.`
    );
  }
});

test("the pillars that are ready but not built", function todo() {
  /* Not a failure: a report. The readiness table is the thing that
     decides what to write next, and deriving it here means it cannot
     drift from the data the way a note in a doc would. */
  const lines = ids.map(function row(id) {
    const p = PILLARS[id];
    const proof = proofFor(id).length;
    const touched = touchedBy(id).length;
    const cluster = clusterFor(id).length;
    const state = p.live
      ? "live"
      : proof >= MIN_PROOF && cluster >= MIN_GUIDES
        ? "READY — build it"
        : `waiting (${[
            proof < MIN_PROOF ? "lead proof" : null,
            cluster < MIN_GUIDES ? `${MIN_GUIDES - cluster} more guide(s)` : null,
          ]
            .filter(Boolean)
            .join(", ")})`;
    return `    ${id.padEnd(13)} ${proof} led (${touched} touched), ${cluster} guides → ${state}`;
  });
  console.log("  pillar readiness:\n" + lines.join("\n"));
  assert.ok(true);
});

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
  /* `shipped: false` is a reserved search with no page yet — a
     decision, not a stale entry, so it is not compared here. */
  const mapped = new Set(
    entries()
      .filter((e) => e.url !== "404" && e.shipped !== false)
      .map((e) => e.url)
  );

  const missing = [...shipped].filter((u) => !mapped.has(u));
  const stale = [...mapped].filter((u) => !shipped.has(u));

  assert.deepEqual(missing, [], `in the sitemap but not the keyword map: ${missing.join(", ")}`);
  assert.deepEqual(stale, [], `in the keyword map but not the sitemap: ${stale.join(", ")}`);
});
