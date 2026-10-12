import { chromium } from "playwright";
const BASE="https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const PROBE=`window.__m={lcp:0,el:"",cls:0,fcp:0};
new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__m.lcp=e.startTime;const x=e.element;window.__m.el=x?x.tagName+" "+(x.textContent||"").trim().slice(0,22):"";}}).observe({type:"largest-contentful-paint",buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__m.cls+=e.value}).observe({type:"layout-shift",buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.name==="first-contentful-paint")window.__m.fcp=e.startTime}).observe({type:"paint",buffered:true});`;
const acc=new Map(); const b=await chromium.launch();
for(let r=0;r<5;r++) for(const [path,name] of [["/services","services"],["/","home"]]){
  const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,timezoneId:"America/Toronto"});
  const p=await ctx.newPage(); const cdp=await ctx.newCDPSession(p);
  await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
  await p.addInitScript(PROBE);
  await p.goto(BASE+path,{waitUntil:"load",timeout:90000}); await p.waitForTimeout(6000);
  const m=await p.evaluate("window.__m");
  if(!acc.has(name)) acc.set(name,{lcp:[],cls:[],fcp:[],el:""});
  const a=acc.get(name); a.lcp.push(m.lcp); a.cls.push(m.cls); a.fcp.push(m.fcp); a.el=m.el;
  await ctx.close();
}
const med=a=>[...a].sort((x,y)=>x-y)[1];
for(const [n,a] of acc) console.log(`${n.padEnd(9)} LCP ${Math.round(med(a.lcp))} [${a.lcp.map(v=>Math.round(v)).join(",")}]  FCP ${Math.round(med(a.fcp))}  CLS ${med(a.cls).toFixed(3)}  ${med(a.lcp)<2500?"PASS":"FAIL"} | ${a.el}`);
await b.close();
