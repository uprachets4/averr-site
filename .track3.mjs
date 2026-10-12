import { chromium } from "playwright";

const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const CENTRES = [0.04, 0.335, 0.665, 0.96];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "networkidle" });
await p.waitForTimeout(1000);

const base = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  const w = s.parentElement;
  return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
});
async function toPanel(i) {
  await p.evaluate((t) => window.scrollTo(0, t), Math.round(base.top + base.travel * CENTRES[i]));
  await p.waitForTimeout(600);
}
const frameLabel = (i) =>
  p.evaluate((idx) => {
    const tr = document.querySelector('section[aria-label="How the studio works"] div');
    return tr.children[idx].querySelector(".pt-demo > div > div > span").textContent.trim();
  }, i);

/* ── 01 template ↔ crafted, by mouse then by keyboard ───────────── */
await toPanel(0);
console.log("01 initial label:", await frameLabel(0));
const card = p.locator(".ttc-card").first();
await card.hover();
await p.waitForTimeout(450);
console.log("01 after hover:", await frameLabel(0));
const craftedOpacity = await p.evaluate(() => {
  const c = document.querySelector(".ttc-card");
  return [...c.children].map((row) => +getComputedStyle(row.children[0]).opacity.slice(0, 4));
});
console.log("01 crafted rows opacity on hover:", JSON.stringify(craftedOpacity));
await p.mouse.move(20, 20);
await p.waitForTimeout(450);
console.log("01 after mouse away:", await frameLabel(0));
// keyboard: focus the card and press it
await p.evaluate(() => document.querySelector(".ttc-card").focus());
await p.waitForTimeout(450);
console.log("01 after focus (keyboard):", await frameLabel(0));
const outline = await p.evaluate(() => {
  const cs = getComputedStyle(document.querySelector(".ttc-card"));
  return cs.outlineWidth + " " + cs.outlineStyle;
});
console.log("01 focus ring:", outline);
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector(".ttc-card").blur());
await p.waitForTimeout(450);
console.log("01 after Enter + blur (pinned):", await frameLabel(0));
await p.keyboard.press("Enter").catch(() => {});

/* ── 02 the sheet replays, by click then by keyboard ────────────── */
await toPanel(1);
const settled = await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const sw = tr.children[1].querySelectorAll(".pt-demo span[style*='border-radius: 8px']");
  return [...sw].map((s) => +getComputedStyle(s.parentElement).opacity.slice(0, 4));
});
console.log("02 swatch opacity on arrival:", JSON.stringify(settled));
const replay = p.locator(".ds-replay").first();
await replay.click();
await p.waitForTimeout(120);
const midRun = await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const sw = tr.children[1].querySelectorAll(".pt-demo span[style*='border-radius: 8px']");
  return [...sw].map((s) => +getComputedStyle(s.parentElement).opacity.slice(0, 4));
});
console.log("02 swatch opacity 120ms into replay (click):", JSON.stringify(midRun));
await p.waitForTimeout(900);
console.log("02 settled again:", JSON.stringify(await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const sw = tr.children[1].querySelectorAll(".pt-demo span[style*='border-radius: 8px']");
  return [...sw].map((s) => +getComputedStyle(s.parentElement).opacity.slice(0, 4));
})));
await p.evaluate(() => document.querySelector(".ds-replay").focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(120);
console.log("02 swatch opacity 120ms into replay (keyboard):", JSON.stringify(await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const sw = tr.children[1].querySelectorAll(".pt-demo span[style*='border-radius: 8px']");
  return [...sw].map((s) => +getComputedStyle(s.parentElement).opacity.slice(0, 4));
})));

/* ── 03 the CTA, and the two curves ─────────────────────────────── */
await toPanel(2);
const cta = await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const el = tr.children[2].querySelector(".pt-demo a, .pt-demo button[aria-label*='magnetic']");
  return el ? { tag: el.tagName, text: el.textContent.trim(), label: el.getAttribute("aria-label") } : null;
});
console.log("03 MagneticCTA:", JSON.stringify(cta));
async function dotAt(ms, which) {
  const btn = p.locator(`.ml-seg`).nth(which);
  await btn.click();
  await p.waitForTimeout(ms);
  return p.evaluate(() => {
    const tr = document.querySelector('section[aria-label="How the studio works"] div');
    const dot = tr.children[2].querySelector(".pt-demo span[aria-hidden='true'][style*='border-radius: 999px']");
    return dot ? Math.round(new DOMMatrixReadOnly(getComputedStyle(dot).transform).m41) : null;
  });
}
const lin = await dotAt(330, 0);
const eas = await dotAt(330, 1);
console.log(`03 dot x at ~330ms — linear:${lin}  eased:${eas}  (eased should be further)`);
const pressed = await p.evaluate(() =>
  [...document.querySelectorAll(".ml-seg")].map((b) => b.getAttribute("aria-pressed"))
);
console.log("03 segment aria-pressed:", JSON.stringify(pressed));
await p.evaluate(() => document.querySelectorAll(".ml-seg")[0].focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(200);
console.log("03 aria-pressed after keyboard Enter on Linear:", JSON.stringify(
  await p.evaluate(() => [...document.querySelectorAll(".ml-seg")].map((b) => b.getAttribute("aria-pressed")))
));

/* ── 04 the slider touches one half only ────────────────────────── */
await toPanel(3);
function sig() {
  return p.evaluate(() => {
    const tr = document.querySelector('section[aria-label="How the studio works"] div');
    const mocks = tr.children[3].querySelectorAll(".pt-demo div[style*='aspect-ratio']");
    function snap(el) {
      const out = [];
      for (const n of [el, ...el.querySelectorAll("*")]) {
        const cs = getComputedStyle(n);
        const r = n.getBoundingClientRect();
        out.push([
          n.tagName, Math.round(r.width), Math.round(r.height),
          cs.filter, cs.opacity, cs.color, cs.backgroundColor,
          cs.fontSize, cs.letterSpacing, cs.textShadow,
        ].join("|"));
      }
      return out.join("\n");
    }
    return { trend: snap(mocks[0]), crafted: snap(mocks[1]) };
  });
}
const before = await sig();
await p.evaluate(() => document.getElementById("ages-well-year").focus());
for (let i = 0; i < 3; i++) {
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(150);
}
await p.waitForTimeout(500);
const year = await p.evaluate(() => document.getElementById("ages-well-year").value);
const after = await sig();
console.log("04 year after 3x ArrowRight:", year);
console.log("04 trend-led half changed:", before.trend !== after.trend);
console.log("04 built-to-last half IDENTICAL:", before.crafted === after.crafted);
if (before.crafted !== after.crafted) {
  const a = before.crafted.split("\n"), c = after.crafted.split("\n");
  a.forEach((l, i) => { if (l !== c[i]) console.log("   DIFF", l, "=>", c[i]); });
}
const tagNow = await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  const tag = [...tr.children[3].querySelectorAll("span")].find((s) => s.textContent.trim() === "2026 TREND");
  return tag ? { opacity: getComputedStyle(tag).opacity, fontSize: getComputedStyle(tag).fontSize } : null;
});
console.log("04 '2026 TREND' tag at 2029:", JSON.stringify(tagNow));

/* ── the progress marks jump ─────────────────────────────────────── */
await toPanel(0);
await p.locator(".pt-mark").nth(2).click();
await p.waitForTimeout(1400);
const landed = await p.evaluate(() => {
  const tr = document.querySelector('section[aria-label="How the studio works"] div');
  return {
    y: Math.round(window.scrollY),
    xVw: +(new DOMMatrixReadOnly(getComputedStyle(tr).transform).m41 / window.innerWidth).toFixed(2),
    on: [...document.querySelectorAll(".pt-mark")].findIndex((e) => e.classList.contains("pt-mark--on")),
  };
});
console.log("MARK click 03 ->", JSON.stringify(landed), "expected y≈", Math.round(base.top + base.travel * CENTRES[2]));

await b.close();
