import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const DIST = process.argv[2] || new URL("../dist", import.meta.url).pathname;
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".svg":"image/svg+xml", ".webp":"image/webp", ".png":"image/png",
  ".jpg":"image/jpeg", ".woff2":"font/woff2", ".xml":"application/xml", ".json":"application/json" };

const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = path.join(DIST, p);
  try {
    if (!path.extname(f)) f = path.join(f, "index.html");
    const b = await readFile(f);
    res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
    res.end(b);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => srv.listen(0, r));
const base = `http://localhost:${srv.address().port}`;

const PAGES = [
  ["guide",     "/guides/wix-vs-custom-website", ".gcrumbs a"],
  ["case file", "/work/express-contractors",     ".bb-crumbs a"],
  ["pillar",    "/services/websites",            ".wcrumbs a"],
  ["industry",  "/industries/contractors",        ".wcrumbs a"],
];
const WIDTHS = [375, 768, 1024, 1440];
const MIN = 24;

const browser = await chromium.launch();
let fails = 0;
for (const [label, url, sel] of PAGES) {
  const rows = [];
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const r = await page.goto(base + url, { waitUntil: "networkidle" }).catch(() => null);
    if (!r || !r.ok()) { rows.push([w, "PAGE MISSING"]); await page.close(); continue; }
    await page.waitForTimeout(400);
    const m = await page.$$eval(sel, (els) =>
      els.map((e) => { const b = e.getBoundingClientRect();
        return { t: e.textContent.trim(), h: +b.height.toFixed(1), w: +b.width.toFixed(1) }; }));
    rows.push([w, m]); await page.close();
  }
  console.log(`\n${label}  ${url}   ${sel}`);
  for (const [w, m] of rows) {
    if (typeof m === "string") { console.log(`  ${w}px  ${m}`); continue; }
    if (!m.length) { console.log(`  ${w}px  no links matched`); fails++; continue; }
    const bad = m.filter((x) => x.h < MIN || x.w < MIN);
    bad.forEach(() => fails++);
    console.log(`  ${String(w).padStart(4)}px  ` + m.map((x) =>
      `${x.t}=${x.w}x${x.h}${(x.h < MIN || x.w < MIN) ? " FAIL" : " ok"}`).join("   "));
  }
}
await browser.close(); srv.close();
console.log(`\n${fails === 0 ? "PASS" : `FAIL — ${fails} link/width combinations under ${MIN}px`}`);
process.exit(fails === 0 ? 0 : 1);
