import { chromium } from "playwright";
/**
 * Wait until the PAGE requests the expected chunk — not merely until
 * the asset returns 200. The edge serves stale HTML for a while after
 * the asset is uploaded, which has fooled me three times (§5.50).
 *
 *   node .await.mjs About-BPP9HJDG.js
 */
const want = process.argv[2];
const route = process.argv[3] || "/about";
const asset = want.split("-")[0];
if (!want) throw new Error("usage: node .await.mjs <chunk filename>");
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";

const b = await chromium.launch();
const deadline = Date.now() + 10 * 60 * 1000;
let seen = "";
while (Date.now() < deadline) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const req = [];
  p.on("request", (r) => {
    const u = r.url();
    if (u.includes(`/assets/${asset}`)) req.push(u.split("/assets/")[1]);
  });
  try {
    await p.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    await p.waitForTimeout(1800);
  } catch {}
  seen = req.join(",");
  await ctx.close();
  if (seen.includes(want)) {
    console.log("SERVING", want);
    await b.close();
    process.exit(0);
  }
  console.log("  still serving", seen || "(none)", "— waiting");
  await new Promise((r) => setTimeout(r, 25000));
}
console.log("TIMED OUT still serving", seen);
await b.close();
process.exit(1);
