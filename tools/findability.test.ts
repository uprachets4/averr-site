/**
 * Tests for the findability analyser.
 *
 * This file carries more weight than a normal test suite, because the
 * analyser ships inside a Vercel function that cannot be run in this
 * workspace, and the workspace cannot fetch arbitrary sites to try it
 * against. These fixtures are the only place its judgement is exercised
 * before it reaches a preview deployment.
 *
 * So they test behaviour a user would notice — a site with nothing
 * scores badly, a well-built site scores well, broken markup is called
 * out as worse than absent markup — rather than asserting the internals.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  analyze,
  isPrivateHost,
  jsonLdNodes,
  normaliseTarget,
  type AnalyzeInput,
  type Report,
} from "../api/_findability.ts";

function input(html: string, over: Partial<AnalyzeInput> = {}): AnalyzeInput {
  return {
    url: "https://example.com",
    finalUrl: "https://example.com",
    status: 200,
    html,
    robots: "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml",
    sitemapOk: true,
    bytes: html.length,
    ...over,
  };
}

function find(r: Report, id: string) {
  const c = r.groups.flatMap((g) => g.checks).find((x) => x.id === id);
  assert.ok(c, `no check with id "${id}"`);
  return c;
}

const BARE = "<html><body><p>We do renovations. Call 416 555 0100.</p></body></html>";

const GOOD = `<!doctype html><html lang="en-CA"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Toronto Appliance Installation | Example Trades</title>
<meta name="description" content="Licensed gas fitter installing ranges, dryers and water heaters across the GTA. Same-week appointments and a straight quote on the phone.">
<link rel="canonical" href="https://example.com/">
<link rel="icon" href="/favicon.svg">
<meta property="og:title" content="Toronto Appliance Installation">
<meta property="og:image" content="https://example.com/og.png">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
 {"@type":"LocalBusiness","name":"Example Trades","telephone":"+1-416-555-0100","areaServed":"Greater Toronto Area"}
]}</script>
</head><body>
<h1>Appliance installation across the GTA</h1>
<a href="tel:+14165550100">Call now</a>
<img src="/a.webp" alt="A finished range install">
<img src="/b.webp" alt="Gas line run to code">
</body></html>`;

test("a site with nothing scores badly and says why", function bare() {
  const r = analyze(input(BARE, { robots: null, sitemapOk: false }));
  assert.ok(r.score < 40, `expected a low score, got ${r.score}`);
  assert.equal(find(r, "jsonld").status, "fail");
  assert.equal(find(r, "viewport").status, "fail");
  assert.equal(find(r, "tel").status, "fail");
  assert.equal(find(r, "sitemap").status, "fail");
  assert.equal(find(r, "h1").status, "fail");
  /* The number is useless without the reason, so every failing check
     has to carry one. */
  for (const c of r.groups.flatMap((g) => g.checks)) {
    assert.ok(c.why.length > 20, `check "${c.id}" has no usable explanation`);
    assert.ok(c.detail.length > 5, `check "${c.id}" says nothing about what was found`);
  }
});

test("a well-built site scores well", function good() {
  const r = analyze(input(GOOD));
  assert.ok(r.score >= 90, `expected a high score, got ${r.score}`);
  const failing = r.groups.flatMap((g) => g.checks).filter((c) => c.status === "fail");
  assert.equal(failing.length, 0, `unexpected failures: ${failing.map((c) => c.id).join(", ")}`);
});

test("broken structured data is called out as worse than none", function broken() {
  const bad = GOOD.replace('{"@context":"https://schema.org","@graph":[', '{"@context":"https://schema.org","@graph":[,,');
  const r = analyze(input(bad));
  const c = find(r, "jsonld");
  assert.equal(c.status, "fail");
  assert.match(c.detail, /does not parse/i);
  /* The distinction matters: a plugin emitting broken JSON-LD looks
     fine to its owner, and "you have none" would send them looking for
     the wrong thing. */
  assert.notEqual(c.detail, analyze(input(BARE)).groups[0].checks[0].detail);
});

test("structured data without a local type is a warning, not a pass", function notLocal() {
  const generic = GOOD.replace('"@type":"LocalBusiness"', '"@type":"WebSite"');
  const r = analyze(input(generic));
  assert.equal(find(r, "localtype").status, "warn");
  assert.equal(find(r, "jsonld").status, "pass");
});

test("robots.txt blocking the whole site is a failure, not a warning", function blocked() {
  const r = analyze(input(GOOD, { robots: "User-agent: *\nDisallow: /" }));
  const c = find(r, "robots");
  assert.equal(c.status, "fail");
  assert.match(c.detail, /blocks the whole site/i);
});

test("a sitemap that exists but is unlisted in robots.txt is a warning", function unlisted() {
  const r = analyze(input(GOOD, { robots: "User-agent: *\nAllow: /" }));
  assert.equal(find(r, "sitemap").status, "warn");
});

test("http rather than https fails", function insecure() {
  const r = analyze(input(GOOD, { finalUrl: "http://example.com" }));
  assert.equal(find(r, "https").status, "fail");
});

test("a dead address reports the status instead of a score", function dead() {
  const r = analyze(input("", { status: 404, html: "", robots: null, sitemapOk: false, bytes: 0 }));
  assert.match(r.headline, /404/);
});

test("titles are judged by length in both directions", function titles() {
  const short = analyze(input(GOOD.replace(/<title>[^<]*<\/title>/, "<title>Home</title>")));
  assert.equal(find(short, "title").status, "warn");
  const long = analyze(
    input(GOOD.replace(/<title>[^<]*<\/title>/, `<title>${"a".repeat(80)}</title>`))
  );
  assert.equal(find(long, "title").status, "warn");
  assert.match(find(long, "title").detail, /cut/i);
});

test("alt-text coverage degrades in steps rather than all at once", function alts() {
  const none = GOOD.replace(/ alt="[^"]*"/g, "");
  assert.equal(find(analyze(input(none)), "alt").status, "fail");
  const half = GOOD.replace(' alt="Gas line run to code"', "");
  assert.equal(find(analyze(input(half)), "alt").status, "warn");
  assert.equal(find(analyze(input(GOOD)), "alt").status, "pass");
});

test("meta tags are found whichever order the attributes come in", function attrOrder() {
  const flipped = GOOD.replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta content="width=device-width, initial-scale=1" name="viewport">'
  );
  assert.equal(find(analyze(input(flipped)), "viewport").status, "pass");
});

test("the graph is flattened out of @graph and arrays", function graph() {
  assert.equal(jsonLdNodes(GOOD).length, 1);
  const arr = `<script type="application/ld+json">[{"@type":"LocalBusiness"},{"@type":"WebSite"}]</script>`;
  assert.equal(jsonLdNodes(arr).length, 2);
  const nested = `<script type="application/ld+json">{"@graph":[{"@type":"A"},{"@type":"B"}]}</script>`;
  assert.equal(jsonLdNodes(nested).length, 2);
});

test("the report always names what it did not check", function honest() {
  const r = analyze(input(GOOD));
  assert.ok(r.notChecked.length >= 3);
  /* Page speed and the Google profile are the two things a visitor will
     assume a findability checker covers. Both need an API key this
     project does not have, and quietly omitting them would let the
     score imply a completeness it does not have. */
  assert.ok(r.notChecked.some((s) => /speed/i.test(s)), "page speed is not named");
  assert.ok(r.notChecked.some((s) => /Business Profile/i.test(s)), "the Google profile is not named");
  /* Added after the live tool reported "no tappable phone link" on a
     Framer-built client site whose case file says it has one. Whether
     that site really has the link is still unknown, which is exactly
     the point: a checker that reads server HTML and does not say so
     will keep producing confident false negatives on every JS-rendered
     site, and those are most small-business sites now. */
  assert.ok(
    r.notChecked.some((s) => /JavaScript/i.test(s)),
    "the JS-rendering limit is not named, so false negatives read as findings"
  );
});

test("it survives the studio's own home page", function dogfood() {
  /* The one real document available in this workspace. Not asserting a
     score — that would break whenever the site changes — only that the
     analyser does not throw and produces a complete report. */
  const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "index.html");
  if (!existsSync(dist)) {
    console.log("  (no dist/index.html — run npm run build to include this check)");
    return;
  }
  const html = readFileSync(dist, "utf8");
  const r = analyze(input(html, { url: "https://www.averrstudios.com", finalUrl: "https://www.averrstudios.com" }));
  assert.ok(r.groups.length === 4);
  assert.ok(r.score >= 0 && r.score <= 100);
  for (const c of r.groups.flatMap((g) => g.checks)) {
    assert.ok(["pass", "warn", "fail"].includes(c.status));
  }
  console.log(`  averrstudios.com scores ${r.score}/100 against its own checker`);
});

/* The guards below protect a public endpoint that fetches whatever it
   is given from inside Vercel's network — the shape of a server-side
   request forgery. They are the one part of this feature where being
   wrong matters more than being incomplete, so they get the most
   adversarial tests in the file. */

test("private and loopback hosts are refused", function ssrf() {
  const blocked = [
    "localhost",
    "foo.localhost",
    "printer.local",
    "svc.internal",
    "127.0.0.1",
    "127.1.1.1",
    "0.0.0.0",
    "10.0.0.1",
    "10.255.255.255",
    "172.16.0.1",
    "172.31.255.1",
    "192.168.1.1",
    "169.254.169.254", // cloud metadata, the one that matters most
    "::1",
    "fd00::1",
    "fe80::1",
    "239.1.1.1",
  ];
  for (const h of blocked) {
    assert.equal(isPrivateHost(h), true, `${h} should be refused`);
  }
});

test("ordinary public hosts are allowed", function allowed() {
  for (const h of ["example.com", "www.example.co.uk", "8.8.8.8", "172.32.0.1", "11.0.0.1", "192.167.1.1"]) {
    assert.equal(isPrivateHost(h), false, `${h} should be allowed`);
  }
});

test("ranges adjacent to the private blocks are not over-blocked", function boundaries() {
  /* 172.16-31 is private; 172.15 and 172.32 are not. Getting this
     wrong in the generous direction breaks real sites. */
  assert.equal(isPrivateHost("172.15.0.1"), false);
  assert.equal(isPrivateHost("172.32.0.1"), false);
  assert.equal(isPrivateHost("192.169.1.1"), false);
  assert.equal(isPrivateHost("169.253.1.1"), false);
});

test("only http and https survive normalisation", function schemes() {
  for (const bad of ["file:///etc/passwd", "gopher://example.com", "data:text/html,x", "javascript:alert(1)"]) {
    assert.equal(normaliseTarget(bad), null, `${bad} should be refused`);
  }
});

test("a bare hostname is assumed https, never http", function bare2() {
  const u = normaliseTarget("example.com");
  assert.ok(u);
  assert.equal(u.protocol, "https:");
  /* Assuming http would downgrade the very connection being judged and
     then report it as insecure. */
  assert.equal(u.hostname, "example.com");
});

test("normalisation refuses single-label and private hosts", function normBlocks() {
  assert.equal(normaliseTarget("localhost"), null);
  assert.equal(normaliseTarget("http://169.254.169.254/latest/meta-data/"), null);
  assert.equal(normaliseTarget("intranet"), null);
  assert.equal(normaliseTarget(""), null);
  assert.equal(normaliseTarget("   "), null);
});

test("an explicit http URL is kept as http so it can be marked insecure", function keepHttp() {
  const u = normaliseTarget("http://example.com");
  assert.ok(u);
  assert.equal(u.protocol, "http:");
  const r = analyze(input(GOOD, { finalUrl: u.toString() }));
  assert.equal(find(r, "https").status, "fail");
});

test("HTML entities are decoded before being shown or counted", function entities() {
  /* A title with an ampersand was reported as "Apps &amp; AI" and
     counted five characters too long. Any business with "&" in its
     name hit it, and it reads as the tool being broken. */
  const html = GOOD.replace(
    /<title>[^<]*<\/title>/,
    "<title>Walls &amp; Floors &#8212; Toronto Renovations &quot;done right&quot;</title>"
  );
  const c = find(analyze(input(html)), "title");
  assert.match(c.detail, /Walls & Floors/);
  assert.doesNotMatch(c.detail, /&amp;|&quot;|&#/);
  assert.match(c.detail, /"done right"/);
  /* And the count reflects real characters, not entity source. */
  const shown = c.detail.match(/(\d+) characters/);
  assert.ok(shown);
  assert.ok(Number(shown[1]) < 60, `counted ${shown[1]}, which still includes entity source`);
});
