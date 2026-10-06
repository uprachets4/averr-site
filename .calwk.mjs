import { chromium } from "playwright";
const b=await chromium.launch();
for (const [d,label] of [["2026-10-10","Saturday"],["2026-10-11","Sunday"],["2026-10-09","Friday"]]) {
  const ctx=await b.newContext({viewport:{width:1280,height:900}});
  const p=await ctx.newPage();
  await p.goto(`https://cal.com/prachets/discoverycall?date=${d}`,{waitUntil:"domcontentloaded",timeout:60000});
  await p.waitForTimeout(7000);
  const r=await p.evaluate(()=>{
    const t=document.body.innerText;
    const slots=(t.match(/\b\d{1,2}:\d{2}(am|pm)?\b/gi)||[]).length;
    const noSlots=/no (available )?slots|All booked|unavailable/i.test(t);
    const dur=(t.match(/\b(\d{2})m\b/)||[])[1]||"?";
    return {slots, noSlots, dur};
  });
  console.log(`${label} ${d}:  time-slot-ish matches=${r.slots}  "no slots" text=${r.noSlots}  event duration=${r.dur}m`);
  await ctx.close();
}
await b.close();
