import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const b = await chromium.launch();

/* ── 1. zero cal.com before approach ─────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cal = [];
  p.on("request", (r) => { if (r.url().includes("cal.com")) cal.push(r.url()); });
  await p.goto(BASE + "/contact", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(3000);
  console.log("CAL requests on load (expect 0):", cal.length);
  // scroll until the booking section is one viewport away
  await p.evaluate(() => document.getElementById("book").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(3500);
  console.log("CAL requests after reaching the booking:", cal.length > 0 ? `${cal.length} ✓ loaded` : "0 ✗ never loaded");
  await p.waitForTimeout(3000);
  const slots = await p.evaluate(() => {
    const f = document.querySelector(".bk-body iframe");
    return { iframe: !!f, h: f ? Math.round(f.getBoundingClientRect().height) : 0 };
  });
  console.log("CAL iframe:", JSON.stringify(slots));
  await p.screenshot({ path: `${D}/c19-booking.png` });
  await p.close();
}

/* ── 2. the ?date / ?notes handoff ───────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cal = [];
  p.on("request", (r) => { if (r.url().includes("cal.com")) cal.push(r.url()); });
  await p.goto(BASE + "/contact?date=2026-11-12&notes=Harbourview%20Bakehouse", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(4000);
  console.log("\nHANDOFF cal requests immediately (expect >0, it was asked for):", cal.length);
  console.log("HANDOFF business prefilled:", JSON.stringify(await p.evaluate(() => {
    const el = [...document.querySelectorAll("input")].find((i) => (i.previousElementSibling?.textContent || "").includes("Business"));
    return el ? el.value : "(field not found)";
  })));
  const url = cal.find((u) => u.includes("date=")) || "";
  console.log("HANDOFF date reached cal:", url.includes("2026-11-12") ? "yes" : `no — ${url.slice(0, 90)}`);
  await p.screenshot({ path: `${D}/c19-handoff.png` });
  await p.close();
}

/* ── 3. the preview composes, four combinations ──────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/contact", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(900);
  const body = () => p.evaluate(() => document.querySelector(".rp-body").innerText.replace(/\n+/g, " / ").slice(0, 150));
  const head = () => p.evaluate(() => [...document.querySelectorAll(".rp-rv")].map((e) => e.textContent).join(" | "));

  console.log("\nPREVIEW 1 empty:", await body());
  const inputs = await p.$$(".bs-input");
  await inputs[0].fill("Sam Okafor");
  await p.waitForTimeout(400);
  console.log("PREVIEW 2 name only:", await body());
  await inputs[1].fill("sam@harbourview.ca");
  await inputs[2].fill("Harbourview Bakehouse");
  await p.waitForTimeout(400);
  console.log("PREVIEW 3 +email +business:", await head(), "||", await body());
  await p.locator(".bs-chip").nth(0).click();
  await p.locator(".bs-chip").nth(1).click();
  await p.waitForTimeout(500);
  console.log("PREVIEW 4 +two pillars:", await body());
  await p.screenshot({ path: `${D}/c19-preview.png` });

  /* ── 4. validation microcopy ── */
  const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(BASE + "/contact", { waitUntil: "load", timeout: 90000 });
  await p2.waitForTimeout(2000);
  await p2.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p2.waitForTimeout(700);
  await p2.locator('button[aria-label="Send your brief"], .bs-submit button, .bs-submit a').first().click();
  await p2.waitForTimeout(600);
  console.log("\nVALIDATION:", JSON.stringify(await p2.evaluate(() =>
    [...document.querySelectorAll(".bs-err")].map((e) => e.textContent))));
  await p2.close();

  /* ── 5. the mocked submit → fold → receipt ── */
  await p.goto(BASE + "/contact?mockSend=1", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(800);
  const f = await p.$$(".bs-input");
  await f[0].fill("Sam Okafor");
  await f[1].fill("sam@harbourview.ca");
  await f[2].fill("Harbourview Bakehouse");
  await p.locator(".bs-chip").nth(0).click();
  await f[3].fill("Soft launch in the spring");
  await f[4].fill("A new site for the bakery, plus online ordering.");
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${D}/c19-submit-0.png` });
  await p.locator(".bs-submit button, .bs-submit a").first().click();
  for (const [i, ms] of [160, 260, 420, 900].entries()) {
    await p.waitForTimeout(i === 0 ? ms : ms - [160, 260, 420, 900][i - 1]);
    const st = await p.evaluate(() => {
      const d = document.querySelector(".bs-draft");
      const r = document.querySelector(".bs-receipt");
      const o = document.querySelector(".bs-outbox");
      return {
        draft: getComputedStyle(d).transform.slice(0, 34),
        draftOpacity: getComputedStyle(d).opacity.slice(0, 4),
        receipt: r ? getComputedStyle(r).opacity.slice(0, 4) : "absent",
        outbox: getComputedStyle(o).opacity.slice(0, 4),
      };
    });
    console.log(`  submit +${[160, 260, 420, 900][i]}ms`, JSON.stringify(st));
    await p.screenshot({ path: `${D}/c19-submit-${i + 1}.png` });
  }
  console.log("RECEIPT:", JSON.stringify(await p.evaluate(() => {
    const r = document.querySelector(".bs-receipt");
    return r ? r.innerText.replace(/\n+/g, " / ") : "absent";
  })));

  /* ── 6. the failure path ── */
  await p.goto(BASE + "/contact?mockSend=1&mockFail=1", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(800);
  const g = await p.$$(".bs-input");
  await g[0].fill("Sam Okafor");
  await g[1].fill("sam@harbourview.ca");
  await g[4].fill("A new site for the bakery.");
  await p.locator(".bs-submit button, .bs-submit a").first().click();
  await p.waitForTimeout(1400);
  console.log("\nFAILURE:", JSON.stringify(await p.evaluate(() => {
    const e = document.querySelector(".bs-error");
    const a = document.querySelector(".bs-mailto");
    return {
      text: e ? e.innerText.replace(/\n+/g, " / ") : "absent",
      mailtoPrefilled: a ? decodeURIComponent(a.getAttribute("href")).slice(0, 120) : "absent",
      serverWordsLeaked: document.body.innerText.includes("RESEND") || document.body.innerText.includes("status "),
    };
  })));
  await p.screenshot({ path: `${D}/c19-failure.png` });
  await p.close();
}
await b.close();
