/**
 * GET /api/findability?url=… → a findability report as JSON.
 *
 * Deliberately thin. Every judgement lives in api/_findability.ts,
 * which is unit-tested against fixtures, because this file cannot be
 * run in the development workspace — no `vercel dev`, and the sandbox
 * cannot reach arbitrary hosts. What is left here is fetch, call,
 * return, plus the guards below, which are the part that has to be
 * right the first time.
 *
 * This endpoint takes a URL from the public internet and fetches it
 * from inside Vercel's network, which is the shape of a server-side
 * request forgery. Treat every input as hostile:
 *
 *   - http and https only. No file:, no gopher:, no data:.
 *   - No hostname that resolves to somewhere private. `isPrivateHost`
 *     and `normaliseTarget` live in api/_findability.ts, where the
 *     tests can reach them, and their limits are documented there.
 *   - No redirects followed across hosts without re-checking.
 *   - A hard timeout and a capped read, so a slow or enormous target
 *     cannot hold the function open or exhaust its memory.
 *
 * There is no rate limiting. On this plan there is nothing built in to
 * use, and a public endpoint that fetches on demand can be used as a
 * crude proxy. The cap, timeout and fixed response shape keep the
 * damage low, but if this gets abused the fix is a rate limit keyed on
 * IP, not more validation.
 */
/* The analyser lives beside this file rather than in src/lib, which is
   where it started. Vercel does not include src/ in a function bundle:
   both "../src/lib/findability.ts" and the extensionless form deployed
   clean and then died on the first request with ERR_MODULE_NOT_FOUND
   for /var/task/src/lib/findability. Shared code for a function has to
   sit under api/, and a leading underscore keeps it from being served
   as a route of its own. */
import { analyze, isPrivateHost, normaliseTarget } from "./_findability.js";

const TIMEOUT_MS = 8000;
const MAX_BYTES = 2_000_000;
const UA = "AverrStudios-FindabilityCheck/1.0 (+https://www.averrstudios.com/tools/findable)";

async function getCapped(
  target: string,
  signal: AbortSignal
): Promise<{ status: number; finalUrl: string; body: string; bytes: number } | null> {
  let res: Response;
  try {
    res = await fetch(target, {
      signal,
      redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });
  } catch {
    return null;
  }
  /* A redirect chain can land somewhere private even when the typed
     host was fine, so the destination is re-checked rather than
     trusted. */
  try {
    if (isPrivateHost(new URL(res.url).hostname)) return null;
  } catch {
    return null;
  }
  const reader = res.body?.getReader();
  if (!reader) return { status: res.status, finalUrl: res.url, body: "", bytes: 0 };
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (bytes < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      bytes += value.byteLength;
    }
  }
  await reader.cancel().catch(() => {});
  const merged = new Uint8Array(bytes);
  let at = 0;
  for (const c of chunks) {
    merged.set(c.subarray(0, Math.min(c.byteLength, bytes - at)), at);
    at += c.byteLength;
    if (at >= bytes) break;
  }
  return {
    status: res.status,
    finalUrl: res.url,
    body: new TextDecoder("utf-8").decode(merged),
    bytes,
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      /* A report is about someone else's site at a moment in time, and
         they will re-run it after making a change. Caching it would
         show them their old score and read as the tool being broken. */
      "cache-control": "no-store",
    },
  });
}

export async function GET(req: Request): Promise<Response> {
  const raw = new URL(req.url).searchParams.get("url") ?? "";
  const target = normaliseTarget(raw);
  if (!target) {
    return json(
      { error: "Enter a website address, like example.com — public sites only." },
      400
    );
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const page = await getCapped(target.toString(), ac.signal);
    if (!page) {
      return json(
        { error: `Could not reach ${target.hostname}. Check the address, or the site may be blocking automated requests.` },
        502
      );
    }

    /* robots.txt and the sitemap are fetched from the origin the page
       actually resolved to, not the typed one — a site that redirects
       www to apex keeps its robots.txt at the destination. Both are
       optional: a failure is a finding, not an error. */
    const origin = new URL(page.finalUrl).origin;
    const [robotsRes, sitemapRes] = await Promise.all([
      getCapped(`${origin}/robots.txt`, ac.signal).catch(() => null),
      getCapped(`${origin}/sitemap.xml`, ac.signal).catch(() => null),
    ]);

    const robotsBody = robotsRes && robotsRes.status < 400 ? robotsRes.body : null;
    /* A sitemap declared in robots.txt is the one that counts; fall
       back to the conventional path only when robots names none. */
    const declared = robotsBody?.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
    let sitemapOk = Boolean(sitemapRes && sitemapRes.status < 400);
    if (!sitemapOk && declared) {
      const alt = normaliseTarget(declared);
      if (alt) {
        const r = await getCapped(alt.toString(), ac.signal).catch(() => null);
        sitemapOk = Boolean(r && r.status < 400);
      }
    }

    return json(
      analyze({
        url: target.toString(),
        finalUrl: page.finalUrl,
        status: page.status,
        html: page.body,
        robots: robotsBody,
        sitemapOk,
        bytes: page.bytes,
      })
    );
  } catch {
    return json(
      { error: `${target.hostname} took too long to respond. Try again, or check the site loads for you.` },
      504
    );
  } finally {
    clearTimeout(timer);
  }
}
