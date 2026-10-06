import { chromium } from "playwright";
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}});
const p=await ctx.newPage();
// does the hosted Cal page accept notes / name / email prefill?
const url="https://cal.com/prachets/discoverycall?date=2026-10-09&notes=Northgate%20Renovations";
const res=await p.goto(url,{waitUntil:"domcontentloaded",timeout:60000}).catch(e=>({status:()=>String(e).slice(0,60)}));
console.log("hosted page status:", typeof res.status==="function"?res.status():res);
await p.waitForTimeout(6000);
console.log("final URL:", p.url());
const t=await p.evaluate(()=>document.body.innerText.slice(0,300).replace(/\s+/g," "));
console.log("body head:", t);
await b.close();
