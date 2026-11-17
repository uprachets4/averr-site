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

const { render, META, caseMeta, BUILT, FAQ, SERVICE_CARDS, WEBSITES_FAQ } = await import(
  path.join(ROOT, "dist-ssr/entry-server.js")
);

/* ── text helpers ─────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

/* ── the studio, as structured data (owner-stated facts only) ──────── */
const ORG_ID = `${SITE}/#studio`;
const FOUNDER_ID = `${SITE}/#prachets`;
/* The studio's own public profiles. Add the Google Business Profile, Clutch
   and Apple links here once each is verified and live. */
const STUDIO_PROFILES = ["https://www.instagram.com/averrstudios"];
const GTA = ["Toronto", "North York", "Scarborough", "Etobicoke", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville"];
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
    itemListElement: SERVICE_CARDS.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, description: SERVICE_DESC[s.id], url: `${SITE}/services#${slugOf(s.id)}` },
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
const SVC_NAME = { websites: "Website design and development", webApps: "Web app development", aiAutomation: "AI automation", marketing: "Digital marketing" };
/* The date a file first entered the repo, for video upload dates. */
const added = (file) => {
  try { return execSync(`git log --diff-filter=A --format=%cs -- "${file}"`, { encoding: "utf8" }).trim().split("\n").pop() || null; } catch { return null; }
};
function slugOf(id) {
  return { websites: "websites", webApps: "web-apps", aiAutomation: "ai-automation", marketing: "marketing" }[id];
}
const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })),
});

/* ── the routes ───────────────────────────────────────────────────── */
const pages = [
  { url: "/", meta: META.home, og: "home", priority: "1.0", graph: [studio, founder, website] },
  {
    url: "/services", meta: META.services, og: "services", priority: "0.9",
    graph: [
      studio,
      ...SERVICE_CARDS.map((s) => ({
        "@type": "Service", name: s.name, serviceType: s.name, description: SERVICE_DESC[s.id],
        provider: { "@id": ORG_ID }, areaServed: "Greater Toronto Area", url: `${SITE}/services#${slugOf(s.id)}`,
      })),
      { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      crumbs([["Home", "/"], ["Services", "/services"]]),
    ],
  },
  /* /services/websites — one service, one search ("web design Toronto").
     Its Service node points at this page rather than at the /services
     anchor, and its FAQPage is this page's own six questions, so the two
     pages do not compete for the same rich result. */
  {
    url: "/services/websites", meta: META.servicesWebsites, og: "services-websites", priority: "0.9",
    graph: [
      studio,
      {
        "@type": "Service", name: "Website design and development", serviceType: "Web design",
        description: SERVICE_DESC.websites, provider: { "@id": ORG_ID },
        areaServed: "Greater Toronto Area", url: `${SITE}/services/websites`,
      },
      { "@type": "FAQPage", mainEntity: WEBSITES_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      crumbs([["Home", "/"], ["Services", "/services"], ["Websites", "/services/websites"]]),
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
        "@type": "CreativeWork", name: `${p.name} case study`, headline: `${p.name}: ${p.thesis}`, about: p.sector,
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
      crumbs([["Home", "/"], ["Work", "/work"], [p.name, `/work/${p.slug}`]]),
    ],
  })),
  { url: "/about", meta: META.about, og: "about", priority: "0.7", graph: [studio, founder, crumbs([["Home", "/"], ["About", "/about"]])] },
  { url: "/contact", meta: META.contact, og: "contact", priority: "0.8", graph: [studio, crumbs([["Home", "/"], ["Contact", "/contact"]])] },
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
  const extra = [
    noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:site_name" content="Averr Studios" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(title)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    page.graph.length ? ld({ "@context": "https://schema.org", "@graph": page.graph }) : "",
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
  /* Narrowed from `src/components/services` to the v2 folder: that directory
     now also holds `services/websites`, and the wider glob would have moved
     /services' lastmod every time the Websites page changed — the one thing
     this map exists to prevent. */
  "/services": ["src/pages/Services.tsx", "src/components/services/v2", "src/components/services/passBooking.ts", "src/data/servicesBuild.ts"],
  "/services/websites": ["src/pages/ServiceWebsites.tsx", "src/components/services/websites", "src/data/serviceWebsites.ts", "src/data/servicePillars.ts", "src/data/aboutProcess.ts"],
  "/work": ["src/pages/Work.tsx", "src/components/work", "src/data/builtByAverr.ts"],
  "/about": ["src/pages/About.tsx", "src/components/about"],
  "/contact": ["src/pages/Contact.tsx", "src/components/contact"],
  "/privacy": ["src/pages/Privacy.tsx"],
  "/prachets": ["src/pages/Prachets.tsx", "src/components/card"],
};
const lastmod = (url) => {
  const files = SOURCES[url] || (url.startsWith("/work/") ? ["src/pages/CaseStudy.tsx", "src/components/work/built", "src/data/builtByAverr.ts"] : []);
  const shared = ["src/lib/documentMeta.ts", "tools/prerender.mjs"];
  try {
    const d = execSync(`git log -1 --format=%cs -- ${[...files, ...shared].join(" ")}`, { encoding: "utf8" }).trim();
    return d || null;
  } catch { return null; }
};
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${SITE}${p.url === "/" ? "/" : p.url}</loc>${(() => { const d = lastmod(p.url); return d ? `<lastmod>${d}</lastmod>` : ""; })()}<priority>${p.priority}</priority></url>`).join("\n") +
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
    ...SERVICE_CARDS.map((x) => `- [${x.name}](${SITE}/services#${slugOf(x.id)}): ${SERVICE_DESC[x.id]}`),
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
