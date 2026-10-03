import { useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import type { BeatSpec, ScreenProps } from "./BuildScreens";

/**
 * The six Grow-chapter screens.
 *
 * A map app, a sequence tool, an ads manager, an A/B test, a content
 * calendar and a monthly report — six shapes of software, none of them
 * resembling a Design or Automate screen.
 *
 * Everything is React/CSS/SVG. Every business, broker, street and figure
 * is invented; no real marks, no imitation of any provider's UI beyond
 * generic map and table conventions. **No currency anywhere** — the
 * studio publishes no prices, and that applies to illustrative data too.
 */

function at(t: number, a: number, b: number) {
  if (b === a) return t >= b ? 1 : 0;
  const r = (t - a) / (b - a);
  return r < 0 ? 0 : r > 1 ? 1 : r;
}

type P = ScreenProps;
/** Mobile floor. Nothing in a compact layout goes under this. */
const MIN = 11;
const GREEN = "#1F5D4C";
const AMBER = "#C2641F";

/* ═══════════════════════════════════════════════════════════════
   G1 · Local search — map app
   ═══════════════════════════════════════════════════════════════ */

type Biz = { name: string; rating: string; reviews: number; me?: boolean };
const RESULTS_BEFORE: Biz[] = [
  { name: "Lakeridge Basements", rating: "4.8", reviews: 186 },
  { name: "Harwood Reno Co.", rating: "4.7", reviews: 142 },
  { name: "Brock & Bay Interiors", rating: "4.7", reviews: 121 },
  { name: "Pickering Finish Works", rating: "4.6", reviews: 98 },
  { name: "Rossland Home Studio", rating: "4.6", reviews: 77 },
  { name: "Taunton Craft Build", rating: "4.5", reviews: 64 },
  { name: "Northgate Home Services", rating: "4.9", reviews: 38, me: true },
];
const RESULTS_AFTER: Biz[] = [
  { name: "Lakeridge Basements", rating: "4.8", reviews: 186 },
  { name: "Northgate Home Services", rating: "4.9", reviews: 212, me: true },
  { name: "Harwood Reno Co.", rating: "4.7", reviews: 142 },
  { name: "Brock & Bay Interiors", rating: "4.7", reviews: 121 },
  { name: "Pickering Finish Works", rating: "4.6", reviews: 98 },
  { name: "Rossland Home Studio", rating: "4.6", reviews: 77 },
  { name: "Taunton Craft Build", rating: "4.5", reviews: 64 },
];

export function ScreenMap({ local, compact }: P) {
  const [climbed, setClimbed] = useState(false);
  const [reviews, setReviews] = useState(38);
  useMotionValueEvent(local, "change", function drive(t) {
    setClimbed(t > 0.5);
    setReviews(Math.round(38 + (212 - 38) * at(t, 0.5, 0.74)));
  });
  const list = climbed ? RESULTS_AFTER : RESULTS_BEFORE;

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ background: "#F2F1ED", borderRadius: 8, padding: "9px 12px", fontSize: MIN + 1, color: "rgba(27,34,32,0.65)", marginBottom: 12 }}>
          basement renovation near me
        </div>
        {list.slice(0, 4).map((b, i) => (
          <div key={b.name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderTop: i ? "1px solid rgba(27,34,32,0.08)" : "none", background: b.me ? "rgba(31,93,76,0.07)" : "transparent", borderRadius: b.me ? 7 : 0, paddingLeft: b.me ? 8 : 0 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, color: "rgba(27,34,32,0.45)", width: 14 }}>{i + 1}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: b.me ? 600 : 400 }}>{b.name}</span>
              <span style={{ display: "block", fontSize: MIN, color: "rgba(27,34,32,0.55)" }}>
                ★ {b.rating} · {b.me ? reviews : b.reviews} reviews
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#EFEDE6", overflow: "hidden", color: "#1B2220" }}>
      {/* results panel */}
      <div style={{ width: "38%", flex: "0 0 38%", background: "#fff", borderRight: "1px solid rgba(27,34,32,0.1)", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(27,34,32,0.08)" }}>
          <div style={{ background: "#F2F1ED", borderRadius: 999, padding: "8px 13px", fontSize: 10.5, color: "rgba(27,34,32,0.7)", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.6" stroke="rgba(27,34,32,0.5)" strokeWidth="1.4" /><path d="M10.6 10.6 L14 14" stroke="rgba(27,34,32,0.5)" strokeWidth="1.4" strokeLinecap="round" /></svg>
            basement renovation near me
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.42)", marginTop: 8 }}>
            7 results · Durham Region
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: "4px 8px" }}>
          {list.map((b, i) => (
            <motion.div
              key={b.name}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ display: "flex", gap: 9, alignItems: "center", padding: "8px 7px", borderRadius: 7, background: b.me ? "rgba(31,93,76,0.08)" : "transparent", boxShadow: b.me ? `inset 0 0 0 1px rgba(31,93,76,0.3)` : "none" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: b.me ? GREEN : "rgba(27,34,32,0.4)", width: 13, fontWeight: b.me ? 600 : 400 }}>{i + 1}</span>
              <span style={{ width: 26, height: 26, borderRadius: 5, background: b.me ? GREEN : "rgba(27,34,32,0.1)", flex: "0 0 26px" }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 10.5, fontWeight: b.me ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.name}</span>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.5)" }}>
                  ★ {b.rating} · {b.me ? reviews : b.reviews} reviews
                </span>
              </span>
            </motion.div>
          ))}
        </div>
        {/* profile card */}
        <div style={{ borderTop: "1px solid rgba(27,34,32,0.1)", padding: 12 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 7 }}>Northgate Home Services</div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            {["linear-gradient(135deg,#D9CDB4,#A08A66)", "linear-gradient(135deg,#2F5D50,#16211D)", "linear-gradient(135deg,#C9C3B6,#8E887C)"].map((g, i) => (
              <span key={i} style={{ flex: 1, height: 26, borderRadius: 4, background: g }} />
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, background: climbed ? GREEN : "rgba(27,34,32,0.1)", color: climbed ? "#fff" : "rgba(27,34,32,0.6)", borderRadius: 6, padding: "6px 0", textAlign: "center", transition: "all 260ms ease" }}>
            {climbed ? "Update posted ✓" : "Publish update"}
          </div>
        </div>
      </div>

      {/* map
          Drawn with positioned elements, not a scaled SVG. A 300x220
          viewBox with preserveAspectRatio="slice" was being blown up
          about 3x in this panel, which turned 8px labels into 26px type
          and the roads into grey slabs. Percentages and fixed font sizes
          cannot do that. */}
      <div style={{ flex: 1, position: "relative", minWidth: 0, background: "#EFEDE6", overflow: "hidden" }}>
        {/* Blocks before roads: an even grid of lines on a flat ground
            read as a wireframe table rather than a map. Irregular block
            sizes, a couple of diagonals and slightly varied ground tints
            are what make it scan as streets. */}
        {([[0,0,17,26],[17,0,21,26],[38,0,24,18],[62,0,19,26],[81,0,19,18],
           [0,26,17,22],[17,26,21,22],[38,18,24,30],[62,26,19,22],[81,18,19,30],
           [0,48,17,24],[17,48,21,24],[62,48,19,24],[81,48,19,24]] as Array<[number,number,number,number]>)
          .map(([x,y,w,h],i)=>(
          <span key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:`${w}%`, height:`${h}%`, background: i%3===0 ? "#E9E6DD" : i%3===1 ? "#EDEAE1" : "#E6E3D9" }} />
        ))}
        {/* lake */}
        <div style={{ position: "absolute", left: "-6%", right: "-6%", bottom: "-10%", height: "34%", background: "#C3D4DA", borderRadius: "50% 50% 0 0 / 70% 60% 0 0" }} />
        {/* arterial + side streets */}
        {[26, 48, 72].map((t) => (
          <span key={`h${t}`} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, height: 6, background: "#FBFAF7" }} />
        ))}
        {[18, 30].map((t) => (
          <span key={`hs${t}`} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, height: 3, background: "rgba(255,255,255,0.8)" }} />
        ))}
        <span style={{ position: "absolute", left: 0, right: 0, top: "40%", height: 9, background: "#F2E3C2" }} />
        {[17, 38, 62, 81].map((l) => (
          <span key={`v${l}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${l}%`, width: 5, background: "#FBFAF7" }} />
        ))}
        {[9, 52].map((l) => (
          <span key={`vs${l}`} style={{ position: "absolute", top: 0, bottom: "24%", left: `${l}%`, width: 2.5, background: "rgba(255,255,255,0.75)" }} />
        ))}
        {/* a diagonal, because nothing real is all right angles */}
        <span style={{ position: "absolute", left: "-10%", top: "58%", width: "70%", height: 5, background: "#FBFAF7", transform: "rotate(-11deg)", transformOrigin: "left center" }} />
        {/* neighbourhood labels, at real sizes */}
        {([["Pickering", 4, 8], ["Ajax", 22, 52], ["Whitby", 52, 30], ["Oshawa", 84, 62]] as Array<[string, number, number]>).map(([t, x, y]) => (
          <span key={t} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", color: "rgba(27,34,32,0.46)" }}>
            {t}
          </span>
        ))}
        {/* competitor pins */}
        {([[28, 22], [66, 18], [44, 64], [86, 42], [12, 68]] as Array<[number, number]>).map(([x, y], i) => (
          <span key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: 9, height: 9, borderRadius: "50%", background: "rgba(27,34,32,0.3)", border: "1.5px solid rgba(255,255,255,0.85)", transform: "translate(-50%,-50%)" }} />
        ))}
        {/* Northgate */}
        <motion.div
          animate={{ scale: climbed ? 1 : 0.84 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          style={{ position: "absolute", left: "52%", top: "48%", transform: "translate(-50%,-100%)" }}
        >
          <svg width="28" height="36" viewBox="0 0 30 38" fill="none">
            <path d="M15 37 C15 37 28 22 28 14 A13 13 0 1 0 2 14 C2 22 15 37 15 37 Z" fill={GREEN} />
            <circle cx="15" cy="14" r="5" fill="#fff" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G2 · Outreach campaigns — sequence tool
   ═══════════════════════════════════════════════════════════════ */

const PROSPECTS: Array<[string, string, string]> = [
  ["Nadia Okonkwo", "Harbourline Realty", "Replied"],
  ["Greg Vaillancourt", "Stonecrest Property", "Opened"],
  ["Mei-Ling Chau", "Birchway Realty Group", "Replied"],
  ["Owen Brathwaite", "Lakeshore & Co.", "Sent"],
  ["Farah Desai", "Kingsway Residential", "Sent"],
];
const STATUS_C: Record<string, [string, string]> = {
  Replied: ["rgba(31,93,76,0.14)", GREEN],
  Opened: ["rgba(194,100,31,0.14)", AMBER],
  Sent: ["rgba(27,34,32,0.08)", "rgba(27,34,32,0.55)"],
};

export function ScreenSequence({ local, compact }: P) {
  const [live, setLive] = useState(false);
  const [sent, setSent] = useState(0);
  useMotionValueEvent(local, "change", function drive(t) {
    setLive(t > 0.44);
    setSent(Math.round(142 * at(t, 0.44, 0.76)));
  });

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Pre-listing outreach</div>
        <div style={{ fontSize: MIN, color: "rgba(27,34,32,0.55)", marginBottom: 13 }}>
          {sent} sent · 2 replies
        </div>
        {PROSPECTS.slice(0, 4).map(([n, b, st]) => {
          const [bg, fg] = STATUS_C[st];
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 0", borderTop: "1px solid rgba(27,34,32,0.08)" }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 12 }}>{n}</span>
                <span style={{ display: "block", fontSize: MIN, color: "rgba(27,34,32,0.55)" }}>{b}</span>
              </span>
              <span style={{ fontSize: MIN, background: bg, color: fg, borderRadius: 999, padding: "2px 8px" }}>{live ? st : "Draft"}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.3fr 1fr", background: "#fff", color: "#1B2220", overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", borderRight: "1px solid rgba(27,34,32,0.1)", display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Pre-listing outreach</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)", marginTop: 2 }}>
              realtors · Durham Region · 142 prospects
            </div>
          </div>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10.5, fontWeight: 600, background: live ? GREEN : "rgba(27,34,32,0.1)", color: live ? "#fff" : "rgba(27,34,32,0.6)", borderRadius: 7, padding: "7px 13px", transition: "all 260ms ease" }}>
            {live ? "Running" : "Launch sequence"}
          </span>
        </div>

        {/* steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["Email 1", "wait 3d", "Email 2", "Call task"].map((s, i) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, background: i % 2 ? "transparent" : live ? "rgba(31,93,76,0.12)" : "rgba(27,34,32,0.07)", color: i % 2 ? "rgba(27,34,32,0.45)" : live ? GREEN : "rgba(27,34,32,0.6)", border: i % 2 ? "1px dashed rgba(27,34,32,0.2)" : "none", borderRadius: 6, padding: "5px 9px", transition: "all 300ms ease" }}>
                {s}
              </span>
              {i < 3 ? <span style={{ color: "rgba(27,34,32,0.3)", fontSize: 9 }}>→</span> : null}
            </span>
          ))}
        </div>

        {/* table */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.2fr 0.7fr", gap: 8, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(27,34,32,0.4)", paddingBottom: 7, borderBottom: "1px solid rgba(27,34,32,0.1)" }}>
            <span>Prospect</span><span>Brokerage</span><span>Status</span>
          </div>
          {PROSPECTS.map(([n, b, st]) => {
            const [bg, fg] = STATUS_C[st];
            return (
              <div key={n} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.2fr 0.7fr", gap: 8, alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(27,34,32,0.06)", fontSize: 10.5 }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
                <span style={{ color: "rgba(27,34,32,0.6)", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b}</span>
                <span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, background: live ? bg : "rgba(27,34,32,0.06)", color: live ? fg : "rgba(27,34,32,0.4)", borderRadius: 999, padding: "2.5px 8px", transition: "all 300ms ease" }}>
                    {live ? st : "Draft"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 20, fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(27,34,32,0.55)" }}>
          <span><strong style={{ color: "#1B2220", fontSize: 13 }}>{sent}</strong> sent</span>
          <span><strong style={{ color: GREEN, fontSize: 13 }}>{live ? 2 : 0}</strong> replies</span>
          <span><strong style={{ color: "#1B2220", fontSize: 13 }}>{live ? 31 : 0}</strong> opens</span>
        </div>
      </div>

      {/* email preview */}
      <div style={{ padding: "16px 18px", background: "#FAF9F6", display: "flex", flexDirection: "column", gap: 11, minHeight: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,34,32,0.42)" }}>
          Email 1 · preview
        </div>
        <div style={{ background: "#fff", border: "1px solid rgba(27,34,32,0.1)", borderRadius: 9, padding: 13, fontSize: 10.5, lineHeight: 1.68, flex: 1, minHeight: 0 }}>
          <div style={{ fontWeight: 600, marginBottom: 7 }}>Quick one about 118 Ravenscroft</div>
          Hi <mark style={{ background: "rgba(31,93,76,0.14)", color: GREEN, padding: "0 3px", borderRadius: 3 }}>Nadia</mark> — saw the listing at{" "}
          <mark style={{ background: "rgba(31,93,76,0.14)", color: GREEN, padding: "0 3px", borderRadius: 3 }}>118 Ravenscroft Rd</mark>{" "}
          come up. We do pre-listing basement and floor refreshes across{" "}
          <mark style={{ background: "rgba(31,93,76,0.14)", color: GREEN, padding: "0 3px", borderRadius: 3 }}>Ajax</mark>{" "}
          and can usually turn one around before the first open house. Worth a walkthrough?
          <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>
            — Marcus, Northgate Home Services
          </div>
        </div>
        <motion.div
          animate={{ opacity: live ? 1 : 0, y: live ? 0 : 8 }}
          transition={{ duration: 0.3 }}
          style={{ background: "#fff", border: `1px solid rgba(31,93,76,0.3)`, borderRadius: 8, padding: 10, display: "flex", gap: 9, alignItems: "center" }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
          <span style={{ fontSize: 10 }}>
            <strong>Nadia Okonkwo</strong> replied · interested in a walkthrough
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G3 · Paid ads — ads manager (no currency anywhere)
   ═══════════════════════════════════════════════════════════════ */

const CAMPAIGNS: Array<[string, string, string, string, string, string]> = [
  ["Search · Basement finishing Durham", "18,420", "742", "4.0%", "61", "8.2%"],
  ["Local services · Ajax + Whitby", "9,180", "503", "5.5%", "44", "8.7%"],
  ["Social · Before/after reel", "41,260", "988", "2.4%", "27", "2.7%"],
];

export function ScreenAds({ local, compact }: P) {
  const [on, setOn] = useState(false);
  const [leads, setLeads] = useState(0);
  useMotionValueEvent(local, "change", function drive(t) {
    setOn(t > 0.46);
    setLeads(Math.round(27 * at(t, 0.46, 0.74)));
  });

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Campaigns</div>
        {CAMPAIGNS.map(([n, imp, , ctr, l], i) => (
          <div key={n} style={{ padding: "10px 0", borderTop: i ? "1px solid rgba(27,34,32,0.08)" : "none" }}>
            <div style={{ fontSize: 12, marginBottom: 4 }}>{n}</div>
            <div style={{ display: "flex", gap: 14, fontSize: MIN, color: "rgba(27,34,32,0.6)", fontFamily: "var(--font-mono)" }}>
              <span>{imp} impr</span><span>{ctr} CTR</span>
              <span style={{ color: GREEN }}>{i === 2 ? leads : l} leads</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", padding: "16px 20px", color: "#1B2220", display: "flex", flexDirection: "column", gap: 13, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Campaigns</div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>last 30 days</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>Performance only · no spend shown</span>
      </div>

      <div>
        <div style={{ display: "grid", gridTemplateColumns: "2.4fr 0.9fr 0.7fr 0.6fr 0.6fr 0.7fr", gap: 8, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(27,34,32,0.4)", paddingBottom: 7, borderBottom: "1px solid rgba(27,34,32,0.1)" }}>
          <span>Campaign</span><span>Impr.</span><span>Clicks</span><span>CTR</span><span>Leads</span><span>Conv.</span>
        </div>
        {CAMPAIGNS.map(([n, imp, clicks, ctr, l, conv], i) => {
          const isThird = i === 2;
          return (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "2.4fr 0.9fr 0.7fr 0.6fr 0.6fr 0.7fr", gap: 8, alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(27,34,32,0.06)", fontSize: 10.5, opacity: isThird && !on ? 0.45 : 1, transition: "opacity 300ms ease" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ width: 26, height: 15, borderRadius: 999, background: isThird ? (on ? GREEN : "rgba(27,34,32,0.18)") : GREEN, position: "relative", flex: "0 0 26px", transition: "background 260ms ease" }}>
                  <span style={{ position: "absolute", top: 2, left: isThird && !on ? 2 : 13, width: 11, height: 11, borderRadius: "50%", background: "#fff", transition: "left 260ms cubic-bezier(0.25,1,0.5,1)" }} />
                </span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{imp}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{clicks}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{ctr}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: GREEN }}>{isThird ? leads : l}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{conv}</span>
            </div>
          );
        })}
      </div>

      {/* ad previews */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid rgba(27,34,32,0.12)", borderRadius: 9, padding: 13 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,34,32,0.4)", marginBottom: 9 }}>Search ad</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.5)", marginBottom: 3 }}>Ad · northgate.ca/basements</div>
          <div style={{ fontSize: 12.5, color: "#2A4FA8", marginBottom: 4 }}>Basement Finishing in Durham Region</div>
          <div style={{ fontSize: 10, lineHeight: 1.55, color: "rgba(27,34,32,0.7)" }}>
            Licensed and insured since 2009. Free on-site estimate, usually within three days. Ajax · Pickering · Whitby · Oshawa.
          </div>
        </div>
        <div style={{ border: "1px solid rgba(27,34,32,0.12)", borderRadius: 9, padding: 13, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,34,32,0.4)", marginBottom: 9 }}>Social ad</div>
          <div style={{ flex: 1, borderRadius: 7, background: "linear-gradient(135deg,#2F5D50,#16211D)", position: "relative", overflow: "hidden", minHeight: 64 }}>
            <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(135deg,#B9B2A6,#8E877C)" }} />
            <span style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5, background: "rgba(255,255,255,0.7)" }} />
            <span style={{ position: "absolute", left: 8, bottom: 7, fontFamily: "var(--font-mono)", fontSize: 7.5, color: "#fff", opacity: 0.85 }}>BEFORE</span>
            <span style={{ position: "absolute", right: 8, bottom: 7, fontFamily: "var(--font-mono)", fontSize: 7.5, color: "#fff", opacity: 0.85 }}>AFTER</span>
          </div>
          <div style={{ fontSize: 9.5, marginTop: 7, color: "rgba(27,34,32,0.7)" }}>Six weeks, start to finish →</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G4 · Landing pages — A/B test
   ═══════════════════════════════════════════════════════════════ */

export function ScreenABTest({ local, compact }: P) {
  const [promoted, setPromoted] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setPromoted(t > 0.56);
  });

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#F7F7F4", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Landing page test</div>
        {[["A", "4.1%", false], ["B", "6.3%", true]].map(([v, c, win]) => (
          <div key={v as string} style={{ background: "#fff", border: `1px solid ${win ? "rgba(31,93,76,0.4)" : "rgba(27,34,32,0.12)"}`, borderRadius: 9, padding: 13, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Variant {v as string}</span>
              {win ? <span style={{ fontSize: MIN, background: GREEN, color: "#fff", borderRadius: 999, padding: "2px 8px" }}>Winner</span> : null}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: win ? GREEN : "rgba(27,34,32,0.7)", marginTop: 6 }}>{c as string}</div>
            <div style={{ fontSize: MIN, color: "rgba(27,34,32,0.55)" }}>conversion · illustrative</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#F7F7F4", padding: "16px 20px", color: "#1B2220", display: "flex", flexDirection: "column", gap: 13, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Landing page test</div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>2 variants · 14 days · illustrative</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, fontWeight: 600, background: promoted ? GREEN : "rgba(27,34,32,0.1)", color: promoted ? "#fff" : "rgba(27,34,32,0.6)", borderRadius: 7, padding: "7px 13px", transition: "all 260ms ease" }}>
          {promoted ? "B promoted ✓" : "Promote B"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
        <motion.div
          animate={{ flex: promoted ? 0.6 : 1, opacity: promoted ? 0.5 : 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
          style={{ background: "#fff", border: "1px solid rgba(27,34,32,0.12)", borderRadius: 9, padding: 12, minWidth: 0, display: "flex", flexDirection: "column" }}
        >
          <Badge label="Variant A" tone="plain" />
          <MiniPage layout="stacked" />
          <Conv value="4.1%" win={false} />
        </motion.div>

        <motion.div
          animate={{ flex: promoted ? 2.2 : 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 26 }}
          style={{ background: "#fff", border: `1px solid ${promoted ? "rgba(31,93,76,0.45)" : "rgba(27,34,32,0.12)"}`, borderRadius: 9, padding: 12, minWidth: 0, display: "flex", flexDirection: "column", boxShadow: promoted ? "0 8px 24px rgba(31,93,76,0.14)" : "none", transition: "box-shadow 300ms ease, border-color 300ms ease" }}
        >
          <Badge label="Variant B" tone="win" />
          <MiniPage layout="split" />
          <Conv value="6.3%" win />
        </motion.div>
      </div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "plain" | "win" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
      {tone === "win" ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, background: GREEN, color: "#fff", borderRadius: 999, padding: "2px 8px" }}>Winner</span>
      ) : null}
    </div>
  );
}

function MiniPage({ layout }: { layout: "stacked" | "split" }) {
  return (
    <div style={{ flex: 1, minHeight: 0, borderRadius: 6, background: "#FAF9F6", border: "1px solid rgba(27,34,32,0.08)", padding: 10, overflow: "hidden" }}>
      <div style={{ height: 8, borderRadius: 3, background: "#16211D", marginBottom: 8 }} />
      {layout === "stacked" ? (
        <>
          <div style={{ height: 30, borderRadius: 5, background: "rgba(31,93,76,0.14)", marginBottom: 7 }} />
          <div style={{ width: "70%", height: 5, borderRadius: 3, background: "rgba(27,34,32,0.16)", marginBottom: 5 }} />
          <div style={{ width: "52%", height: 5, borderRadius: 3, background: "rgba(27,34,32,0.12)", marginBottom: 9 }} />
          <div style={{ width: 62, height: 14, borderRadius: 999, background: AMBER }} />
        </>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: "88%", height: 7, borderRadius: 3, background: "rgba(27,34,32,0.2)", marginBottom: 5 }} />
            <div style={{ width: "66%", height: 7, borderRadius: 3, background: "rgba(27,34,32,0.16)", marginBottom: 9 }} />
            <div style={{ width: 58, height: 14, borderRadius: 999, background: GREEN }} />
          </div>
          <div style={{ flex: "0 0 38%", borderRadius: 5, background: "linear-gradient(135deg,#D9CDB4,#A08A66)", minHeight: 44 }} />
        </div>
      )}
    </div>
  );
}

function Conv({ value, win }: { value: string; win: boolean }) {
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: win ? GREEN : "rgba(27,34,32,0.7)", letterSpacing: "-0.02em" }}>{value}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>conversion</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "rgba(27,34,32,0.08)", marginTop: 6, overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", width: win ? "78%" : "51%", background: win ? GREEN : "rgba(27,34,32,0.3)" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G5 · Content — calendar
   ═══════════════════════════════════════════════════════════════ */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const POSTS: Record<number, Array<[string, string]>> = {
  2: [["post", "Basement reveal"]],
  4: [["video", "60-sec walkthrough"]],
  9: [["blog", "What permits cost you"]],
  11: [["post", "Crew spotlight"]],
  16: [["video", "Before / after"]],
  18: [["post", "5 flooring myths"]],
  23: [["blog", "Timeline, honestly"]],
  25: [["post", "Oshawa job done"]],
};
const KIND_C: Record<string, string> = { post: GREEN, video: AMBER, blog: "#3E7CA6" };

export function ScreenCalendar({ local, compact }: P) {
  const [scheduled, setScheduled] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setScheduled(t > 0.56);
  });
  const dragX = useTransform(local, (t) => at(t, 0.4, 0.56) * 196);
  const dragY = useTransform(local, (t) => at(t, 0.4, 0.56) * -44);

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>March · content</div>
        {[["Mon 2", "post", "Basement reveal"], ["Wed 4", "video", "60-sec walkthrough"], ["Thu 19", "post", scheduled ? "Scheduled Thu 9:00" : "Draft · unscheduled"]].map(([d, k, t]) => (
          <div key={d as string} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderTop: "1px solid rgba(27,34,32,0.08)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: KIND_C[k as string] }} />
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 12 }}>{t as string}</span>
              <span style={{ display: "block", fontSize: MIN, color: "rgba(27,34,32,0.55)" }}>{d as string} · {k as string}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1.5fr 1fr", background: "#fff", color: "#1B2220", overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", borderRight: "1px solid rgba(27,34,32,0.1)", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 11 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>March 2026</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)" }}>8 scheduled · 1 draft</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {WEEKDAYS.map((d) => (
            <span key={d} style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(27,34,32,0.4)", textAlign: "center" }}>{d}</span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 4, flex: 1, minHeight: 0 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const posts = POSTS[i] || [];
            const isTarget = i === 17;
            return (
              <div key={i} style={{ borderRadius: 5, background: "#FAF9F6", border: `1px solid ${isTarget && scheduled ? "rgba(31,93,76,0.45)" : "rgba(27,34,32,0.07)"}`, padding: 4, minHeight: 0, overflow: "hidden", transition: "border-color 300ms ease" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: "rgba(27,34,32,0.35)" }}>{i + 1}</span>
                {posts.map(([k, t]) => (
                  <span key={t} style={{ display: "block", marginTop: 2, fontSize: 7.5, lineHeight: 1.25, background: `${KIND_C[k]}22`, color: KIND_C[k], borderRadius: 3, padding: "2px 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t}
                  </span>
                ))}
                {isTarget && scheduled ? (
                  <span style={{ display: "block", marginTop: 2, fontSize: 7.5, lineHeight: 1.25, background: `${GREEN}22`, color: GREEN, borderRadius: 3, padding: "2px 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Quote-to-job
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        {/* the draft being dragged */}
        <motion.div
          style={{ position: "absolute", left: 24, bottom: 18, x: dragX, y: dragY, background: "#fff", border: `1px solid ${GREEN}`, borderRadius: 7, padding: "7px 11px", boxShadow: "0 8px 20px rgba(27,34,32,0.16)", fontSize: 9.5, display: scheduled ? "none" : "flex", alignItems: "center", gap: 7, zIndex: 5 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 2, background: GREEN }} />
          Quote-to-job, honestly
        </motion.div>
      </div>

      {/* composer */}
      <div style={{ padding: "16px 18px", background: "#FAF9F6", display: "flex", flexDirection: "column", gap: 11, minHeight: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,34,32,0.42)" }}>
          Composer
        </div>
        <div style={{ background: "#fff", border: "1px solid rgba(27,34,32,0.1)", borderRadius: 9, padding: 13, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN }} />
            <span>
              <span style={{ display: "block", fontSize: 10, fontWeight: 600 }}>Marcus Delacroix</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(27,34,32,0.45)" }}>Northgate Home Services</span>
            </span>
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.6, marginBottom: 9 }}>
            Most quotes die because nobody explains the timeline. Here's what six
            weeks on a basement actually looks like, week by week.
          </div>
          <div style={{ flex: 1, borderRadius: 6, background: "linear-gradient(135deg,#EFE7D8,#C9B593)", minHeight: 54, position: "relative", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: 10, top: 10, width: "46%", height: 6, borderRadius: 3, background: "rgba(22,33,29,0.35)" }} />
            <span style={{ position: "absolute", left: 10, top: 22, width: "30%", height: 6, borderRadius: 3, background: "rgba(22,33,29,0.22)" }} />
          </div>
          <div style={{ marginTop: 9, fontFamily: "var(--font-mono)", fontSize: 9, color: scheduled ? GREEN : "rgba(27,34,32,0.45)", transition: "color 300ms ease" }}>
            {scheduled ? "Scheduled Thu 9:00" : "Draft · not scheduled"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G6 · Reporting — monthly report
   ═══════════════════════════════════════════════════════════════ */

const CHANNELS: Array<[string, number, string]> = [
  ["Local search", 34, GREEN],
  ["Outreach", 26, AMBER],
  ["Paid", 19, "#3E7CA6"],
  ["Content", 14, "#6F7D78"],
  ["Referral", 7, "#A98C5F"],
];

export function ScreenReport({ local, compact }: P) {
  const [sent, setSent] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setSent(t > 0.58);
  });
  const draw = useTransform(local, (t) => at(t, 0.14, 0.46));

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B2220" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>March report</div>
        <div style={{ fontSize: MIN, color: "rgba(27,34,32,0.55)", marginBottom: 13 }}>Northgate Home Services</div>
        <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
          {[["100", "leads"], ["28", "booked"], ["Local", "top channel"]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: "#F7F7F4", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{v}</div>
              <div style={{ fontSize: MIN, color: "rgba(27,34,32,0.55)" }}>{l}</div>
            </div>
          ))}
        </div>
        {CHANNELS.map(([n, v, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0" }}>
            <span style={{ fontSize: MIN + 1, flex: 1 }}>{n}</span>
            <span style={{ width: "42%", height: 7, borderRadius: 4, background: "rgba(27,34,32,0.08)", overflow: "hidden" }}>
              <span style={{ display: "block", height: "100%", width: `${v * 2.6}%`, background: c }} />
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, width: 22, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", padding: "20px 26px", color: "#1B2220", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, borderBottom: "1px solid rgba(27,34,32,0.12)", paddingBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 500, letterSpacing: "-0.02em" }}>
            March report
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,34,32,0.45)", marginTop: 3 }}>
            Northgate Home Services · prepared 1 Apr
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, fontWeight: 600, background: sent ? GREEN : "rgba(27,34,32,0.1)", color: sent ? "#fff" : "rgba(27,34,32,0.65)", borderRadius: 7, padding: "7px 13px", transition: "all 260ms ease" }}>
          {sent ? "Sent ✓" : "Send monthly report"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {[["100", "leads", "+22% vs Feb"], ["28", "booked jobs", "+9"], ["Local search", "top channel", "34 leads"]].map(([v, l, d]) => (
          <div key={l} style={{ flex: 1, background: "#F7F7F4", borderRadius: 9, padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{v}</div>
            <div style={{ fontSize: 10, color: "rgba(27,34,32,0.6)", marginTop: 2 }}>{l}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: GREEN, marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* attribution flow */}
      <div style={{ flex: 1, minHeight: 0, border: "1px solid rgba(27,34,32,0.1)", borderRadius: 9, padding: 13, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,34,32,0.42)", marginBottom: 9 }}>
          Where the work came from
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 0 }}>
          <div style={{ width: "32%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 6 }}>
            {CHANNELS.map(([n, v, c]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 9.5, flex: 1 }}>{n}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(27,34,32,0.5)" }}>{v}</span>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 200 120" preserveAspectRatio="none" style={{ flex: 1, height: "100%" }}>
            {CHANNELS.map(([, v, c], i) => {
              const y1 = 10 + i * 25;
              const h = Math.max(4, v * 0.52);
              return (
                <motion.path
                  key={i}
                  d={`M0 ${y1} C 60 ${y1}, 70 60, 128 60 L128 ${60 + h} C 70 ${60 + h}, 60 ${y1 + h}, 0 ${y1 + h} Z`}
                  fill={c}
                  opacity="0.3"
                  style={{ pathLength: draw, opacity: draw }}
                />
              );
            })}
            <rect x="128" y="18" width="13" height="84" rx="3" fill="rgba(27,34,32,0.72)" />
            <motion.rect x="168" y="40" width="13" height="40" rx="3" fill={GREEN} style={{ scaleY: draw, originY: 1 }} />
            <text x="134" y="112" fontSize="7" fill="rgba(27,34,32,0.5)" fontFamily="var(--font-mono)">Leads</text>
            <text x="166" y="112" fontSize="7" fill="rgba(27,34,32,0.5)" fontFamily="var(--font-mono)">Booked</text>
          </svg>
        </div>
      </div>

      <div style={{ background: "#F7F7F4", borderRadius: 8, padding: 11, fontSize: 10.5, lineHeight: 1.6, color: "rgba(27,34,32,0.78)" }}>
        <strong style={{ color: "#1B2220" }}>What worked:</strong> the map profile climbed into
        the top three in Ajax and Whitby, which is where most of March's leads came
        from. The before/after reel reached the most people but converted least —
        worth keeping for reach, not for booking.
      </div>

      <motion.div
        animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : 10 }}
        transition={{ duration: 0.28 }}
        style={{ position: "absolute", right: 22, bottom: 18, background: "#1B2220", color: "#fff", borderRadius: 9, padding: "10px 14px", fontSize: 10.5, boxShadow: "0 12px 26px rgba(27,34,32,0.28)" }}
      >
        Sent to owner@northgate.ca
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Specs
   ═══════════════════════════════════════════════════════════════ */

export const GROW_SPECS: BeatSpec[] = [
  {
    tone: "light",
    title: "Northgate — Local presence",
    cursor: [
      { at: 0.18, x: 60, y: 40 },
      { at: 0.4, x: 18, y: 88 },
      { at: 0.47, x: 18, y: 88, press: true },
      { at: 0.74, x: 20, y: 30 },
    ],
    // the top three results
    camera: { from: 0.56, hold: 0.68, to: 0.86, rect: { x: 2, y: 16, w: 36, h: 24 } },
    Screen: ScreenMap,
  },
  {
    tone: "light",
    title: "Northgate — Outreach",
    cursor: [
      { at: 0.18, x: 30, y: 44 },
      { at: 0.38, x: 52, y: 9 },
      { at: 0.45, x: 52, y: 9, press: true },
      { at: 0.76, x: 78, y: 82 },
    ],
    camera: { from: 0.58, hold: 0.7, to: 0.88, rect: { x: 40, y: 34, w: 18, h: 50 } },
    Screen: ScreenSequence,
  },
  {
    tone: "light",
    title: "Northgate — Ads",
    cursor: [
      { at: 0.18, x: 40, y: 60 },
      { at: 0.4, x: 7, y: 42 },
      { at: 0.47, x: 7, y: 42, press: true },
      { at: 0.74, x: 72, y: 42 },
    ],
    camera: { from: 0.56, hold: 0.68, to: 0.86, rect: { x: 64, y: 16, w: 14, h: 34 } },
    Screen: ScreenAds,
  },
  {
    tone: "light",
    title: "Northgate — Page test",
    cursor: [
      { at: 0.18, x: 30, y: 50 },
      { at: 0.48, x: 86, y: 9 },
      { at: 0.57, x: 86, y: 9, press: true },
      { at: 0.8, x: 64, y: 40 },
    ],
    camera: { from: 0.62, hold: 0.74, to: 0.92, rect: { x: 36, y: 14, w: 62, h: 28 } },
    Screen: ScreenABTest,
  },
  {
    tone: "light",
    title: "Northgate — Content",
    cursor: [
      { at: 0.18, x: 10, y: 88 },
      { at: 0.4, x: 10, y: 88, press: true },
      { at: 0.56, x: 42, y: 52 },
      { at: 0.6, x: 42, y: 52, press: true },
      { at: 0.82, x: 78, y: 50 },
    ],
    camera: { from: 0.64, hold: 0.76, to: 0.92, rect: { x: 60, y: 12, w: 38, h: 76 } },
    Screen: ScreenCalendar,
  },
  {
    tone: "light",
    title: "Northgate — Monthly report",
    cursor: [
      { at: 0.18, x: 30, y: 30 },
      { at: 0.5, x: 86, y: 9 },
      { at: 0.59, x: 86, y: 9, press: true },
      { at: 0.8, x: 56, y: 58 },
    ],
    camera: { from: 0.2, hold: 0.34, to: 0.56, rect: { x: 4, y: 42, w: 94, h: 34 } },
    Screen: ScreenReport,
  },
];
