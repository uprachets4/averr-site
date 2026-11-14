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

const { render, META, BUILT, FAQ, SERVICE_CARDS } = await import(
  path.join(ROOT, "dist-ssr/entry-server.js")
);

/* ── text helpers ─────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

/* ── the studio, as structured data (owner-stated facts only) ──────── */
const ORG_ID = `${SITE}/#studio`;
const FOUNDER_ID = `${SITE}/#prachets`;
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
  logo: `${SITE}/og/home.png`,
  image: `${SITE}/og/home.png`,
  email: "prachets@averrstudios.com",
  telephone: "+1-647-643-2496",
  description: META.home.description,
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  areaServed: [
    { "@type": "City", name: "Toronto" },
    { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
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
  sameAs: ["https://www.linkedin.com/in/prachetsupadhyay"],
};
const website = { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE + "/", name: "Averr Studios", publisher: { "@id": ORG_ID } };
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
  { url: "/work", meta: META.work, og: "work", priority: "0.9", graph: [studio, crumbs([["Home", "/"], ["Work", "/work"]])] },
  ...BUILT.map((p) => ({
    url: `/work/${p.slug}`,
    meta: { title: `${p.name} — Averr Studios`, description: clip(`${p.name}: ${p.thesis} ${p.problem}`) },
    og: `work-${p.slug}`,
    priority: "0.8",
    graph: [
      { "@type": "CreativeWork", name: p.name, about: p.sector, description: clip(p.thesis, 300), creator: { "@id": ORG_ID }, url: `${SITE}/work/${p.slug}` },
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

/* sitemap + robots */
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${SITE}${p.url === "/" ? "/" : p.url}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join("\n") +
    `\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerender: ${count} pages, 404.html, sitemap.xml (${pages.length} URLs), robots.txt`);
