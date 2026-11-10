import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useSearchParams } from "react-router-dom";
import { fromISO, toISO } from "../../lib/businessDays";
import { CAL_LINK, CAL_FULL_URL } from "./calConfig";

/**
 * The Cal.com embed, in its own chunk so nothing it pulls in is on
 * /contact's critical path.
 *
 * Two callers now, so everything that used to be hard-coded is a
 * prop with the old behaviour as its default:
 *   - /services' start pass links here with `?date` / `?month` /
 *     `?notes`, and still does: the URL prefill below is unchanged;
 *   - /contact's Talk section passes the letter's name, email and a
 *     notes line, and asks for the dark theme.
 *
 * A prop beats the URL where both say something, since the prop is
 * what the visitor just typed.
 */
export default function CalEmbed({
  theme = "light",
  name,
  email,
  notes,
}: {
  theme?: "light" | "dark";
  name?: string;
  email?: string;
  /** e.g. "Lakeshore Physio · Websites, AI Automation" */
  notes?: string;
} = {}) {
  const [params] = useSearchParams();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const picked = (function readDate() {
    const raw = params.get("date");
    if (!raw) return null;
    const d = fromISO(raw);
    return d ? toISO(d) : null;
  })();
  const urlNotes = (params.get("notes") || "").slice(0, 60).trim();
  const useNotes = (notes || urlNotes).slice(0, 200).trim();

  const config: React.ComponentProps<typeof Cal>["config"] = {
    layout: "month_view",
    ...(picked ? { date: picked, month: picked.slice(0, 7) } : {}),
    ...(useNotes ? { notes: useNotes } : {}),
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  };

  const href = (function hosted() {
    const q = new URLSearchParams();
    if (picked) q.set("date", picked);
    if (useNotes) q.set("notes", useNotes);
    if (name) q.set("name", name);
    if (email) q.set("email", email);
    const s = q.toString();
    return s ? `${CAL_FULL_URL}?${s}` : CAL_FULL_URL;
  })();

  useEffect(
    function initCal() {
      let cancelled = false;
      (async function boot() {
        try {
          const cal = await getCalApi({});
          if (cancelled) return;
          cal("ui", { hideEventTypeDetails: false, theme });
          setReady(true);
        } catch (err) {
          if (typeof console !== "undefined") {
            console.warn("Cal.com not embedded — using external link fallback", err);
          }
          if (!cancelled) setFailed(true);
        }
      })();
      return function cleanup() {
        cancelled = true;
      };
    },
    [theme]
  );

  if (failed) {
    return (
      <div className="ce-fail">
        <p>The booking calendar could not load here.</p>
        <a href={href} target="_blank" rel="noopener noreferrer">Book on Cal.com ↗</a>
        <style>{`
          .ce-fail { display: grid; place-items: center; gap: 10px; height: 100%; text-align: center; }
          .ce-fail p { margin: 0; font-size: 14px; color: var(--color-muted); }
          .ce-fail a { font-size: 14px; color: var(--color-ink); text-decoration: underline; text-underline-offset: 3px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ce">
      {/* The embed only paints once its own container has a definite
          height — the old band gave it minHeight on the Cal element but
          the row around it collapsed, which is why it rendered as an
          empty cream box. */}
      <Cal
        calLink={CAL_LINK}
        style={{ width: "100%", height: "100%", border: "none" }}
        config={config}
      />
      {ready ? null : <span className="ce-wait">Loading times…</span>}
      {/* Every selector is prefixed `ce`, so this block cannot reach
          anything outside the embed — spec 34's collision sweep. */}
      <style>{`
        .ce { position: relative; height: 100%; width: 100%; min-height: 440px; }
        .ce iframe { height: 100% !important; width: 100% !important; }
        .ce-wait {
          position: absolute; inset: 0; display: grid; place-items: center;
          font-family: var(--font-mono); font-size: 13px; color: var(--color-muted);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
