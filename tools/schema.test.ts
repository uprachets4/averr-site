/**
 * Every indexable page tells Google what this business is.
 *
 * Google reads each page's structured data on its own. An `@id`
 * pointing at a node defined on a different page does not resolve,
 * which is a quiet failure: the markup looks correct, the reference
 * is well-formed, and the node it names is simply not there.
 *
 * On 23 Nov 2026 that was true of seven pages. The five case studies
 * each carried `creator: {"@id": …#studio}` with no studio node on
 * the page, /prachets carried the founder and nothing else, and
 * /privacy carried no structured data at all. The findability checker
 * scored them 91 and 79 where every page that did carry the node
 * scored 97. The fix is one line in `prerender.mjs`; this is what
 * stops the next route definition from quietly going without.
 *
 * Reads the built output rather than the route table, because the
 * node is added at render time and the built HTML is what ships.
 * Skipped when there is no build to read, like the sitemap check in
 * `keyword-map.test.ts`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

/** Every built HTML file, with the 404 left out — it is noindex. */
function pages(): { url: string; html: string }[] {
  const out: { url: string; html: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "index.html") {
        out.push({ url: full.slice(DIST.length).replace(/\/index\.html$/, "") || "/", html: readFileSync(full, "utf8") });
      }
    }
  };
  walk(DIST);
  return out;
}

/** The @type of every node in a page's JSON-LD, flattened. */
function types(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const parsed = JSON.parse(m[1].replaceAll("\\u003c", "<")) as Record<string, unknown>;
    const nodes = (parsed["@graph"] as Record<string, unknown>[]) ?? [parsed];
    for (const n of nodes) out.push(String(n["@type"]));
  }
  return out;
}

test("every indexable page carries the business node", function studioEverywhere() {
  if (!existsSync(DIST)) {
    console.log("  (no dist — run npm run build to include this check)");
    return;
  }

  const missing = pages()
    .filter((p) => !p.html.includes('name="robots" content="noindex"'))
    .filter((p) => !types(p.html).includes("ProfessionalService"))
    .map((p) => p.url);

  assert.deepEqual(missing, [], `pages with no ProfessionalService node: ${missing.join(", ")}`);
});

test("no page claims a reference it does not carry", function referencesResolve() {
  /* The failure this file exists for, stated generally: an `@id`
     referenced inside a page's graph must also be defined in that
     page's graph. A reference to a node on another page is not a
     reference Google can follow. */
  if (!existsSync(DIST)) return;

  const dangling: string[] = [];
  for (const p of pages()) {
    for (const m of p.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      const raw = m[1].replaceAll("\\u003c", "<");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const nodes = (parsed["@graph"] as Record<string, unknown>[]) ?? [parsed];
      const defined = new Set(nodes.map((n) => n["@id"]).filter(Boolean) as string[]);
      /* Every "@id" that appears as a lone reference: an object whose
         only key is @id. Those are pointers, not definitions. */
      for (const ref of raw.matchAll(/\{"@id":"([^"]+)"\}/g)) {
        if (!defined.has(ref[1])) dangling.push(`${p.url} → ${ref[1]}`);
      }
    }
  }

  assert.deepEqual(dangling, [], `references with no node on the same page:\n  ${dangling.join("\n  ")}`);
});
