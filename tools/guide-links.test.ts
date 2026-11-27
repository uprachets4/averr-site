/**
 * The links inside guide prose go somewhere, and the references that
 * should be links are.
 *
 * Twelve guides shipped with no way to link out of a sentence —
 * `Block` carried a plain string — so guides referred to each other in
 * words instead: "a separate guide on this site", "the free
 * findability checker on this site". Three of those were in
 * `why-your-website-isnt-on-google` alone, pointing at the two guides
 * and the tool that answer exactly what that page tells the reader to
 * go and do. The traffic arrived on the question and then had nowhere
 * to go but /contact.
 *
 * `lib/inlineLinks.ts` added `[label](/path)`. This is what keeps it
 * honest. A link that points at a route the site does not serve is
 * worse than the plain text it replaced — plain text is merely a
 * missed link, a 404 is a promise broken in public — and the phrase
 * test is what stops the next guide quietly going back to prose.
 *
 * Runs on the data, like `meta-lengths`, so it needs no build.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { GUIDES } from "../src/data/guides.ts";
import { BUILT } from "../src/data/builtByAverr.ts";
import { linksIn, plainText } from "../src/lib/inlineLinks.ts";

/** The static routes in `App.tsx`, plus the two dynamic families. */
const STATIC = new Set([
  "/",
  "/services",
  "/services/websites",
  "/services/web-apps",
  "/industries/contractors",
  "/tools/findable",
  "/tools/automation-roi",
  "/guides",
  "/work",
  "/about",
  "/contact",
  "/how-we-work",
  "/privacy",
  "/prachets",
]);

const GUIDE_PATHS = new Set(GUIDES.map((g) => `/guides/${g.slug}`));
const CASE_PATHS = new Set(BUILT.map((p) => `/work/${p.slug}`));

function resolves(to: string): boolean {
  /* A fragment on a real page is a real target: /services#marketing
     is how the guides already reach a service section. */
  const path = to.split("#")[0] || "/";
  return STATIC.has(path) || GUIDE_PATHS.has(path) || CASE_PATHS.has(path);
}

/** Every prose string in a guide, labelled by where it came from. */
function strings(): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];

  for (const g of GUIDES) {
    const push = (what: string, text: string) => out.push({ where: `${g.slug} ${what}`, text });

    for (const [i, b] of g.intro.entries()) {
      if (b.t === "ul" || b.t === "ol") b.items.forEach((x, j) => push(`intro[${i}][${j}]`, x));
      else push(`intro[${i}]`, b.text);
    }
    for (const [i, s] of g.sections.entries()) {
      push(`section[${i}].h`, s.h);
      for (const [j, b] of s.blocks.entries()) {
        if (b.t === "ul" || b.t === "ol") b.items.forEach((x, k) => push(`section[${i}][${j}][${k}]`, x));
        else push(`section[${i}][${j}]`, b.text);
      }
    }
    push("close", g.close);
  }

  return out;
}

test("every inline link points at a route the site serves", function targets() {
  const broken: string[] = [];
  for (const { where, text } of strings()) {
    for (const { to } of linksIn(text)) {
      if (!resolves(to)) broken.push(`${where} → ${to}`);
    }
  }
  assert.deepEqual(broken, [], `links to routes that do not exist:\n  ${broken.join("\n  ")}`);
});

test("no guide links to itself", function noSelfLinks() {
  const self: string[] = [];
  for (const g of GUIDES) {
    const mine = `/guides/${g.slug}`;
    const all = [
      ...g.intro,
      ...g.sections.flatMap((s) => s.blocks),
    ].flatMap((b) => (b.t === "ul" || b.t === "ol" ? b.items : [b.text]));

    for (const text of [...all, g.close]) {
      if (linksIn(text).some((l) => l.to.split("#")[0] === mine)) self.push(g.slug);
    }
  }
  assert.deepEqual(self, [], `guides linking to themselves: ${self.join(", ")}`);
});

test("no link token reaches the title or the dek", function plainMeta() {
  /* Both become plain text in a search result — the dek is the meta
     description's basis and the title is the <title>. A token here
     ships `[label](/path)` to Google. */
  const leaked = GUIDES.filter((g) => linksIn(g.title).length || linksIn(g.dek).length).map((g) => g.slug);

  assert.deepEqual(leaked, [], `link syntax in title or dek: ${leaked.join(", ")}`);
});

test("no half-written link is left in the prose", function malformed() {
  /* A token the parser does not recognise renders as literal
     brackets on the page. `](` outside a valid link is the signature
     of a typo — a missing slash, a space before the paren, a smart
     bracket pasted in from somewhere. */
  const bad: string[] = [];
  for (const { where, text } of strings()) {
    /* Remove the valid links, then look for the syntax again. */
    const rest = text.replace(/\[([^\]\n]+)\]\((\/[^)\s]*)\)/g, "$1");
    if (rest.includes("](")) bad.push(`${where}: ${rest.slice(Math.max(0, rest.indexOf("](") - 40), rest.indexOf("](") + 40)}`);
  }
  assert.deepEqual(bad, [], `malformed link syntax:\n  ${bad.join("\n  ")}`);
});

test("a guide that points at another page on the site links it", function noProseReferences() {
  /* The regression this file exists for. These phrases only ever
     introduce another page here — a guide saying "there is a guide on
     this site" and then not linking it is the exact state the inline
     link feature was added to end.
     Checked against the prose with the links taken out, so a phrase
     that sits inside a link label is fine; it is the unlinked ones
     that fail. */
  const PHRASES = [
    "guide on this site",
    "checker on this site",
    "calculator on this site",
    "elsewhere on this site",
    "another guide",
  ];

  const unlinked: string[] = [];
  for (const { where, text } of strings()) {
    /* Drop whole links, label and all: a phrase inside a label is
       already a link and must not count against us. */
    const outside = text.replace(/\[[^\]\n]+\]\(\/[^)\s]*\)/g, " ");
    for (const phrase of PHRASES) {
      if (outside.toLowerCase().includes(phrase)) unlinked.push(`${where}: "${phrase}"`);
    }
  }

  assert.deepEqual(unlinked, [], `references to other pages that are not links:\n  ${unlinked.join("\n  ")}`);
});

test("plainText leaves no markup for the word count", function counting() {
  /* `readingMinutes` reads through `plainText`, and prerender
     publishes `wordCount: readingMinutes(g) * 200` in the Article
     schema. If a path survived into the counted text the published
     figure would be wrong. */
  for (const { where, text } of strings()) {
    const plain = plainText(text);
    assert.ok(!plain.includes("]("), `${where}: markup survived plainText`);
    assert.ok(!/\]\(\//.test(plain), `${where}: a path survived plainText`);
  }
});
