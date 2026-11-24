/**
 * PRERENDER — runs after `vite build` (see package.json "build").
 *
 * Every route ships as its own HTML file: the page's real text, headings and
 * links, plus its own title, description, canonical URL, share image and
 * structured data. Search engines, AI crawlers and link previews read this
 * without running any script. In the browser, main.tsx still mounts with
 * createRoot and replaces the markup, so nothing about the live site changes.
 *
 * Also writes sitemap.xml, robots.txt and 404.html (served with a real 404
 * status by Vercel, now that there is no catch-all rewrite).
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://www.averrstudios.com";

/* ── a minimal browser for render-time reads (effects never run here) ── */
const mm = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
const store = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.window = globalThis;
Object.assign(globalThis, {
  innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, matchMedia: mm,
  localStorage: store, sessionStorage: store, location: new URL(SITE + "/"),
  addEventListener() {}, removeEventListener() {}, scrollY: 0,
  requestAnimationFrame: () => 0, cancelAnimationFrame() {},
});
globalThis.document = {
  documentElement: { style: {}, classList: { add() {}, remove() {}, contains: () => false } },
  addEventListener() {}, removeEventListener() {}, querySelector: () => null,
  getElementById: () => null, createElement: () => ({ style: {}, getContext: () => null }),
  head: { appendChild() {} }, body: { style: {} }, title: "", visibilityState: "visible",
};
try { globalThis.navigator = { userAgent: "prerender", maxTouchPoints: 0 }; } catch { /* read-only in some runtimes */ }

const { render, META, caseMeta, BUILT, FAQ, SERVICE_CARDS, GUIDES, readingMinutes, guideMeta, PILLARS, INDUSTRIES } = await import(
  path.join(ROOT, "dist-ssr/entry-server.js")
);

/* ── text helpers ─────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

/* ── the studio, as structured data (owner-stated facts only) ──────── */
const ORG_ID = `${SITE}/#studio`;
const FOUNDER_ID = `${SITE}/#prachets`;
/* The studio's own public profiles. Add the Clutch and Apple links here once
   each is verified and live.

   The Google Business Profile went on 23 Nov 2026, the day after the profile
   was verified. It is the share link from the listing rather than a
   google.com/maps/place/... URL with a CID in it: Google blocks automated
   reads of both g.page and maps.app.goo.gl, so the canonical form could not
   be resolved from here. The short link is Google's own and permanent, and
   swapping it for the canonical URL later changes nothing else. */
const STUDIO_PROFILES = [
  "https://www.instagram.com/averrstudios",
  "https://maps.app.goo.gl/wsJaom8Gdpftd91n8",
];
/* studio, founder and website are defined below; IDENTITY is assembled
   after them, just above the page table. */
const GTA = ["Toronto", "North York", "Scarborough", "Etobicoke", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville"];
/* Declared above `studio` because its offer catalogue builds service
   nodes while this module initialises, and a const is not readable
   before that point — the build failed outright when this sat further
   down the file. */
const SVC_NAME = { websites: "Website design and development", webApps: "Web app development", aiAutomation: "AI automation", marketing: "Digital marketing" };
const SERVICE_DESC = {
  websites: "Brand and design direction, marketing websites, landing pages and online booking.",
  webApps: "Dashboards, client portals and internal systems built around how your business works.",
  aiAutomation: "AI automation with human review: audits, agents and workflows that take the busywork off your team.",
  marketing: "Search, campaigns and reporting so customers find you first and choose you more.",
};
const studio = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "Averr Studios",
  url: SITE + "/",
  alternateName: "Averr",
  logo: { "@type": "ImageObject", url: `${SITE}/brand/averr-logo-square.png`, width: 720, height: 720 },
  image: `${SITE}/og/home.png`,
  foundingDate: "2026-11-01",
  slogan: "Websites, Web Apps, AI Automation and Marketing for businesses that want to be taken seriously.",
  sameAs: STUDIO_PROFILES,
  email: "prachets@averrstudios.com",
  telephone: "+1-647-643-2496",
  description: META.home.description,
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
    ...GTA.map((name) => ({ "@type": "City", name })),
  ],
  founder: { "@id": FOUNDER_ID },
  knowsAbout: ["Web design", "Web app development", "AI automation", "Digital marketing", "Search engine optimization"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    /* The compact node, not a bare @id and not a second full copy.
       This used to restate the whole service inline, so the catalogue
       and /services described the same four things as eight unrelated
       nodes. A bare reference was the other extreme and was worse: the
       catalogue travels with `studio` onto pages that define no Service
       nodes, so on the home page it pointed at four things that were
       not there. Carrying @id, name and url makes it stand alone on
       whatever page it lands, and the @id still ties it to the
       describing node on /services. */
    itemListElement: SERVICE_CARDS.map((s) => ({
      "@type": "Offer",
      itemOffered: serviceNode(s.id),
    })),
  },
};
const founder = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "Prachets Upadhyay",
  jobTitle: "Founder",
  worksFor: { "@id": ORG_ID },
  url: `${SITE}/prachets`,
  image: `${SITE}/about/avatar.webp`,
  sameAs: ["https://www.linkedin.com/in/prachetsupadhyay", "https://prachetsupadhyay.com"],
};
const website = { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE + "/", name: "Averr Studios", alternateName: "Averr", inLanguage: "en-CA", publisher: { "@id": ORG_ID } };
/* The date a file first entered the repo, for video upload dates. */
const added = (file) => {
  try { return execSync(`git log --diff-filter=A --format=%cs -- "${file}"`, { encoding: "utf8" }).trim().split("\n").pop() || null; } catch { return null; }
};
/* The slug came from a second copy of this map living here, which is
   the kind of duplication that survives right up until the day the two
   disagree. The pillar registry owns it now. */
function slugOf(id) {
  return PILLARS[id].slug;
}

/**
 * The service as an entity, not as a loose string.
 *
 * Every service used to appear twice in the graph as two anonymous
 * `Service` nodes — once in the offer catalogue, once on /services —
 * so nothing could state that the two were the same thing, that a
 * case study was work of that kind, or that a guide was about it. A
 * stable @id fixes all three: the catalogue references it, case files
 * and guides point `about` at it, and the four services become one
 * connected set rather than four repeated names.
 */
function serviceId(id) {
  return `${SITE}/#service-${slugOf(id)}`;
}

/* Where the service lives. A pillar with its own page gets a real URL;
   one without gets its section on the overview. The structured data
   has been claiming four distinct service URLs via fragments, which
   search engines discard — so until a pillar ships, this says the
   honest thing and points at the page that actually exists. */
function serviceUrl(id) {
  const p = PILLARS[id];
  return p.live ? `${SITE}/services/${p.slug}` : `${SITE}/services#${p.slug}`;
}

/**
 * `full` emits the describing node, for /services, which is where the
 * service is the subject. Elsewhere a compact node carries the same
 * @id so the `about` reference resolves on its own page too, without
 * restating a description that belongs on the service's own page.
 */
function serviceNode(id, { full = false } = {}) {
  const name = SVC_NAME[id];
  const base = { "@type": "Service", "@id": serviceId(id), name, url: serviceUrl(id) };
  if (!full) return base;
  return {
    ...base,
    serviceType: name,
    description: SERVICE_DESC[id],
    provider: { "@id": ORG_ID },
    areaServed: "Greater Toronto Area",
  };
}
const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })),
});

/* ── the routes ───────────────────────────────────────────────────── */
/* The three nodes that identify this business, put on every indexable
   page by `head` below. Kept as one list so there is a single place to
   add the fourth if one ever exists. */
const IDENTITY = [studio, founder, website];

const pages = [
  { url: "/", meta: META.home, og: "home", priority: "1.0", graph: [studio, founder, website] },
  {
    url: "/services", meta: META.services, og: "services", priority: "0.9",
    graph: [
      studio,
      ...SERVICE_CARDS.map((s) => serviceNode(s.id, { full: true })),
      { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      crumbs([["Home", "/"], ["Services", "/services"]]),
    ],
  },
  /* The first pillar page. Its own Service node is the describing one
     — this is the URL the entity now lives at, so `serviceUrl` points
     here rather than at the overview's fragment, and the case files and
     guides that reference it resolve to a real page. */
  {
    url: "/services/websites", meta: META.serviceWebsites, og: "service-websites", priority: "0.9",
    graph: [
      studio,
      serviceNode("websites", { full: true }),
      crumbs([["Home", "/"], ["Services", "/services"], ["Websites", "/services/websites"]]),
    ],
  },
  {
    url: "/services/web-apps", meta: META.serviceWebApps, og: "service-web-apps", priority: "0.9",
    graph: [
      studio,
      serviceNode("webApps", { full: true }),
      crumbs([["Home", "/"], ["Services", "/services"], ["Web apps", "/services/web-apps"]]),
    ],
  },
  {
    /* The industry page sits under its pillar in the crumb trail even
       though the URL is flat — see IndustryPage.tsx for why. The Service
       node it emits is the pillar's, not a service of its own: this page
       sells website design to one audience, and minting a second Service
       entity for the same offering would split the signal between two
       @ids describing one thing.

       `about` names the two case files, which is the machine-readable
       half of the argument for moving the keyword here — the page
       points at its proof, and the proof points back by sector. */
    url: "/industries/contractors", meta: META.industryContractors, og: "industry-contractors", priority: "0.9",
    graph: [
      studio,
      serviceNode("websites", { full: true }),
      {
        "@type": "WebPage",
        "@id": `${SITE}/industries/contractors`,
        url: `${SITE}/industries/contractors`,
        name: META.industryContractors.title,
        description: META.industryContractors.description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": serviceId("websites") },
        mainEntity: { "@id": serviceId("websites") },
        significantLink: INDUSTRIES.contractors.proof.map((s) => `${SITE}/work/${s}`),
      },
      crumbs([
        ["Home", "/"],
        ["Services", "/services"],
        ["Websites", "/services/websites"],
        ["Contractors", "/industries/contractors"],
      ]),
    ],
  },
  {
    /* The tool is a SoftwareApplication so it can be understood as a
       thing you use rather than an article about one. No FAQPage: the
       pillar pages deliberately carry none, and a third FAQ on this
       site would put two of them in the running for one rich result. */
    url: "/tools/findable", meta: META.toolFindable, og: "tool-findable", priority: "0.8",
    graph: [
      studio,
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/tools/findable#tool`,
        name: "Findability check",
        url: `${SITE}/tools/findable`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        description: META.toolFindable.description,
        publisher: { "@id": ORG_ID },
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
      },
      crumbs([["Home", "/"], ["Findability check", "/tools/findable"]]),
    ],
  },
  { url: "/work", meta: META.work, og: "work", priority: "0.9", graph: [studio, crumbs([["Home", "/"], ["Work", "/work"]])] },
  ...BUILT.map((p) => ({
    url: `/work/${p.slug}`,
    meta: caseMeta(p),
    og: `work-${p.slug}`,
    priority: "0.8",
    graph: [
      {
        /* `about` was the sector as a bare string, so the strongest
           proof on the site was never tied to the service it proved.
           It now names the services as entities, lead first, with the
           sector kept after them — a case file is about a kind of work
           and an industry, and both are worth saying. */
        "@type": "CreativeWork", name: `${p.name} case study`, headline: `${p.name}: ${p.thesis}`,
        about: [...p.svc.map((x) => ({ "@id": serviceId(x) })), p.sector],
        description: clip(`${p.thesis} ${p.problem} ${p.outcome.headline}`, 300),
        genre: p.svc.map((x) => SVC_NAME[x]).join(", "), dateCreated: p.year.slice(0, 4),
        image: `${SITE}/og/work-${p.slug}.png`, creator: { "@id": ORG_ID }, url: `${SITE}/work/${p.slug}`,
        inLanguage: "en-CA", keywords: [p.sector, ...p.svc.map((x) => SVC_NAME[x]), "Toronto"].join(", "),
      },
      ...(p.video ? [{
        "@type": "VideoObject", name: `${p.name}: ${p.thesis}`, description: clip(`${p.problem} ${p.outcome.body}`, 300),
        thumbnailUrl: SITE + p.video.poster, contentUrl: SITE + p.video.src, uploadDate: added(`public${p.video.src}`) || p.year.slice(0, 4),
        publisher: { "@id": ORG_ID },
      }] : []),
      /* The services this case file points `about` at, so the
         reference resolves within this page as well as across the
         site. Compact: the describing node lives on /services. */
      ...p.svc.map((x) => serviceNode(x)),
      crumbs([["Home", "/"], ["Work", "/work"], [p.name, `/work/${p.slug}`]]),
    ],
  })),
  /* Guides. The index is an ItemList so the set is legible to a crawler
     as a set; each guide is an Article with the founder as its author,
     which is the E-E-A-T signal the checklist asks for — Google weighs
     who wrote this kind of content, and the byline on the page and the
     author in the schema are the same person by construction.
     `dateModified` is the guide's own `checked` date, not the build
     date: a rebuild is not a revision, and claiming it was would make
     every guide look freshly updated every deploy. */
  {
    url: "/guides", meta: META.guides, og: "guides", priority: "0.8",
    graph: [
      studio,
      {
        "@type": "ItemList", name: "Averr Studios guides", inLanguage: "en-CA",
        itemListElement: GUIDES.map((g, i) => ({
          "@type": "ListItem", position: i + 1, name: g.title, url: `${SITE}/guides/${g.slug}`,
        })),
      },
      crumbs([["Home", "/"], ["Guides", "/guides"]]),
    ],
  },
  ...GUIDES.map((g) => ({
    url: `/guides/${g.slug}`,
    meta: guideMeta(g),
    og: g.og,
    priority: "0.7",
    graph: [
      studio,
      founder,
      {
        "@type": "Article", headline: g.title, description: clip(g.dek, 300),
        author: { "@id": FOUNDER_ID }, publisher: { "@id": ORG_ID },
        datePublished: g.published, dateModified: g.checked,
        image: `${SITE}/og/${g.og}.png`, url: `${SITE}/guides/${g.slug}`,
        mainEntityOfPage: `${SITE}/guides/${g.slug}`, inLanguage: "en-CA",
        wordCount: readingMinutes(g) * 200,
        /* The service this article sells. A guide with no `about` is a
           page that ranks for a question and says nothing about who
           answers it commercially — which is what all four were. */
        about: g.svc.map((x) => ({ "@id": serviceId(x) })),
      },
      ...g.svc.map((x) => serviceNode(x)),
      crumbs([["Home", "/"], ["Guides", "/guides"], [g.title, `/guides/${g.slug}`]]),
    ],
  })),
  { url: "/about", meta: META.about, og: "about", priority: "0.7", graph: [studio, founder, crumbs([["Home", "/"], ["About", "/about"]])] },
  { url: "/contact", meta: META.contact, og: "contact", priority: "0.8", graph: [studio, crumbs([["Home", "/"], ["Contact", "/contact"]])] },
  { url: "/how-we-work", meta: META.howWeWork, og: "how-we-work", priority: "0.6", graph: [crumbs([["Home", "/"], ["How we work", "/how-we-work"]])] },
  { url: "/privacy", meta: META.privacy, og: "home", priority: "0.3", graph: [] },
  { url: "/prachets", meta: META.card, og: "prachets", priority: "0.5", graph: [founder] },
];

/* ── head ─────────────────────────────────────────────────────────── */
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("prerender: #root not found in dist/index.html");

function head(html, page, { noindex = false } = {}) {
  const { title, description } = page.meta;
  const canonical = SITE + (page.url === "/" ? "/" : page.url);
  const ogImage = `${SITE}/og/${page.og}.png`;
  const set = (re, val) => {
    if (!re.test(html)) throw new Error(`prerender: head tag missing for ${re}`);
    html = html.replace(re, val);
  };
  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`);
  set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`);
  set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(description)}" />`);
  set(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  /* The three nodes that say who this is go on every indexable page,
     not only the routes whose definition happened to list them. Google
     reads each page's graph on its own, so an `@id` pointing at a node
     defined on another page does not resolve — a quiet failure, because
     the markup is well-formed and the node it names is simply absent.
     On 23 Nov 2026 the five case studies carried
     `creator: {"@id": …#studio}` with no studio node on the page,
     /prachets had the founder alone, /privacy had no graph at all, and
     fifteen pages pointed at a founder that was not there. The checker
     scored those 91 and 79 against 97 for the pages that did carry it.
     Done here rather than in a dozen route definitions, so the next
     page added cannot forget. `tools/schema.test.ts` holds it, and also
     checks the general case: no reference without its node.
     Noindex pages are left alone — nothing to tell Google about a page
     it will not index. */
  const graph = noindex ? page.graph : [...IDENTITY.filter((n) => !page.graph.includes(n)), ...page.graph];

  const extra = [
    noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:site_name" content="Averr Studios" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(title)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    graph.length ? ld({ "@context": "https://schema.org", "@graph": graph }) : "",
  ].filter(Boolean).join("\n    ");
  return html.replace("</head>", `    ${extra}\n  </head>`);
}

/* ── write ────────────────────────────────────────────────────────── */
let count = 0;
for (const page of pages) {
  /* Twice: the first pass resolves the lazy page modules, so the second
     renders without suspending and the content sits inline in <main>,
     not in a hidden block that a script moves into place. */
  const body = await render(page.url);
  if (body.includes('<div hidden id="S:')) throw new Error(`prerender: ${page.url} still has an outlined boundary`);
  if (body.length < 2000) throw new Error(`prerender: ${page.url} rendered almost nothing (${body.length} bytes)`);
  const html = head(template, page).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const out = page.url === "/" ? path.join(DIST, "index.html") : path.join(DIST, page.url, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  count++;
}

/* 404: served by Vercel with a real 404 status for any unknown path. */
const nf = { url: "/404", meta: META.notFound, og: "home", graph: [] };
fs.writeFileSync(
  path.join(DIST, "404.html"),
  head(template, nf, { noindex: true }).replace('<div id="root"></div>', `<div id="root">${await render("/__not-found__")}</div>`)
);

/* sitemap + robots. lastmod is the last commit that touched the files
   behind each page, so it only moves when the page really changes. */
const SOURCES = {
  "/": ["src/pages/Home.tsx", "src/components/home", "src/data/servicesBuild.ts"],
  "/services": ["src/pages/Services.tsx", "src/components/services", "src/data/servicesBuild.ts"],
  /* Both pillars share the component, the stylesheet and the copy
     module, so they share most of their lastmod inputs too. */
  "/services/websites": [
    "src/pages/ServiceWebsites.tsx",
    "src/components/services/pillar",
    "src/data/pillarPages.ts",
    "src/data/pillars.ts",
  ],
  "/services/web-apps": [
    "src/pages/ServiceWebApps.tsx",
    "src/components/services/pillar",
    "src/data/pillarPages.ts",
    "src/data/pillars.ts",
  ],
  "/tools/findable": [
    "src/pages/ToolFindable.tsx",
    "src/components/tools",
    "api/_findability.ts",
    "api/findability.ts",
  ],
  "/industries/contractors": [
    "src/pages/IndustryContractors.tsx",
    "src/components/industries",
    "src/data/industryPages.ts",
    "src/data/industries.ts",
  ],
  "/work": ["src/pages/Work.tsx", "src/components/work", "src/data/builtByAverr.ts"],
  "/about": ["src/pages/About.tsx", "src/components/about"],
  "/contact": ["src/pages/Contact.tsx", "src/components/contact"],
  "/guides": ["src/pages/Guides.tsx", "src/components/guides", "src/data/guides.ts"],
  "/privacy": ["src/pages/Privacy.tsx"],
  "/prachets": ["src/pages/Prachets.tsx", "src/components/card"],
};
const lastmod = (url) => {
  /* The two templated routes have no entry of their own in SOURCES —
     one set of files backs every case file, and another every guide. */
  const templated = url.startsWith("/work/")
    ? ["src/pages/CaseStudy.tsx", "src/components/work/built", "src/data/builtByAverr.ts"]
    : url.startsWith("/guides/")
      ? ["src/pages/Guide.tsx", "src/components/guides", "src/data/guides.ts"]
      : [];
  const files = SOURCES[url] ?? templated;
  const shared = ["src/lib/documentMeta.ts", "tools/prerender.mjs"];
  try {
    const d = execSync(`git log -1 --format=%cs -- ${[...files, ...shared].join(" ")}`, { encoding: "utf8" }).trim();
    return d || null;
  } catch { return null; }
};
/**
 * Images a page shows, as absolute URLs, for the image sitemap.
 *
 * Derived from each project's own records rather than scraped out of
 * the rendered HTML: the HTML of a case file also contains the next
 * case's thumbnail, and listing another project's screenshot under
 * this URL tells Google the image belongs to the wrong page.
 *
 * The URL is what the page actually serves. `screen()` resolves a
 * source JPEG to the generated WebP the markup points at, so the
 * sitemap and the `src` attribute can never name different files.
 *
 * Only `image:loc` is emitted. Google removed `image:caption`,
 * `image:title`, `image:geo_location` and `image:license` from the
 * spec in 2022 and ignores them; the caption lives on the page, where
 * it is read, and in the alt text.
 */
function imagesFor(url) {
  const p = BUILT.find((x) => `/work/${x.slug}` === url);
  if (!p) return [];

  /* The folders this project's own screenshots live in. Derived from
     its records because the folder name is not the slug — CG Walls &
     Floors is /work/cgwalls — and because this is what separates its
     images from the next case's thumbnail further down the page. */
  const own = new Set(
    [
      ...(p.gallery || []).map((g) => g.image),
      ...(p.sigs || []).map((s) => s.image),
      ...(p.approach || []).map((a) => a.image),
    ]
      .filter(Boolean)
      .map((src) => src.slice(0, src.lastIndexOf("/") + 1))
  );

  /* Read back what was actually written, rather than recomputing it.
     Components do not agree on which variant they render — the gallery
     grid uses the small one, the signatures use the large — so deriving
     the URL a second time here listed files that exist but are not the
     ones on the page. The rendered markup is the only source that
     cannot disagree with itself. */
  const html = fs.readFileSync(path.join(DIST, url.slice(1), "index.html"), "utf8");
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/<img[^>]*\ssrc="(\/work\/[^"]+)"/g)) {
    const src = m[1];
    if (![...own].some((dir) => src.startsWith(dir))) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    out.push(`${SITE}${src}`);
  }
  return out;
}

const sitemapEntries = pages.map(function entry(p) {
  const loc = `${SITE}${p.url === "/" ? "/" : p.url}`;
  const d = lastmod(p.url);
  const images = imagesFor(p.url)
    .map((src) => `\n    <image:image><image:loc>${src}</image:loc></image:image>`)
    .join("");
  return (
    `  <url><loc>${loc}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}` +
    `<priority>${p.priority}</priority>${images}${images ? "\n  " : ""}</url>`
  );
});

fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    sitemapEntries.join("\n") +
    `\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

/* llms.txt: a plain-text map of the site for AI assistants that read it.
   Google Search ignores it; Perplexity and ChatGPT browsing read it. */
fs.writeFileSync(
  path.join(DIST, "llms.txt"),
  [
    "# Averr Studios",
    "",
    `> ${META.home.description}`,
    "",
    "Averr Studios is a studio in Toronto, Ontario, Canada, founded by Prachets Upadhyay. It designs and builds websites, web apps, AI automation and marketing for businesses across the Greater Toronto Area. Contact: prachets@averrstudios.com, +1 647 643 2496. Free 30-minute discovery calls: https://www.averrstudios.com/contact",
    "",
    "## Services",
    ...SERVICE_CARDS.map((x) => `- [${x.name}](${serviceUrl(x.id)}): ${SERVICE_DESC[x.id]}`),
    "",
    "## Case studies",
    ...BUILT.map((p) => `- [${p.name}](${SITE}/work/${p.slug}): ${p.sector}. ${p.thesis} ${p.outcome.headline}`),
    "",
    "## About",
    `- [About Averr Studios](${SITE}/about): ${META.about.description}`,
    `- [Prachets Upadhyay](${SITE}/prachets): Founder.`,
    "",
    "## Questions",
    ...FAQ.map((f) => `- ${f.q} ${f.a}`),
    "",
  ].join("\n")
);

console.log(`prerender: ${count} pages, 404.html, sitemap.xml (${pages.length} URLs), robots.txt`);
