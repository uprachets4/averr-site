/**
 * Share images (1200 × 630 PNG) for every page: LinkedIn, X, WhatsApp,
 * iMessage and Facebook do not display SVG previews. Run when a page's
 * headline changes, then commit public/og/*.png:
 *
 *   node tools/og-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/og");
fs.mkdirSync(OUT, { recursive: true });
const font = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(ROOT, "public/fonts", f)).toString("base64");

const DOTS = [["Websites", "#F9AF97"], ["Web Apps", "#D5818C"], ["AI Automation", "#9874E8"], ["Marketing", "#569AFA"]];
const CARDS = [
  { id: "home", eyebrow: "A full-service studio · Toronto", title: "Websites, Web Apps, AI Automation and Marketing.", sub: "For businesses that want to be Taken Seriously." },
  { id: "services", eyebrow: "Services", title: "Four services. Built around your business.", sub: "Websites · Web Apps · AI Automation · Marketing" },
  { id: "service-websites", eyebrow: "Websites · Toronto & the GTA", title: "A custom website, built by hand.", sub: "Designed and built by the person you brief, in 2 – 3 weeks." },
  { id: "service-web-apps", eyebrow: "Web apps · Toronto & the GTA", title: "Software for what a spreadsheet stopped holding.", sub: "Dashboards, internal tools and client portals, built by the person you brief." },
  { id: "guide-website-vs-web-app", eyebrow: "Guide", title: "Website or web app?", sub: "Does anyone log in and change something? That is the whole question." },
  { id: "guide-replace-spreadsheet", eyebrow: "Guide", title: "When a spreadsheet stops working.", sub: "Four signs you have outgrown it, and what replacing it actually buys." },
  { id: "guides", eyebrow: "Guides", title: "Guides for Toronto businesses.", sub: "The things we get asked about most, in plain language." },
  { id: "guide-google-maps", eyebrow: "Guide · Local search", title: "Get on Google Maps.", sub: "The whole process, in order, for a Toronto business." },
  { id: "guide-search-console", eyebrow: "Guide · Search", title: "Set up Search Console.", sub: "Twenty minutes, and the four screens worth opening." },
  { id: "guide-site-speed", eyebrow: "Guide · Performance", title: "Why your site is slow.", sub: "The three numbers Google measures, and the fixes that pay." },
  { id: "guide-wix-vs-custom", eyebrow: "Guide · Choosing", title: "Wix or custom?", sub: "Where the line falls, from people who sell one side." },
  { id: "guide-contractor-home-page", eyebrow: "Guide · Trades", title: "A contractor's home page.", sub: "Eight sections, in the order a homeowner reads them." },
  { id: "guide-build-vs-buy", eyebrow: "Guide · Choosing", title: "Build or buy?", sub: "Buying wins most of the time. One reason to build holds up." },
  { id: "industry-contractors", eyebrow: "Contractors · GTA", title: "A website that gets you called.", sub: "Two builds for GTA trades: an installer and a renovation company." },
  { id: "work", eyebrow: "Work", title: "Built by Averr.", sub: "Real products for businesses across the GTA." },
  { id: "about", eyebrow: "About", title: "You work directly with the person who builds it.", sub: "Averr Studios · Toronto" },
  { id: "contact", eyebrow: "Contact", title: "Write to the person who builds it.", sub: "Or book a 30-minute discovery call." },
  { id: "prachets", eyebrow: "Founder, Averr Studios", title: "Prachets Upadhyay", sub: "Save my contact or book a discovery call." },
  { id: "work-cg-walls-and-floors", eyebrow: "Case study · Home renovation, GTA", title: "CG Walls & Floors", sub: "Built by Averr Studios" },
  { id: "work-sift", eyebrow: "Case study · SaaS, job search", title: "SIFT", sub: "Built by Averr Studios" },
  { id: "work-express-contractors", eyebrow: "Case study · Appliance installation, GTA", title: "Express Contractors", sub: "Built by Averr Studios" },
  { id: "work-cadencestack", eyebrow: "Case study · SaaS, LinkedIn presence", title: "CadenceStack", sub: "Built by Averr Studios" },
  { id: "work-capitalcommand", eyebrow: "Case study · Fintech, portfolio intelligence", title: "CapitalCommand", sub: "Built by Averr Studios" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const page = (c) => `<!doctype html><html><head><style>
@font-face{font-family:G;src:url(${font("geist-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:M;src:url(${font("geist-mono-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:G;color:#F5F4F9;
 background:
  radial-gradient(70% 90% at 82% 18%, rgba(152,116,232,.28), rgba(152,116,232,0) 60%),
  radial-gradient(60% 80% at 10% 100%, rgba(249,175,151,.18), rgba(249,175,151,0) 60%),
  radial-gradient(120% 95% at 50% 46%, #182633 0%, #121C27 45%, #080A0A 100%);}
.wrap{position:absolute;inset:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:baseline;font-weight:700;font-size:40px;letter-spacing:-.06em}
.brand i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-left:3px;background:linear-gradient(135deg,#F9AF97,#D5818C 35%,#9874E8 70%,#569AFA)}
.eb{font-family:M;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#A9B4C2;margin-bottom:22px}
h1{font-weight:600;font-size:${c.title.length > 34 ? 62 : 84}px;line-height:1.04;letter-spacing:-.035em;max-width:1000px}
.sub{margin-top:22px;font-size:28px;color:#C3CAD4}
.dots{display:flex;gap:26px;font-family:M;font-size:17px;letter-spacing:.1em;text-transform:uppercase;color:#C3CAD4}
.dots span{display:inline-flex;align-items:center;gap:10px}.dots b{width:11px;height:11px;border-radius:50%}
</style></head><body><div class="wrap">
<div class="brand">averr<i></i></div>
<div><div class="eb">${esc(c.eyebrow)}</div><h1>${esc(c.title)}</h1><div class="sub">${esc(c.sub)}</div></div>
<div class="dots">${DOTS.map(([n, col]) => `<span><b style="background:${col}"></b>${n}</span>`).join("")}</div>
</div></body></html>`;

const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of CARDS) {
  await p.setContent(page(c));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(OUT, `${c.id}.png`) });
}
await b.close();
console.log(`og-images: ${CARDS.length} written to public/og`);
