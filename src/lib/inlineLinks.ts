/**
 * Inline links inside guide prose.
 *
 * Twelve guides shipped with no way to link out of a sentence. `Block`
 * carried `text: string` and nothing else, so a guide that wanted to
 * point at another guide had to say so in words: "a separate guide on
 * this site", "the free findability checker on this site", three of
 * them in `why-your-website-isnt-on-google` alone. The references were
 * written; the links were not possible.
 *
 * The shape of the fix matters. Turning `text` into an `Inline[]`
 * would be the tidier type and would rewrite every block in a 115 KB
 * data file — around 13,000 words of prose restructured so that
 * fifteen of them could be links. A token inside the existing string
 * leaves the prose alone:
 *
 *     { t: "p", text: "which is [a separate guide](/guides/set-up-google-search-console)." }
 *
 * Deliberately narrower than Markdown:
 *
 * - Internal paths only. The target must start with `/`, so no scheme
 *   can appear in a guide — no `javascript:`, no off-site link added
 *   by editing prose. External references stay plain text, as they are
 *   today.
 * - No nesting, no emphasis, no images. One square-bracket label, one
 *   parenthesised path. Anything else is left as literal text rather
 *   than guessed at.
 * - Not allowed in `title` or `dek`. Those feed the `<title>` and the
 *   meta description, which are plain text, and a token would ship raw
 *   into a search result. `tools/guide-links.test.ts` fails the build
 *   if one appears there.
 *
 * `plainText` is the other half of the feature. `readingMinutes`
 * counts words by splitting on whitespace, and prerender publishes
 * `wordCount: readingMinutes(g) * 200` in the Article schema. Counting
 * `](/guides/what-to-put-on-a-contractor-website)` as words would
 * inflate both, so every consumer that wants the prose rather than the
 * markup reads it through here.
 */

/** One `[label](/path)`. The path is anchored to `/` on purpose. */
const TOKEN = /\[([^\]\n]+)\]\((\/[^)\s]*)\)/g;

/** A run of prose, or a run of prose that links somewhere. */
export type Segment = { text: string; to?: string };

/**
 * Split prose into segments. Text with no token comes back as a single
 * segment, which is the common case — most blocks have no link.
 */
export function parseInline(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;

  for (const m of text.matchAll(TOKEN)) {
    const at = m.index;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push({ text: m[1], to: m[2] });
    last = at + m[0].length;
  }

  if (last < text.length) out.push({ text: text.slice(last) });
  /* An empty string still has to render as something, and callers
     should not have to special-case an empty array. */
  return out.length ? out : [{ text }];
}

/** The prose with each token replaced by its label — no paths, no brackets. */
export function plainText(text: string): string {
  return text.replace(TOKEN, "$1");
}

/** Every link a string carries, in document order. */
export function linksIn(text: string): { label: string; to: string }[] {
  return [...text.matchAll(TOKEN)].map((m) => ({ label: m[1], to: m[2] }));
}

/** True if the string contains at least one token. Used by the tests. */
export function hasLink(text: string): boolean {
  return linksIn(text).length > 0;
}
