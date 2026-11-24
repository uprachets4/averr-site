/**
 * Titles and descriptions that survive the search result.
 *
 * A title past roughly 60 characters is trimmed with an ellipsis in
 * Google's results, and a description past roughly 158 is cut. Both
 * limits are soft — Google measures pixels, not characters, and
 * rewrites titles when it feels like it — so these are written as the
 * conservative character counts the whole industry uses rather than
 * as anything Google guarantees.
 *
 * This exists because the rule had already broken everywhere before
 * anyone measured. On 23 Nov 2026, ten of twenty-six pages had titles
 * Google would cut, and eighteen had descriptions that were either
 * over the limit or being clipped mid-sentence by our own code —
 * including every case study, where the clip removed the one clause
 * saying whose work it was. Section 1 of the SEO checklist had
 * "unique title and description on every page" marked done, and it
 * was true; nobody had asked whether they fit.
 *
 * Derived from the data rather than from a build, so it runs without
 * `npm run build` and fails in the same second the copy is written.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { META, TITLE_MAX, DESCRIPTION_MAX, caseMeta, guideMeta } from "../src/lib/documentMeta.ts";
import { GUIDES } from "../src/data/guides.ts";
import { BUILT } from "../src/data/builtByAverr.ts";

type Meta = { where: string; title: string; description: string };

/** Every page that carries a title and a description, from its source. */
function all(): Meta[] {
  const out: Meta[] = [];

  for (const [key, m] of Object.entries(META)) {
    out.push({ where: `META.${key}`, title: m.title, description: m.description });
  }
  for (const g of GUIDES) {
    const m = guideMeta(g);
    out.push({ where: `guide:${g.slug}`, title: m.title, description: m.description });
  }
  for (const p of BUILT) {
    const m = caseMeta(p);
    out.push({ where: `case:${p.name}`, title: m.title, description: m.description });
  }

  return out;
}

test("every title fits a search result", function titles() {
  const over = all()
    .filter((m) => m.title.length > TITLE_MAX)
    .map((m) => `${m.where} (${m.title.length})`);

  assert.deepEqual(over, [], `titles past ${TITLE_MAX} characters: ${over.join(", ")}`);
});

test("every description fits a search result", function descriptions() {
  const over = all()
    .filter((m) => m.description.length > DESCRIPTION_MAX)
    .map((m) => `${m.where} (${m.description.length})`);

  assert.deepEqual(over, [], `descriptions past ${DESCRIPTION_MAX} characters: ${over.join(", ")}`);
});

test("no description was clipped mid-sentence", function notClipped() {
  /* A trailing ellipsis means a generator ran out of room and cut the
     copy rather than the copy being written to fit. The reader sees
     half a sentence in the result, and whatever the sentence was
     building to — on the case studies, the credit — never arrives. */
  const clipped = all()
    .filter((m) => m.description.trimEnd().endsWith("…"))
    .map((m) => m.where);

  assert.deepEqual(clipped, [], `clipped descriptions: ${clipped.join(", ")}`);
});

test("no two pages share a title or a description", function unique() {
  /* Section 1 of the SEO checklist claims this. A claim in a document
     is not a property of the site. */
  for (const field of ["title", "description"] as const) {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const m of all()) {
      const prior = seen.get(m[field]);
      if (prior) clashes.push(`${field}: ${prior} and ${m.where}`);
      else seen.set(m[field], m.where);
    }
    assert.deepEqual(clashes, [], clashes.join("; "));
  }
});
