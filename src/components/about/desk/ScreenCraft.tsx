import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { ScreenProps } from "./types";

/**
 * Principle 01 at monitor size — drag to compare.
 *
 * The same landing page, built twice. Left of the handle is what a
 * theme hands you; right of it is what the studio ships. The visitor
 * drags the handle across, by pointer or by arrow keys, and the page
 * underneath is cut at exactly that line — so the comparison is the
 * reader's to make rather than a before/after they have to remember.
 *
 * It sweeps itself once on arrival so the mechanic is obvious without
 * a label telling you to try it.
 *
 * Both halves are the same size and in the same place, so the clip can
 * never cause a reflow: only `clip-path` changes.
 *
 * The template half sits on a LIGHT screen with real grey type at AA,
 * not pale slabs on dark — at monitor size an illegible skeleton just
 * looked broken.
 */

const START = 42;

export default function ScreenCraft({ active }: ScreenProps) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(START);
  const [swept, setSwept] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  /* one automatic sweep on arrival, so the handle explains itself */
  useEffect(
    function sweepOnce() {
      if (!active || swept) return;
      setSwept(true);
      if (reduce) return;
      let raf = 0;
      const t0 = performance.now();
      const DUR = 1500;
      function step(now: number) {
        const t = Math.min(1, (now - t0) / DUR);
        // out and back, settling where it started
        const e = 1 - Math.pow(1 - t, 3);
        const v = START + Math.sin(e * Math.PI) * 34;
        setPct(v);
        if (t < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
      return function stop() {
        cancelAnimationFrame(raf);
      };
    },
    [active, swept, reduce]
  );

  const setFromClientX = useCallback(function setFrom(clientX: number) {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(function dragListeners() {
    function move(e: PointerEvent) {
      if (dragging.current) setFromClientX(e.clientX);
    }
    function up() {
      dragging.current = false;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return function off() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [setFromClientX]);

  function onKey(e: React.KeyboardEvent) {
    const big = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") { setPct((v) => Math.max(4, v - big)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPct((v) => Math.min(96, v + big)); e.preventDefault(); }
    if (e.key === "Home") { setPct(4); e.preventDefault(); }
    if (e.key === "End") { setPct(96); e.preventDefault(); }
  }

  return (
    <div className="dc">
      <div
        className="dc-frame"
        ref={frameRef}
        onPointerDown={(e) => {
          dragging.current = true;
          setFromClientX(e.clientX);
        }}
      >
        {/* the crafted page — underneath, uncut */}
        <Page crafted />

        {/* the template page — cut at the handle */}
        <div className="dc-cut" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <Page />
        </div>

        <span className="dc-line" style={{ left: `${pct}%` }} aria-hidden="true" />

        <div
          className="dc-grip"
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Drag to compare the template build with the crafted build"
          aria-valuemin={4}
          aria-valuemax={96}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)}% template, ${100 - Math.round(pct)}% crafted`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.stopPropagation();
            dragging.current = true;
          }}
        >
          <span aria-hidden="true">‹ ›</span>
        </div>

        <span className="dc-tag dc-tag--l" aria-hidden="true">Template</span>
        <span className="dc-tag dc-tag--r" aria-hidden="true">Crafted</span>
      </div>

      <p className="dc-hint">Drag the handle, or focus it and use the arrow keys.</p>

      <style>{`
        .dc {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          background: var(--about-surface);
          padding: 20px 22px 16px;
        }
        .dc-frame {
          position: relative; flex: 1; min-height: 0;
          border-radius: 8px; overflow: hidden; cursor: ew-resize;
          background: #F4F0E6;
          touch-action: none;
        }
        .dc-cut { position: absolute; inset: 0; }
        .dc-line {
          position: absolute; top: 0; bottom: 0; width: 2px;
          margin-left: -1px; background: var(--about-glow);
          box-shadow: 0 0 12px rgba(61,107,255,0.75); z-index: 5;
        }
        .dc-grip {
          position: absolute; top: 50%; z-index: 6;
          width: 46px; height: 46px; margin: -23px 0 0 -23px;
          border-radius: 50%;
          background: var(--about-glow); color: #fff;
          display: grid; place-items: center;
          font-family: var(--font-mono); font-size: 14px; letter-spacing: 0.06em;
          cursor: ew-resize; box-shadow: 0 6px 18px rgba(0,0,0,0.45);
          user-select: none;
        }
        .dc-grip:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        .dc-tag {
          position: absolute; top: 12px; z-index: 5;
          padding: 5px 11px; border-radius: 5px;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          text-transform: uppercase;
          background: rgba(10,13,20,0.82); color: #F4F0E6;
        }
        .dc-tag--l { left: 12px; }
        .dc-tag--r { right: 12px; }
        .dc-hint {
          margin: 10px 0 0;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.03em;
          color: var(--about-body);
        }
        @media (max-width: 900px) {
          .dc { padding: 12px 12px 10px; }
          .dc-hint { font-size: 13px; }
        }
      `}</style>
    </div>
  );
}

/**
 * The page itself, twice — SAME COPY, same boxes, same places. Only the
 * treatment differs: the face, the weight, the tracking, the accent, the
 * corner radius, the eyebrow's spacing.
 *
 * Giving the halves different words made the seam read as corruption
 * ("We provide quality solu|where it is."). Identical content is also
 * the sharper argument: nothing changed except the craft.
 */
function Page({ crafted }: { crafted?: boolean }) {
  // the template half is grey-on-cream at AA, not a pale skeleton
  const ink = crafted ? "#141412" : "#5A5A55";
  const soft = crafted ? "#6B665C" : "#77736B";
  const accent = crafted ? "#B18544" : "#9A9A93";

  return (
    <div className="pg" aria-hidden="true">
      <div className="pg-bar">
        <span className="pg-logo" style={{ color: ink, fontFamily: crafted ? "var(--font-display)" : "var(--font-body)", fontWeight: crafted ? 600 : 400 }}>
          Northbound
        </span>
        <div className="pg-nav">
          {["Work", "Studio", "Contact"].map((n) => (
            <span key={n} style={{ color: soft }}>{n}</span>
          ))}
        </div>
        <span
          className="pg-cta"
          style={{
            background: crafted ? ink : "transparent",
            color: crafted ? "#F4F0E6" : ink,
            border: crafted ? "none" : `1px solid ${soft}`,
            borderRadius: crafted ? 999 : 3,
          }}
        >
          Start a project
        </span>
      </div>
      <span className="pg-rule" style={{ background: crafted ? "rgba(20,20,18,0.12)" : "rgba(20,20,18,0.2)" }} />

      <div className="pg-hero" style={{ marginTop: crafted ? 30 : 20 }}>
        <span className="pg-eyebrow" style={{ color: accent, letterSpacing: crafted ? "0.1em" : "0.02em" }}>
          Field recordings
        </span>
        <span
          className="pg-h"
          style={{
            color: ink,
            fontFamily: crafted ? "var(--font-display)" : "var(--font-body)",
            fontWeight: crafted ? 500 : 700,
            fontSize: 34,
            letterSpacing: crafted ? "-0.02em" : "0",
            lineHeight: crafted ? 1.08 : 1.1,
          }}
        >
          {crafted ? (
            <>Sound that knows <span className="type-accent">where it is</span>.</>
          ) : (
            <>Sound that knows where it is.</>
          )}
        </span>
        <span className="pg-sub" style={{ color: soft, maxWidth: crafted ? "58%" : "88%" }}>
          A catalogue of location recordings, licensed by the minute, built
          for people who score to picture.
        </span>
        <div className="pg-btns" style={{ marginTop: 16 }}>
          <span className="pg-cta" style={{ background: ink, color: "#F4F0E6", borderRadius: crafted ? 999 : 3 }}>
            Hear the catalogue
          </span>
          <span className="pg-cta" style={{ border: `1px solid ${soft}`, color: ink, borderRadius: crafted ? 999 : 3 }}>
            How licensing works
          </span>
        </div>
      </div>

      <div className="pg-cards" style={{ marginTop: 24, gap: 14 }}>
        {[
          { n: "01", t: "Coastal", d: "47 recordings · Atlantic" },
          { n: "02", t: "Interior", d: "63 recordings · rooms" },
          { n: "03", t: "Transit", d: "38 recordings · rail" },
        ].map((c, i) => (
          <div
            key={i}
            className="pg-card"
            style={{
              border: `1px solid ${crafted ? "rgba(20,20,18,0.12)" : "rgba(20,20,18,0.18)"}`,
              borderRadius: crafted ? 8 : 3,
              background: crafted ? "rgba(177,133,68,0.04)" : "#EDE9E2",
            }}
          >
            {crafted ? <span className="pg-n" style={{ color: accent }}>{c.n}</span> : null}
            <span className="pg-ct" style={{ color: ink, fontFamily: crafted ? "var(--font-display)" : "var(--font-body)", fontWeight: crafted ? 500 : 700 }}>
              {c.t}
            </span>
            <span className="pg-cd" style={{ color: soft }}>{c.d}</span>
          </div>
        ))}
      </div>

      <style>{`
        .pg {
          position: absolute; inset: 0; background: #F4F0E6;
          padding: 22px 26px; overflow: hidden;
        }
        .pg-bar { display: flex; align-items: center; justify-content: space-between; }
        .pg-logo { font-size: 17px; }
        .pg-nav { display: flex; gap: 18px; font-size: 13px; }
        .pg-cta {
          display: inline-block; padding: 8px 16px; font-size: 13px; font-weight: 500;
        }
        .pg-rule { display: block; height: 1px; margin-top: 14px; }
        .pg-hero { display: flex; flex-direction: column; gap: 11px; }
        .pg-eyebrow { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase; }
        .pg-sub { font-size: 14px; line-height: 1.55; }
        .pg-btns { display: flex; gap: 10px; }
        .pg-cards { display: grid; grid-template-columns: repeat(3, 1fr); }
        .pg-card { padding: 13px; display: flex; flex-direction: column; gap: 6px; }
        .pg-n { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; }
        .pg-ct { font-size: 17px; }
        .pg-cd { font-size: 13px; }
        @media (max-width: 900px) {
          .pg { padding: 13px 14px; }
          .pg-nav, .pg-cards { display: none; }
        }
      `}</style>
    </div>
  );
}
