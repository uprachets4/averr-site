import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { BeatSpec, ScreenProps } from "./BuildScreens";

/**
 * The five Automate-chapter screens.
 *
 * Each is a different kind of application from the others and from the
 * Design chapter: a time-audit tool, an agent console, a workflow canvas,
 * an approval inbox and a docs site. Different chrome, different palette,
 * different information shape — the point of the chapter is that the back
 * office is not one dashboard.
 *
 * Every screen takes `compact`, which renders a restructured mobile
 * layout rather than the desktop one shrunk. Nothing below 11px in that
 * mode: a heatmap becomes a list, a canvas becomes a stack, a two-pane
 * inbox becomes one pane. The handoff's scaled-stills gotcha is the whole
 * reason this exists.
 */

function at(t: number, a: number, b: number) {
  if (b === a) return t >= b ? 1 : 0;
  const r = (t - a) / (b - a);
  return r < 0 ? 0 : r > 1 ? 1 : r;
}

export type AutoScreenProps = ScreenProps & { compact?: boolean };

/** Mobile floor. Nothing in a compact layout goes under this. */
const MIN = 11;

/* ═══════════════════════════════════════════════════════════════
   1 · Workflow audit — time-audit app
   ═══════════════════════════════════════════════════════════════ */

const TASKS: Array<[string, number, boolean]> = [
  ["Quote follow-ups", 6.5, true],
  ["Crew scheduling", 4, true],
  ["Invoice chasing", 3, true],
  ["Permit paperwork", 2.5, false],
  ["Review requests", 1.5, true],
];
const AUTOMATABLE = TASKS.filter((t) => t[2]).reduce((n, t) => n + t[1], 0);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5"];
/** Which cells carry automatable work — fixed, not random, so the grid
 *  looks like a real week rather than noise. */
const HEAT: number[][] = [
  [0, 2, 3, 1, 0, 0, 2, 3, 1, 0],
  [1, 3, 2, 0, 0, 1, 3, 2, 2, 1],
  [0, 1, 3, 3, 0, 0, 1, 2, 3, 0],
  [2, 3, 1, 0, 0, 2, 3, 3, 1, 1],
  [1, 2, 2, 1, 0, 0, 2, 1, 0, 0],
];
const AUTO_CELLS = new Set(["0-1", "0-6", "1-1", "1-5", "1-6", "2-2", "2-3", "2-7", "3-1", "3-5", "3-6", "4-1", "4-6"]);

const WARM = "#C2641F";

export function ScreenAudit({ local, compact }: AutoScreenProps) {
  const [on, setOn] = useState(false);
  const [hours, setHours] = useState(0);
  useMotionValueEvent(local, "change", function drive(t) {
    setOn(t > 0.46);
    setHours(+(AUTOMATABLE * at(t, 0.46, 0.66)).toFixed(1));
  });

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#FCFAF6", padding: 16, overflow: "hidden", color: "#241B12" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Where the week goes</div>
        <div style={{ fontSize: MIN, color: "rgba(36,27,18,0.6)", marginBottom: 14 }}>
          Northgate · office hours, last 4 weeks
        </div>
        <div style={{ background: "#fff", border: "1px solid rgba(36,27,18,0.12)", borderRadius: 10, padding: 13, marginBottom: 12 }}>
          <div style={{ fontSize: MIN, color: "rgba(36,27,18,0.55)" }}>Automatable</div>
          <div style={{ fontSize: 30, fontWeight: 600, color: WARM, letterSpacing: "-0.02em" }}>
            {on ? AUTOMATABLE : 0}h<span style={{ fontSize: 13, color: "rgba(36,27,18,0.5)" }}> / week</span>
          </div>
        </div>
        {TASKS.map(([n, h, a]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: "1px solid rgba(36,27,18,0.08)" }}>
            <span style={{ flex: 1, fontSize: 12 }}>{n}</span>
            <span style={{ fontSize: MIN, fontFamily: "var(--font-mono)", color: "rgba(36,27,18,0.6)" }}>{h}h</span>
            {a && on ? (
              <span style={{ fontSize: MIN, background: "rgba(194,100,31,0.14)", color: WARM, borderRadius: 999, padding: "2px 8px" }}>auto</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#FCFAF6", padding: "20px 24px", color: "#241B12", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Where the week goes</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(36,27,18,0.5)", marginTop: 2 }}>
            Northgate · office hours · last 4 weeks
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10.5, color: "rgba(36,27,18,0.66)" }}>Show automatable</span>
          <span style={{ width: 34, height: 19, borderRadius: 999, background: on ? WARM : "rgba(36,27,18,0.18)", position: "relative", transition: "background 240ms ease" }}>
            <span style={{ position: "absolute", top: 2, left: on ? 17 : 2, width: 15, height: 15, borderRadius: "50%", background: "#fff", transition: "left 240ms cubic-bezier(0.25,1,0.5,1)" }} />
          </span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, flex: 1, minHeight: 0 }}>
        {/* heatmap */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: `34px repeat(${HOURS.length}, 1fr)`, gap: 3, marginBottom: 4 }}>
            <span />
            {HOURS.map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(36,27,18,0.38)", textAlign: "center" }}>{h}</span>
            ))}
          </div>
          {DAYS.map((d, r) => (
            <div key={d} style={{ display: "grid", gridTemplateColumns: `34px repeat(${HOURS.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(36,27,18,0.5)", lineHeight: "22px" }}>{d}</span>
              {HOURS.map((_, c) => {
                const v = HEAT[r][c];
                const auto = AUTO_CELLS.has(`${r}-${c}`);
                const lit = on && auto;
                return (
                  <span
                    key={c}
                    style={{
                      height: 22,
                      borderRadius: 4,
                      background: lit
                        ? `rgba(194,100,31,${0.28 + v * 0.2})`
                        : `rgba(36,27,18,${0.04 + v * 0.07})`,
                      boxShadow: lit ? `inset 0 0 0 1px ${WARM}` : "none",
                      transition: "background 320ms ease, box-shadow 320ms ease",
                    }}
                  />
                );
              })}
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(36,27,18,0.45)" }}>
            <span>■ admin</span>
            <span style={{ color: WARM }}>■ automatable</span>
          </div>
        </div>

        {/* tasks + total */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ background: "#fff", border: "1px solid rgba(36,27,18,0.12)", borderRadius: 10, padding: 13, marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(36,27,18,0.45)" }}>
              Automatable
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 5 }}>
              <span style={{ fontSize: 30, fontWeight: 600, color: WARM, letterSpacing: "-0.02em" }}>{hours}h</span>
              <span style={{ fontSize: 10.5, color: "rgba(36,27,18,0.5)" }}>/ week</span>
            </div>
            <div style={{ fontSize: 9.5, color: "rgba(36,27,18,0.5)", marginTop: 4 }}>
              of 17.5h logged on admin
            </div>
          </div>
          {TASKS.map(([n, h, a]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 0", borderTop: "1px solid rgba(36,27,18,0.08)" }}>
              <span style={{ flex: 1, fontSize: 10.5 }}>{n}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "rgba(36,27,18,0.62)" }}>{h}h</span>
              <span style={{ width: 40, textAlign: "right" }}>
                {a ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, background: on ? "rgba(194,100,31,0.16)" : "rgba(36,27,18,0.06)", color: on ? WARM : "rgba(36,27,18,0.4)", borderRadius: 999, padding: "2px 7px", transition: "all 300ms ease" }}>
                    auto
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2 · AI agents — agent console
   ═══════════════════════════════════════════════════════════════ */

const STEPS: Array<[string, string]> = [
  ["Enrich address", "L1J 2K8 · Oshawa"],
  ["Match service area", "Durham · covered"],
  ["Score fit", "86 / 100"],
  ["Draft reply", "212 words"],
  ["Queued for review", "Marcus"],
];
const REPLY =
  "Hi Priya — thanks for the details on the Ravenscroft basement. We cover Oshawa and can usually get out for an on-site estimate within three days. Based on the square footage you gave, a full finish typically runs four to six weeks.";

export function ScreenAgent({ local, compact }: AutoScreenProps) {
  const [step, setStep] = useState(-1);
  const [typed, setTyped] = useState(0);
  useMotionValueEvent(local, "change", function run(t) {
    const started = t > 0.34;
    setStep(started ? Math.min(STEPS.length, Math.floor(at(t, 0.34, 0.74) * (STEPS.length + 0.4))) : -1);
    setTyped(Math.round(at(t, 0.44, 0.8) * REPLY.length));
  });

  const NAVY = "#0E1730";
  const ACC = "#5FA8FF";

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: NAVY, color: "#DCE6F5", padding: 16, overflow: "hidden" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Lead intake agent</div>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Priya Raghunathan</div>
          <div style={{ fontSize: MIN, color: "rgba(220,230,245,0.6)", marginTop: 3 }}>
            Oshawa L1J 2K8 · Basement finishing · Full basement
          </div>
        </div>
        {STEPS.map(([n, d], i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ width: 17, height: 17, borderRadius: "50%", background: i <= step ? "#3FD08A" : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: MIN, lineHeight: 1, color: NAVY }}>
              {i <= step ? "✓" : ""}
            </span>
            <span style={{ flex: 1, fontSize: 12 }}>{n}</span>
            <span style={{ fontSize: MIN, fontFamily: "var(--font-mono)", color: ACC }}>{i <= step ? d : ""}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: NAVY, color: "#DCE6F5", display: "grid", gridTemplateColumns: "1fr 1.15fr", overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Lead intake agent</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(220,230,245,0.45)", marginTop: 2 }}>
            run #4182 · triggered by website form
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(95,168,255,0.18)", color: ACC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
              PR
            </span>
            <span>
              <span style={{ display: "block", fontSize: 11.5, fontWeight: 600 }}>Priya Raghunathan</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(220,230,245,0.5)" }}>
                Oshawa · L1J 2K8
              </span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
            {["Basement finishing", "Full basement", "This month"].map((t) => (
              <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 8, background: "rgba(255,255,255,0.07)", borderRadius: 999, padding: "3px 8px", color: "rgba(220,230,245,0.75)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* run timeline */}
        <div style={{ flex: 1, minHeight: 0 }}>
          {STEPS.map(([n, d], i) => {
            const done = i <= step;
            const active = i === step + 1 && step < STEPS.length - 1;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <span style={{ width: 17, height: 17, borderRadius: "50%", background: done ? "#3FD08A" : "transparent", border: done ? "none" : `1.5px solid ${active ? ACC : "rgba(255,255,255,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, color: NAVY, flex: "0 0 17px" }}>
                  {done ? "✓" : ""}
                </span>
                <span style={{ flex: 1, fontSize: 10.5, color: done ? "#DCE6F5" : "rgba(220,230,245,0.45)" }}>{n}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: done ? ACC : "transparent" }}>{d}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, background: step >= 0 ? "rgba(95,168,255,0.2)" : ACC, color: step >= 0 ? ACC : NAVY, borderRadius: 7, padding: "7px 14px", transition: "all 260ms ease" }}>
            {step >= STEPS.length - 1 ? "Run complete" : step >= 0 ? "Running…" : "Run agent"}
          </span>
        </div>
      </div>

      {/* draft + gauge */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 62, height: 62, flex: "0 0 62px" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={ACC} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${step >= 2 ? 0.86 * 264 : 0} 264`} style={{ transition: "stroke-dasharray 700ms cubic-bezier(0.25,1,0.5,1)" }} />
            </svg>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600 }}>
              {step >= 2 ? 86 : "—"}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600 }}>Fit score</div>
            <div style={{ fontSize: 9.5, color: "rgba(220,230,245,0.55)", marginTop: 3, lineHeight: 1.5 }}>
              In service area, budget band matches,
              <br />
              job type we take.
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: 12, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(220,230,245,0.42)", marginBottom: 8 }}>
            Drafted reply
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.62, color: "rgba(220,230,245,0.88)", flex: 1 }}>
            {REPLY.slice(0, typed)}
            <span style={{ opacity: typed < REPLY.length ? 1 : 0, color: ACC }}>▍</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 9, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: step >= 4 ? "#F0B429" : "rgba(255,255,255,0.2)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(220,230,245,0.6)" }}>
              {step >= 4 ? "Queued for review · Marcus" : "Not sent"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3 · Tool integration — workflow canvas
   ═══════════════════════════════════════════════════════════════ */

const NODES: Array<[string, number, number]> = [
  ["Website form", 8, 46],
  ["CRM", 30, 22],
  ["Email", 52, 52],
  ["Calendar", 74, 24],
  ["Team chat", 88, 62],
];
const LOG: Array<[string, string]> = [
  ["10:04", "Lead created in CRM"],
  ["10:04", "Welcome email sent"],
  ["10:05", "Site visit booked Thu 2pm"],
  ["10:05", "Crew A notified in #dispatch"],
  ["10:06", "Follow-up task due Fri"],
];

export function ScreenCanvas({ local, compact }: AutoScreenProps) {
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState(0);
  useMotionValueEvent(local, "change", function drive(t) {
    setActive(t > 0.44);
    setLines(Math.floor(at(t, 0.46, 0.82) * (LOG.length + 0.4)));
  });
  const flow = useTransform(local, (t) => at(t, 0.46, 1));

  // Connector geometry is MEASURED, not guessed in percentages.
  //
  // The first version drew cubic curves between percentage points with
  // both control points on the source's y, which produced wide S-arcs
  // that swung away from the boxes and never visibly met them. Ports are
  // now real: each node reports its own rect, the path leaves the right
  // edge and arrives at the left edge, and the packets travel that exact
  // polyline rather than a decorative curve of their own.
  const hostRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [geo, setGeo] = useState<{ w: number; h: number; ports: Array<{ inX: number; inY: number; outX: number; outY: number }> } | null>(null);

  useLayoutEffect(function measure() {
    if (compact) return;
    function run() {
      const host = hostRef.current;
      if (!host) return;
      const hr = host.getBoundingClientRect();
      if (!hr.width) return;
      const ports = nodeRefs.current.map((el) => {
        if (!el) return { inX: 0, inY: 0, outX: 0, outY: 0 };
        const r = el.getBoundingClientRect();
        return {
          inX: r.left - hr.left,
          inY: r.top - hr.top + r.height / 2,
          outX: r.right - hr.left,
          outY: r.top - hr.top + r.height / 2,
        };
      });
      setGeo({ w: hr.width, h: hr.height, ports });
    }
    run();
    const ro = new ResizeObserver(run);
    if (hostRef.current) ro.observe(hostRef.current);
    window.addEventListener("resize", run);
    return function cleanup() {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, [compact]);

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#F7F7F4", padding: 16, overflow: "hidden", color: "#1D2220" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Lead routing</span>
          <span style={{ fontSize: MIN, fontFamily: "var(--font-mono)", background: active ? "rgba(63,160,107,0.16)" : "rgba(29,34,32,0.08)", color: active ? "#2E7A50" : "rgba(29,34,32,0.55)", borderRadius: 999, padding: "3px 9px" }}>
            {active ? "Active" : "Draft"}
          </span>
        </div>
        {NODES.map(([n], i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: "#fff", border: "1px solid rgba(29,34,32,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <NodeIcon i={i} />
            </span>
            <span style={{ flex: 1, fontSize: 12, background: "#fff", border: "1px solid rgba(29,34,32,0.12)", borderRadius: 7, padding: "8px 11px" }}>{n}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, background: "#fff", border: "1px solid rgba(29,34,32,0.12)", borderRadius: 8, padding: 11 }}>
          {LOG.slice(0, Math.max(1, lines)).map(([t, m]) => (
            <div key={m} style={{ display: "flex", gap: 9, padding: "4px 0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, color: "rgba(29,34,32,0.45)" }}>{t}</span>
              <span style={{ fontSize: MIN }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#F7F7F4", backgroundImage: "radial-gradient(rgba(29,34,32,0.13) 1px, transparent 1px)", backgroundSize: "18px 18px", display: "flex", flexDirection: "column", overflow: "hidden", color: "#1D2220" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 18px", background: "rgba(255,255,255,0.86)", borderBottom: "1px solid rgba(29,34,32,0.1)" }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Lead routing</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(29,34,32,0.45)" }}>5 steps · 3 tools</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(29,34,32,0.5)" }}>Draft</span>
        <span style={{ width: 34, height: 19, borderRadius: 999, background: active ? "#3FA06B" : "rgba(29,34,32,0.18)", position: "relative", transition: "background 240ms ease" }}>
          <span style={{ position: "absolute", top: 2, left: active ? 17 : 2, width: 15, height: 15, borderRadius: "50%", background: "#fff", transition: "left 240ms cubic-bezier(0.25,1,0.5,1)" }} />
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: active ? "#2E7A50" : "rgba(29,34,32,0.5)" }}>Active</span>
      </div>

      <div ref={hostRef} style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {geo ? (
          <svg
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            style={{ position: "absolute", inset: 0 }}
          >
            {NODES.slice(0, -1).map((_, i) => (
              <path
                key={i}
                d={orthPath(geo.ports[i], geo.ports[i + 1])}
                fill="none"
                stroke={active ? "rgba(63,160,107,0.75)" : "rgba(29,34,32,0.26)"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "stroke 320ms ease" }}
              />
            ))}
            {/* ports, so a connector visibly attaches rather than floating */}
            {geo.ports.map((p, i) => (
              <g key={i}>
                {i > 0 ? <circle cx={p.inX} cy={p.inY} r="3" fill={active ? "#3FA06B" : "rgba(29,34,32,0.3)"} /> : null}
                {i < geo.ports.length - 1 ? <circle cx={p.outX} cy={p.outY} r="3" fill={active ? "#3FA06B" : "rgba(29,34,32,0.3)"} /> : null}
              </g>
            ))}
          </svg>
        ) : null}

        {geo && active
          ? NODES.slice(0, -1).map((_, i) => (
              <Packet key={i} flow={flow} i={i} from={geo.ports[i]} to={geo.ports[i + 1]} />
            ))
          : null}

        {NODES.map(([n, x, y], i) => (
          <div
            key={n}
            ref={function set(el) {
              nodeRefs.current[i] = el;
            }}
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", background: "#fff", border: "1px solid rgba(29,34,32,0.14)", borderRadius: 9, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 3px 10px rgba(29,34,32,0.07)", whiteSpace: "nowrap", zIndex: 2 }}
          >
            <NodeIcon i={i} />
            <span style={{ fontSize: 10.5, fontWeight: 500 }}>{n}</span>
          </div>
        ))}

        {/* run log — positioned in percentages so the spotlight rect can
            name the same box without a second measurement */}
        <div style={{ position: "absolute", right: "3%", bottom: "4%", width: "31%", background: "#fff", border: "1px solid rgba(29,34,32,0.12)", borderRadius: 9, padding: 11, boxShadow: "0 8px 22px rgba(29,34,32,0.1)", zIndex: 3 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(29,34,32,0.42)", marginBottom: 8 }}>
            Run log
          </div>
          {LOG.map(([t, m], i) => (
            <div key={m} style={{ display: "flex", gap: 8, padding: "3px 0", opacity: i < lines ? 1 : 0.16, transition: "opacity 260ms ease" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(29,34,32,0.42)" }}>{t}</span>
              <span style={{ fontSize: 9.5 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Port = { inX: number; inY: number; outX: number; outY: number };

/** A gentle orthogonal route: out of the source's right port, across to a
 *  midpoint, down or up to the target's row, then into its left port.
 *  Corners are rounded by a few px so it reads as wiring, not a staircase. */
function orthPath(a: Port, b: Port) {
  const x1 = a.outX;
  const y1 = a.outY;
  const x2 = b.inX;
  const y2 = b.inY;
  const mid = x1 + (x2 - x1) / 2;
  const r = Math.min(10, Math.abs(y2 - y1) / 2, Math.abs(mid - x1));
  if (r < 2 || Math.abs(y2 - y1) < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const dir = y2 > y1 ? 1 : -1;
  return [
    `M ${x1} ${y1}`,
    `L ${mid - r} ${y1}`,
    `Q ${mid} ${y1} ${mid} ${y1 + r * dir}`,
    `L ${mid} ${y2 - r * dir}`,
    `Q ${mid} ${y2} ${mid + r} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(" ");
}

/** Points along that same polyline, so a packet never leaves the wire. */
function pointAt(a: Port, b: Port, t: number) {
  const x1 = a.outX;
  const y1 = a.outY;
  const x2 = b.inX;
  const y2 = b.inY;
  const mid = x1 + (x2 - x1) / 2;
  const l1 = Math.abs(mid - x1);
  const l2 = Math.abs(y2 - y1);
  const l3 = Math.abs(x2 - mid);
  const total = l1 + l2 + l3 || 1;
  const d = t * total;
  if (d <= l1) return { x: x1 + (mid - x1) * (d / (l1 || 1)), y: y1 };
  if (d <= l1 + l2) return { x: mid, y: y1 + (y2 - y1) * ((d - l1) / (l2 || 1)) };
  return { x: mid + (x2 - mid) * ((d - l1 - l2) / (l3 || 1)), y: y2 };
}

function Packet({ flow, i, from, to }: { flow: MotionValue<number>; i: number; from: Port; to: Port }) {
  const p = useTransform(flow, (t) => (t * 1.6 + i * 0.2) % 1);
  const left = useTransform(p, (v) => `${pointAt(from, to, v).x}px`);
  const top = useTransform(p, (v) => `${pointAt(from, to, v).y}px`);
  return (
    <motion.span
      aria-hidden
      style={{ position: "absolute", left, top, width: 7, height: 7, borderRadius: "50%", background: "#3FA06B", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 3px rgba(63,160,107,0.18)", zIndex: 1 }}
    />
  );
}

function NodeIcon({ i }: { i: number }) {
  const paths = [
    "M3 3h10v10H3z M5 6h6 M5 8.5h6",
    "M8 2l5 3v6l-5 3-5-3V5z",
    "M2 4h12v8H2z M2 4l6 4 6-4",
    "M3 4h10v9H3z M3 7h10 M5.5 2v3 M10.5 2v3",
    "M3 3h10v7H6l-3 3z",
  ];
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flex: "0 0 13px" }}>
      <path d={paths[i]} stroke="#3B4A45" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4 · Human review built in — approval inbox
   ═══════════════════════════════════════════════════════════════ */

const DRAFTS: Array<[string, string, string]> = [
  ["Priya Raghunathan", "Basement estimate — Ravenscroft Rd", "2m"],
  ["Dan Mireau", "Re: flooring quote — Kingston Rd E", "14m"],
  ["Ayesha Karim", "Bathroom refit — Harwood Ave", "1h"],
  ["Tomas Beck", "Follow-up — Rossland Rd W", "3h"],
];

export function ScreenInbox({ local, compact }: AutoScreenProps) {
  const [edited, setEdited] = useState(false);
  const [sent, setSent] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setEdited(t > 0.5);
    setSent(t > 0.66);
  });

  const GREY = "#EEF0F2";

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1C2126" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Awaiting your approval</div>
        <div style={{ fontSize: MIN, color: "rgba(28,33,38,0.55)", marginBottom: 13 }}>4 drafts · agent-written</div>
        <div style={{ border: "1px solid rgba(28,33,38,0.12)", borderRadius: 9, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{DRAFTS[0][0]}</div>
          <div style={{ fontSize: MIN, color: "rgba(28,33,38,0.55)", marginBottom: 9 }}>{DRAFTS[0][1]}</div>
          <div style={{ fontSize: MIN + 0.5, lineHeight: 1.6 }}>
            We can usually get out for an estimate{" "}
            <span style={{ textDecoration: "line-through", color: "#C2453A" }}>within a week</span>{" "}
            <span style={{ background: "rgba(63,160,107,0.16)", color: "#2E7A50" }}>within three days</span>.
          </div>
          <div style={{ marginTop: 11, fontSize: MIN + 0.5, fontWeight: 600, textAlign: "center", background: sent ? "#3FA06B" : "#1F5D4C", color: "#fff", borderRadius: 7, padding: "9px 0" }}>
            {sent ? "Sent ✓" : "Approve & send"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#fff", color: "#1C2126", overflow: "hidden" }}>
      <div style={{ width: 196, flex: "0 0 196px", background: GREY, borderRight: "1px solid rgba(28,33,38,0.1)", padding: "14px 0", minHeight: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 13px 10px", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(28,33,38,0.45)" }}>
          Awaiting approval · 4
        </div>
        {DRAFTS.map(([n, s, t], i) => (
          <div key={n} style={{ padding: "9px 13px", background: i === 0 ? "#fff" : "transparent", borderLeft: i === 0 ? "2px solid #1F5D4C" : "2px solid transparent" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(28,33,38,0.4)" }}>{t}</span>
            </div>
            <div style={{ fontSize: 9.5, color: "rgba(28,33,38,0.55)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{DRAFTS[0][1]}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(28,33,38,0.45)", marginTop: 3 }}>
            drafted by agent · to priya.r@example.com
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, border: "1px solid rgba(28,33,38,0.12)", borderRadius: 9, padding: 14, fontSize: 11, lineHeight: 1.72 }}>
          Hi Priya — thanks for the details on the Ravenscroft basement. We cover
          Oshawa and can usually get out for an on-site estimate{" "}
          <span style={{ textDecoration: "line-through", color: "#C2453A", opacity: edited ? 1 : 0.35, transition: "opacity 300ms ease" }}>
            within a week
          </span>{" "}
          <span style={{ background: edited ? "rgba(63,160,107,0.18)" : "transparent", color: edited ? "#2E7A50" : "transparent", borderRadius: 3, padding: "0 3px", transition: "all 300ms ease" }}>
            within three days
          </span>
          . Based on the square footage you gave, a full finish typically runs four
          to six weeks. Happy to walk the space and give you a fixed number.
          <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(28,33,38,0.4)" }}>
            1 edit by Marcus · {edited ? "just now" : "—"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, background: sent ? "#3FA06B" : "#1F5D4C", color: "#fff", borderRadius: 7, padding: "8px 16px", transition: "background 260ms ease" }}>
            {sent ? "Sent ✓" : "Approve & send"}
          </span>
          <span style={{ fontSize: 11, color: "rgba(28,33,38,0.5)" }}>Request changes</span>
        </div>
      </div>

      <motion.div
        animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : 10 }}
        transition={{ duration: 0.28 }}
        style={{ position: "absolute", right: 18, bottom: 16, background: "#1C2126", color: "#fff", borderRadius: 9, padding: "10px 14px", fontSize: 10.5, boxShadow: "0 12px 26px rgba(28,33,38,0.28)" }}
      >
        Sent · approved by you
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5 · Handoff documentation — docs site
   ═══════════════════════════════════════════════════════════════ */

const TOC = ["What it does", "When it breaks", "How to pause it", "Who owns it"];

export function ScreenDocs({ local, compact }: AutoScreenProps) {
  const [jumped, setJumped] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setJumped(t > 0.5);
  });
  const scrollY = useTransform(local, (t) => -at(t, 0.5, 0.66) * 150);

  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#fff", padding: 16, overflow: "hidden", color: "#1B1B19" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Lead intake agent: runbook
        </div>
        <div style={{ fontSize: MIN, color: "rgba(27,27,25,0.5)", marginBottom: 14 }}>Last updated 12 Mar · Marcus</div>
        {TOC.map((t) => (
          <div key={t} style={{ fontSize: 12, padding: "8px 0", borderTop: "1px solid rgba(27,27,25,0.09)", fontWeight: t === "How to pause it" && jumped ? 600 : 400 }}>
            {t}
          </div>
        ))}
        <div style={{ marginTop: 12, background: jumped ? "rgba(240,180,41,0.16)" : "#F6F5F2", borderLeft: "3px solid #E0A63A", borderRadius: 6, padding: 12, transition: "background 320ms ease" }}>
          <div style={{ fontSize: MIN, fontWeight: 600, marginBottom: 4 }}>How to pause it</div>
          <div style={{ fontSize: MIN + 0.5, lineHeight: 1.6 }}>
            Settings → Automations → Lead intake → Pause. Drafts already queued stay queued.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: "#fff", color: "#1B1B19", overflow: "hidden" }}>
      <div style={{ width: 168, flex: "0 0 168px", borderRight: "1px solid rgba(27,27,25,0.09)", padding: "18px 14px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(27,27,25,0.42)", marginBottom: 10 }}>
          Runbooks
        </div>
        {["Lead intake agent", "Quote follow-ups", "Review requests", "Invoice chasing"].map((t, i) => (
          <div key={t} style={{ fontSize: 10.5, padding: "5px 7px", borderRadius: 5, background: i === 0 ? "rgba(27,27,25,0.06)" : "transparent", fontWeight: i === 0 ? 600 : 400, marginBottom: 1 }}>
            {t}
          </div>
        ))}
        <div style={{ height: 1, background: "rgba(27,27,25,0.09)", margin: "12px 0" }} />
        {TOC.map((t) => (
          <div key={t} style={{ fontSize: 10, padding: "4px 7px", color: jumped && t === "How to pause it" ? "#1B1B19" : "rgba(27,27,25,0.55)", fontWeight: jumped && t === "How to pause it" ? 600 : 400, borderLeft: jumped && t === "How to pause it" ? "2px solid #1F5D4C" : "2px solid transparent" }}>
            {t}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 0, overflow: "hidden", position: "relative" }}>
        <motion.div style={{ padding: "20px 26px", y: scrollY }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500, letterSpacing: "-0.025em", marginBottom: 5 }}>
            Lead intake agent: runbook
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,27,25,0.45)", marginBottom: 16 }}>
            Last updated 12 Mar 2026 · Marcus Delacroix · v1.3
          </div>

          <DocSection title="What it does">
            Watches the website form, enriches the address, scores the lead against
            the service area and budget band, drafts a reply in the studio voice and
            queues it for a human. It never sends on its own.
          </DocSection>

          <DocSection title="When it breaks">
            If the CRM returns a 429 the run retries three times, then parks the lead
            in <Code>Needs attention</Code>. Nothing is lost; the form submission is
            written before the agent starts.
          </DocSection>

          <div style={{ background: jumped ? "rgba(240,180,41,0.18)" : "#FAF9F6", borderLeft: "3px solid #E0A63A", borderRadius: 7, padding: "12px 14px", margin: "14px 0", transition: "background 340ms ease" }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>How to pause it</div>
            <div style={{ fontSize: 10.5, lineHeight: 1.65, color: "rgba(27,27,25,0.78)" }}>
              Settings → Automations → Lead intake → <strong>Pause</strong>. Drafts
              already queued stay queued and can still be approved by hand. Resuming
              does not replay missed submissions — they are in the CRM either way.
            </div>
          </div>

          <DocSection title="Who owns it">
            Marcus is the named owner. Averr holds no keys after handover: the
            provider accounts, the prompts and this runbook are all in your
            workspace.
          </DocSection>
        </motion.div>
      </div>
    </div>
  );
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 10.5, lineHeight: 1.7, color: "rgba(27,27,25,0.76)" }}>{children}</div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, background: "rgba(27,27,25,0.07)", borderRadius: 4, padding: "1px 5px" }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Specs
   ═══════════════════════════════════════════════════════════════ */

export const AUTOMATE_SPECS: BeatSpec[] = [
  {
    tone: "light",
    title: "Northgate — Time audit",
    cursor: [
      { at: 0.18, x: 30, y: 50 },
      { at: 0.4, x: 88, y: 8 },
      { at: 0.47, x: 88, y: 8, press: true },
      { at: 0.72, x: 78, y: 26 },
    ],
    camera: { from: 0.56, hold: 0.68, to: 0.86, rect: { x: 62, y: 12, w: 36, h: 22 } },
    Screen: ScreenAudit,
  },
  {
    tone: "dark",
    title: "Northgate Ops — Agents",
    cursor: [
      { at: 0.18, x: 22, y: 30 },
      { at: 0.3, x: 18, y: 86 },
      { at: 0.35, x: 18, y: 86, press: true },
      { at: 0.7, x: 62, y: 22 },
    ],
    camera: { from: 0.62, hold: 0.74, to: 0.9, rect: { x: 52, y: 4, w: 46, h: 26 } },
    Screen: ScreenAgent,
  },
  {
    tone: "light",
    title: "Northgate — Workflows",
    cursor: [
      { at: 0.18, x: 26, y: 46 },
      { at: 0.38, x: 84, y: 7 },
      { at: 0.45, x: 84, y: 7, press: true },
      { at: 0.74, x: 80, y: 80 },
    ],
    // the run log: right 3% / bottom 4% / width 31% of the canvas,
    // which sits below a ~46px toolbar inside the screen box
    camera: { from: 0.6, hold: 0.72, to: 0.9, rect: { x: 64, y: 68, w: 34, h: 28 } },
    Screen: ScreenCanvas,
  },
  {
    tone: "light",
    title: "Northgate — Approvals",
    cursor: [
      { at: 0.18, x: 14, y: 30 },
      { at: 0.44, x: 62, y: 42 },
      { at: 0.51, x: 62, y: 42, press: true },
      { at: 0.63, x: 42, y: 86 },
      { at: 0.68, x: 42, y: 86, press: true },
      { at: 0.84, x: 60, y: 60 },
    ],
    // the tracked-change diff, which sits in the first lines of the body
    camera: { from: 0.52, hold: 0.62, to: 0.8, rect: { x: 26, y: 20, w: 70, h: 16 } },
    Screen: ScreenInbox,
  },
  {
    tone: "light",
    title: "Northgate — Runbooks",
    cursor: [
      { at: 0.18, x: 40, y: 40 },
      { at: 0.44, x: 9, y: 66 },
      { at: 0.51, x: 9, y: 66, press: true },
      { at: 0.76, x: 54, y: 48 },
    ],
    camera: { from: 0.58, hold: 0.7, to: 0.88, rect: { x: 20, y: 34, w: 76, h: 26 } },
    Screen: ScreenDocs,
  },
];
