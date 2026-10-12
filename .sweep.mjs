import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const ROUTES = [
  "/",
  "/work",
  "/services",
  "/about",
  "/contact",
  "/work/cg-walls-and-floors",
  "/work/capitalcommand",
  "/work/sift",
  "/work/cadencestack",
  "/nope",
];

const b = await chromium.launch();
let pill = 0;
let dollarHits = [];
let overflow = [];

for (const r of ROUTES) {
  const p = await b.newPage({ viewport: { width: 375, height: 812 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 90)));
  await p.goto(BASE + r, { waitUntil: "load" });
  await p.waitForTimeout(1600);
  // walk the page so lazy sections mount
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 700) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(60);
  }
  await p.waitForTimeout(600);
  const m = await p.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const text = document.body.innerText;
    const dollars = (text.match(/\$/g) || []).length;
    const sample = dollars
      ? text.split("\n").filter((l) => l.includes("$")).slice(0, 3)
      : [];
    return {
      docW,
      win: window.innerWidth,
      pills: document.querySelectorAll(".pill-hl, [data-pillhl]").length,
      dollars,
      sample,
    };
  });
  pill += m.pills;
  if (m.dollars) dollarHits.push(`${r}: ${m.dollars} ${JSON.stringify(m.sample)}`);
  if (m.docW > m.win) overflow.push(`${r}: ${m.docW} > ${m.win}`);
  console.log(
    `${r.padEnd(28)} docW=${m.docW} (win ${m.win})  PillHl=${m.pills}  $=${m.dollars}  errors=${errs.length}${errs.length ? " :: " + errs[0] : ""}`
  );
  await p.close();
}
console.log("\nTOTAL PillHl across routes:", pill);
console.log("overflow at 375:", overflow.length ? overflow.join(" | ") : "NONE");
console.log("dollar signs:", dollarHits.length ? dollarHits.join(" | ") : "NONE");
await b.close();
