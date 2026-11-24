/**
 * The findability analyser.
 *
 * A pure function from already-fetched inputs to a report. Nothing in
 * here does IO, which is deliberate and is most of the reason the file
 * exists separately from `api/findability.ts`.
 *
 * It sits under api/ rather than src/lib because Vercel does not
 * include src/ in a function bundle — the route deployed clean twice
 * and died on the first request with ERR_MODULE_NOT_FOUND. The leading
 * underscore keeps it from being served as a route. src/ imports only
 * the `Report` type from here, which is erased at build time.
 *
 * Two constraints shaped it:
 *
 * 1. A Vercel function cannot be run in this workspace, and the
 *    workspace cannot fetch arbitrary sites to test against. So the
 *    part that can be tested is made as large as possible and the part
 *    that cannot — fetch, call, return — is kept to a few lines. All of
 *    the judgement is here, exercised against fixtures in
 *    `tools/findability.test.ts`.
 *
 * 2. No API keys. Real speed measurement needs the PageSpeed Insights
 *    API and Google Business Profile completeness needs Places; both
 *    need a key that does not exist in this project as far as anyone
 *    here can confirm. Rather than fake either — a made-up performance
 *    grade would be worse than none — the report names them in
 *    `notChecked` and the page says so out loud.
 *
 * What is left is still worth running: whether a search engine can tell
 * who this business is, where it works and what pages exist. For a
 * local business that is most of the battle, and it is all legible in
 * the HTML.
 *
 * Scoring is deliberately blunt. A pass is 2, a warning 1, a failure 0,
 * out of twice the number of checks. No weighting, because a weighted
 * score invites the question of who chose the weights, and the per-check
 * list is the actually useful output — the number exists so the page has
 * something to lead with and something to share.
 */

/**
 * Hosts that must never be fetched, however they are spelled.
 *
 * This lives here rather than next to the fetch in `api/findability.ts`
 * for one reason: it is the security-critical part, and `api/` is
 * neither type-checked by `tsc -b` nor runnable in this workspace. The
 * guard belongs where it can be exercised by tests.
 *
 * It checks the literal host, which stops localhost, the loopback and
 * RFC1918 ranges, and the cloud metadata address at 169.254.169.254. It
 * does NOT stop a public hostname with a private A record — closing
 * that means resolving the name and checking the address before
 * connecting, and `fetch` offers no hook for it. Accepted because the
 * endpoint returns a fixed-shape report rather than the response body,
 * so a successful probe of an internal service yields a score and a
 * list of missing meta tags, not its contents.
 */
export function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (!h) return true;
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".internal") || h.endsWith(".local"))
    return true;
  if (h === "::1" || h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  const v4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = Number(v4[1]);
    const b = Number(v4[2]);
    if (a === 0 || a === 127 || a === 10) return true;
    if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast and reserved
  }
  return false;
}

/**
 * What the visitor typed, as a URL worth fetching, or null.
 *
 * Bare hostnames are assumed https rather than rejected, because
 * someone checking their own site writes "example.com". Never http:
 * that would silently downgrade the very connection being judged.
 */
export function normaliseTarget(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (isPrivateHost(u.hostname)) return null;
  /* A single-label host is either internal or a typo; neither is a
     site a member of the public is asking about. */
  if (!u.hostname.includes(".")) return null;
  return u;
}

export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  /** What was found, in the business owner's terms. */
  detail: string;
  /** Why it matters. Shown under the detail, one sentence. */
  why: string;
};

export type Group = {
  id: string;
  title: string;
  checks: Check[];
};

export type Report = {
  url: string;
  /** Where the request actually landed, if it redirected. */
  finalUrl: string;
  score: number;
  /** Out of this. */
  outOf: number;
  headline: string;
  groups: Group[];
  /** Named on the page, so the gaps are stated rather than implied. */
  notChecked: string[];
};

export type AnalyzeInput = {
  /** What the visitor typed, normalised to an absolute URL. */
  url: string;
  finalUrl: string;
  status: number;
  html: string;
  /** Body of /robots.txt, or null if it could not be fetched. */
  robots: string | null;
  /** Whether a sitemap URL responded with a 2xx. */
  sitemapOk: boolean;
  /** Bytes of HTML, before any assets. */
  bytes: number;
};

/* Matching is done with regular expressions rather than a parser. The
   input is one HTML document fetched over the network, the questions
   asked of it are shallow (is there a viewport tag, is there a tel:
   link), and pulling a DOM implementation into a serverless function
   to answer them would cost more in cold start than it returns. Where
   a regex is genuinely too weak — the JSON-LD graph — the block is
   extracted and handed to JSON.parse, which is a real parser. */

/**
 * Turn HTML entities back into characters.
 *
 * Extracted text is shown to the visitor verbatim and counted for
 * length, so leaving it encoded breaks both: a title containing an
 * ampersand was reported as "Apps &amp; AI Automation" and counted five
 * characters too long. Any business with an "&" in its name hit this,
 * which reads as the tool being broken rather than their site.
 *
 * Only the five XML entities plus numeric references, which is what a
 * title or meta description realistically carries. No general-purpose
 * table: this is not rendering a document, it is tidying one attribute.
 */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    /* Ampersand last: decoding it first would turn "&amp;lt;" into "<". */
    .replace(/&amp;/g, "&");
}

function tag(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? decodeEntities(m[1]).trim() : null;
}

function metaContent(html: string, name: string): string | null {
  const byName = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*name=["']${name}["']`,
    "i"
  );
  return tag(html, byName) ?? tag(html, contentFirst);
}

function propContent(html: string, prop: string): string | null {
  const byProp = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*property=["']${prop}["']`,
    "i"
  );
  return tag(html, byProp) ?? tag(html, contentFirst);
}

/** Every JSON-LD block that parses, flattened out of any @graph. */
export function jsonLdNodes(html: string): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const b of blocks) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(b[1]);
    } catch {
      /* A block that does not parse is reported as a failed check
         rather than thrown — a business owner whose plugin emits
         broken JSON-LD needs to be told, not given an error page. */
      continue;
    }
    const queue = Array.isArray(parsed) ? [...parsed] : [parsed];
    while (queue.length) {
      const n = queue.shift();
      if (!n || typeof n !== "object") continue;
      const node = n as Record<string, unknown>;
      if (Array.isArray(node["@graph"])) {
        queue.push(...(node["@graph"] as unknown[]));
        continue;
      }
      out.push(node);
    }
  }
  return out;
}

function hasBrokenJsonLd(html: string): boolean {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  return blocks.some((b) => {
    try {
      JSON.parse(b[1]);
      return false;
    } catch {
      return true;
    }
  });
}

function typesOf(nodes: Record<string, unknown>[]): string[] {
  const out: string[] = [];
  for (const n of nodes) {
    const t = n["@type"];
    if (typeof t === "string") out.push(t);
    else if (Array.isArray(t)) out.push(...t.filter((x): x is string => typeof x === "string"));
  }
  return out;
}

const LOCAL_TYPES = [
  "LocalBusiness",
  "ProfessionalService",
  "HomeAndConstructionBusiness",
  "GeneralContractor",
  "Plumber",
  "Electrician",
  "HVACBusiness",
  "Restaurant",
  "Store",
  "Dentist",
  "LegalService",
  "RealEstateAgent",
];

function check(
  id: string,
  label: string,
  status: CheckStatus,
  detail: string,
  why: string
): Check {
  return { id, label, status, detail, why };
}

export function analyze(input: AnalyzeInput): Report {
  const { html, robots, sitemapOk, bytes, url, finalUrl, status } = input;
  const nodes = jsonLdNodes(html);
  const types = typesOf(nodes);
  const lower = html.toLowerCase();

  /* --- Group 1: can a search engine tell who you are --- */
  const hasLocalType = types.some((t) => LOCAL_TYPES.includes(t));
  const localNode = nodes.find((n) => {
    const t = n["@type"];
    const list = typeof t === "string" ? [t] : Array.isArray(t) ? t : [];
    return list.some((x) => typeof x === "string" && LOCAL_TYPES.includes(x));
  });
  const schemaPhone = localNode && typeof localNode["telephone"] === "string";
  const schemaPlace =
    localNode && (localNode["address"] !== undefined || localNode["areaServed"] !== undefined);

  const identity: Group = {
    id: "identity",
    title: "Can Google tell who you are?",
    checks: [
      hasBrokenJsonLd(html)
        ? check(
            "jsonld",
            "Structured data",
            "fail",
            "There is structured data on the page but it does not parse — a search engine will skip it entirely.",
            "Broken markup is worse than none: the effort is spent and nothing reads it."
          )
        : nodes.length === 0
          ? check(
              "jsonld",
              "Structured data",
              "fail",
              "No structured data found.",
              "This is the block that tells Google your name, phone and service area in a form it does not have to guess at."
            )
          : check(
              "jsonld",
              "Structured data",
              "pass",
              `Found ${nodes.length} structured-data ${nodes.length === 1 ? "block" : "blocks"}.`,
              "This is how a search engine reads your details without guessing."
            ),
      hasLocalType
        ? check(
            "localtype",
            "Marked up as a local business",
            "pass",
            `Declared as ${types.filter((t) => LOCAL_TYPES.includes(t)).join(", ")}.`,
            "This is what puts you in the running for the map results rather than only the blue links."
          )
        : check(
            "localtype",
            "Marked up as a local business",
            nodes.length > 0 ? "warn" : "fail",
            nodes.length > 0
              ? `Structured data exists but none of it says "local business" — found ${types.slice(0, 4).join(", ") || "no types"}.`
              : "Nothing marks this site as a local business.",
            "Without it you are a website; with it you are a business with a location and a phone number."
          ),
      schemaPhone
        ? check(
            "schemaphone",
            "Phone number in the markup",
            "pass",
            "A telephone number is declared in the structured data.",
            "A number only in the page text has to be recognised; a number in the markup is simply read."
          )
        : check(
            "schemaphone",
            "Phone number in the markup",
            "warn",
            "No telephone number in the structured data.",
            "A number only in the page text has to be recognised; a number in the markup is simply read."
          ),
      schemaPlace
        ? check(
            "schemaplace",
            "Where you work, in the markup",
            "pass",
            "An address or service area is declared.",
            "For a business that travels to customers, service area matters more than a street address."
          )
        : check(
            "schemaplace",
            "Where you work, in the markup",
            "warn",
            "No address or service area in the structured data.",
            "For a business that travels to customers, service area matters more than a street address."
          ),
    ],
  };

  /* --- Group 2: can a search engine find your pages --- */
  const title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = metaContent(html, "description");
  const canonical = tag(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const h1Count = [...lower.matchAll(/<h1[\s>]/g)].length;
  const robotsHasSitemap = Boolean(robots && /sitemap:/i.test(robots));

  const crawl: Group = {
    id: "crawl",
    title: "Can Google find your pages?",
    checks: [
      !title
        ? check("title", "Page title", "fail", "No title tag.", "The title is the clickable line in every search result.")
        : title.length < 15
          ? check("title", "Page title", "warn", `Title is only ${title.length} characters: "${title}".`, "Short titles waste the most valuable line you get in a search result.")
          : title.length > 65
            ? check("title", "Page title", "warn", `Title is ${title.length} characters, so Google will cut it.`, "Anything past roughly 60 characters is usually trimmed with an ellipsis.")
            : check("title", "Page title", "pass", `"${title}" — ${title.length} characters.`, "The title is the clickable line in every search result."),
      !desc
        ? check("desc", "Meta description", "warn", "No meta description, so Google will write one for you from the page.", "You can usually say it better than an algorithm picking a sentence at random.")
        : desc.length > 165
          ? check("desc", "Meta description", "warn", `Description is ${desc.length} characters and will be cut.`, "Roughly 155 characters survive on desktop and fewer on mobile.")
          : check("desc", "Meta description", "pass", `${desc.length} characters.`, "This is the sentence under your title in the results.")
          ,
      canonical
        ? check("canonical", "Canonical URL", "pass", `Points at ${canonical}.`, "It tells Google which version of a page is the real one when several URLs show the same thing.")
        : check("canonical", "Canonical URL", "warn", "No canonical tag.", "Without it, the same page reached two ways can compete with itself."),
      h1Count === 1
        ? check("h1", "Main heading", "pass", "Exactly one H1 on the page.", "One clear main heading tells a search engine what the page is about.")
        : h1Count === 0
          ? check("h1", "Main heading", "fail", "No H1 heading.", "One clear main heading tells a search engine what the page is about.")
          : check("h1", "Main heading", "warn", `${h1Count} H1 headings.`, "Several competing main headings blur what the page is about."),
      sitemapOk
        ? check(
            "sitemap",
            "Sitemap",
            robotsHasSitemap ? "pass" : "warn",
            robotsHasSitemap
              ? "A sitemap responded and robots.txt points at it."
              : "A sitemap responded, but robots.txt does not mention it.",
            "The sitemap lists every page you want found; robots.txt is where crawlers look for it first."
          )
        : check(
            "sitemap",
            "Sitemap",
            "fail",
            "No sitemap.xml responded.",
            "Without one, a crawler has to discover your pages by following links and will often miss some."
          ),
      robots === null
        ? check("robots", "robots.txt", "warn", "No robots.txt responded.", "Not fatal, but it is the first file a crawler asks for.")
        : /disallow:\s*\/\s*$/im.test(robots)
          ? check("robots", "robots.txt", "fail", "robots.txt blocks the whole site from being crawled.", "This single line will keep you out of search results entirely.")
          : check("robots", "robots.txt", "pass", "robots.txt is present and does not block the site.", "It is the first file a crawler asks for."),
    ],
  };

  /* --- Group 3: will it work on a phone --- */
  const viewport = metaContent(html, "viewport");
  const https = finalUrl.startsWith("https://");
  /* Whether the page says it is written content rather than a business
     page, read off its own structured data. Used only to decide whether
     having no images is worth mentioning. */
  const written = types.some((t) => /^(Article|BlogPosting|NewsArticle|TechArticle|WebPage)$/i.test(t));
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const withAlt = imgs.filter((t) => /\salt=/i.test(t)).length;
  const altPct = imgs.length === 0 ? 100 : Math.round((withAlt / imgs.length) * 100);

  const phone: Group = {
    id: "phone",
    title: "Does it work on a phone?",
    checks: [
      viewport
        ? check("viewport", "Mobile viewport", "pass", "The page declares a mobile viewport.", "Without it a phone renders the desktop layout zoomed out and unreadable.")
        : check("viewport", "Mobile viewport", "fail", "No viewport tag, so phones will render a shrunken desktop page.", "Most people looking you up are on a phone, often standing in front of the job."),
      https
        ? check("https", "Secure connection", "pass", "Served over HTTPS.", "Browsers mark anything else as not secure, in front of your customer.")
        : check("https", "Secure connection", "fail", "Not served over HTTPS.", "Browsers mark this as not secure, in front of your customer."),
      imgs.length === 0
        ? written
          /* A guide, a blog post or a policy page with no photographs is
             not a fault, and warning about it was the tool being wrong
             on its own site: seventeen of twenty-nine pages were told
             they had no images, with advice about photographs of
             finished work. If the page declares itself as written
             content, there is nothing here to fix. */
          ? check("alt", "Image descriptions", "pass", "No images, which is normal for a written page.", "Alt text matters once there are images. A page of text does not need any.")
          : check("alt", "Image descriptions", "warn", "No images found on the page.", "Photographs of real work are usually the most persuasive thing on a small business page.")
        : altPct >= 90
          ? check("alt", "Image descriptions", "pass", `${withAlt} of ${imgs.length} images have alt text.`, "Alt text is how a search engine and a screen reader know what a photo shows.")
          : check("alt", "Image descriptions", altPct >= 50 ? "warn" : "fail", `Only ${withAlt} of ${imgs.length} images have alt text.`, "Alt text is how a search engine and a screen reader know what a photo shows."),
      bytes <= 150_000
        ? check("weight", "Page weight", "pass", `The HTML is ${Math.round(bytes / 1024)} kB before images.`, "This is the first thing that has to arrive before anything appears.")
        : check("weight", "Page weight", bytes <= 400_000 ? "warn" : "fail", `The HTML alone is ${Math.round(bytes / 1024)} kB before any images.`, "On mobile data this is the delay before anything at all appears on screen."),
    ],
  };

  /* --- Group 4: will a person trust it --- */
  const telLink = /href=["']tel:/i.test(html);
  const ogTitle = propContent(html, "og:title");
  const ogImage = propContent(html, "og:image");
  const favicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);

  const trust: Group = {
    id: "trust",
    title: "Will a customer trust it?",
    checks: [
      telLink
        ? check("tel", "Tap to call", "pass", "The phone number is a tappable link.", "On a phone, a number you cannot tap is a number nobody rings.")
        : check("tel", "Tap to call", "fail", "No tappable phone link found.", "On a phone, a number you cannot tap is a number nobody rings."),
      ogTitle && ogImage
        ? check("og", "Shared-link preview", "pass", "The page has a title and image for shared links.", "This is what appears when someone sends your site in a message.")
        : check("og", "Shared-link preview", "warn", ogTitle || ogImage ? "Only part of the shared-link preview is set." : "No shared-link preview set.", "Without it, a link to your site shows as a bare URL in a message."),
      favicon
        ? check("favicon", "Browser icon", "pass", "A favicon is declared.", "It shows beside you in search results and in a tab full of competitors.")
        : check("favicon", "Browser icon", "warn", "No favicon declared.", "It shows beside you in search results and in a tab full of competitors."),
    ],
  };

  const groups = [identity, crawl, phone, trust];
  const all = groups.flatMap((g) => g.checks);
  const score = all.reduce((n, c) => n + (c.status === "pass" ? 2 : c.status === "warn" ? 1 : 0), 0);
  const outOf = all.length * 2;
  const pct = Math.round((score / outOf) * 100);

  const fails = all.filter((c) => c.status === "fail").length;
  const headline =
    status >= 400
      ? `That address returned a ${status}, so there was nothing to check.`
      : fails === 0 && pct >= 90
        ? "Well set up. A search engine can read who you are, where you work and what pages exist."
        : fails === 0
          ? "Solid foundations, with a few things left on the table."
          : fails <= 2
            ? `${fails} thing${fails === 1 ? "" : "s"} here will actively cost you customers.`
            : `${fails} things here are working against you, and most are a single line of code.`;

  return {
    url,
    finalUrl,
    score: pct,
    outOf: 100,
    headline,
    groups,
    notChecked: [
      "Anything your site draws with JavaScript after the page loads. This reads the HTML your server sends, the way a crawler does on its first pass — so on a site built with Framer, Webflow or React, a phone link or heading added in the browser will show here as missing when it is really there. If a check below looks wrong, that is the likely reason.",
      "Actual page speed. A real measurement needs Google's PageSpeed API; the page weight above is a rough proxy, not a verdict.",
      "Your Google Business Profile. Checking it needs the Places API, and it is the single biggest factor in whether you show up on the map.",
      "Whether your pages are actually indexed. Only Search Console, signed in as you, can say that.",
    ],
  };
}
