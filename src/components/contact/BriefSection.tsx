import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { duration, ease } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import ReplyPreview, { type Draft } from "./ReplyPreview";
import {
  EMAIL_ADDR,
  FAILURE_LINE,
  HELP_MESSAGE,
  HELP_TIMELINE,
  PILLARS,
  UNSURE_LABEL,
  joinNaturally,
  legacyProjectType,
} from "./briefCopy";
import type { PillarId } from "../../data/servicePillars";

/**
 * The brief, with the reply composing beside it.
 *
 * PRIVACY: every value lives in this component's state until submit.
 * Nothing is measured, nothing is logged, and the preview is rendered
 * in the browser from the same state — no field value is sent anywhere
 * before the visitor presses the button.
 *
 * NO REAL SENDS: `?mockSend=1` routes the submit at a local mock
 * instead of /api/contact, and the harness is inert anywhere that is
 * not localhost or a vercel.app preview — the same guard the start
 * pass's simulateBooking uses.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Status = "idle" | "sending" | "sent" | "error";

/** Preview and localhost only, like ?simulateBooking. */
function harnessAllowed() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.endsWith(".vercel.app");
}

export default function BriefSection() {
  const reduce = !!useReducedMotion();
  const [params] = useSearchParams();
  const uid = useId().replace(/:/g, "");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // the start pass sends the business name as ?notes
  const [business, setBusiness] = useState(() => (params.get("notes") || "").slice(0, 60).trim());
  const [pillars, setPillars] = useState<PillarId[]>([]);
  const [unsure, setUnsure] = useState(false);
  const [expanded, setExpanded] = useState<PillarId | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentAt, setSentAt] = useState<string>("");

  const draft: Draft = useMemo(
    () => ({ name, email, business, pillars, unsure }),
    [name, email, business, pillars, unsure]
  );

  function togglePillar(id: PillarId) {
    setUnsure(false);
    setPillars((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function toggleService(s: string) {
    setServices((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "We'll need a name to call you by.";
    if (!EMAIL_RE.test(email.trim())) next.email = "We'll need an email to reply to you.";
    if (!message.trim()) next.message = "Tell us a little about the project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /** The prefilled fallback, built from what they already typed. */
  const mailto = useMemo(
    function buildMailto() {
      const subject = `Project brief${business ? ` — ${business}` : ""}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        business ? `Business: ${business}` : null,
        pillars.length ? `Needs: ${joinNaturally(pillars.map((p) => p))}` : unsure ? "Needs: Not sure yet" : null,
        services.length ? `Services: ${services.join(", ")}` : null,
        timeline ? `Timeline: ${timeline}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");
      return `mailto:${EMAIL_ADDR}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },
    [name, email, business, pillars, unsure, services, timeline, message]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    const mock = harnessAllowed() && params.get("mockSend") === "1";
    try {
      if (mock) {
        // the dev/preview harness: no network, no email
        await new Promise((r) => setTimeout(r, 650));
        if (params.get("mockFail") === "1") throw new Error("mocked failure");
      } else {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            projectType: legacyProjectType(pillars, unsure),
            services,
            business,
            timeline,
            message,
          }),
        });
        if (!res.ok) {
          // the server's words are NEVER rendered; dev/preview sees them
          if (harnessAllowed()) {
            const detail = await res.text().catch(() => "");
            console.warn("[contact] submit failed:", res.status, detail);
          }
          throw new Error(`status ${res.status}`);
        }
      }
      setSentAt(
        new Intl.DateTimeFormat("en-CA", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "America/Toronto",
        }).format(new Date())
      );
      setStatus("sent");
    } catch (err) {
      if (harnessAllowed()) console.warn("[contact]", err);
      setStatus("error");
    }
  }

  const sent = status === "sent";

  return (
    <div className="bs">
      <div className="bs-grid">
        {/* ── the form ── */}
        <form className="bs-form" onSubmit={onSubmit} noValidate>
          <Field id={`${uid}-name`} label="Your name" error={errors.name}>
            <input
              id={`${uid}-name`}
              className="bs-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            />
          </Field>

          <Field id={`${uid}-email`} label="Email" error={errors.email}>
            <input
              id={`${uid}-email`}
              className="bs-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            />
          </Field>

          <Field id={`${uid}-biz`} label="Business name" optional>
            <input
              id={`${uid}-biz`}
              className="bs-input"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              autoComplete="organization"
            />
          </Field>

          <fieldset className="bs-fieldset">
            <legend className="bs-label">What do you need?</legend>
            <div className="bs-chips">
              {PILLARS.map((p) => {
                const on = pillars.includes(p.id);
                return (
                  <span key={p.id} className="bs-chipwrap">
                    <button
                      type="button"
                      className={on ? "bs-chip bs-chip--on" : "bs-chip"}
                      aria-pressed={on}
                      onClick={() => togglePillar(p.id)}
                    >
                      {p.name}
                    </button>
                    <button
                      type="button"
                      className="bs-more"
                      aria-expanded={expanded === p.id}
                      aria-label={`${expanded === p.id ? "Hide" : "Show"} ${p.name} services`}
                      onClick={() => setExpanded((x) => (x === p.id ? null : p.id))}
                    >
                      {expanded === p.id ? "–" : "+"}
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                className={unsure ? "bs-chip bs-chip--on" : "bs-chip"}
                aria-pressed={unsure}
                onClick={() => {
                  setUnsure((u) => !u);
                  setPillars([]);
                  setServices([]);
                }}
              >
                {UNSURE_LABEL}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key={expanded}
                  className="bs-services"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
                >
                  <div className="bs-services-in">
                    {PILLARS.find((p) => p.id === expanded)!.services.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={services.includes(s) ? "bs-sv bs-sv--on" : "bs-sv"}
                        aria-pressed={services.includes(s)}
                        onClick={() => toggleService(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </fieldset>

          <Field id={`${uid}-tl`} label="Rough timeline" optional help={HELP_TIMELINE}>
            <input
              id={`${uid}-tl`}
              className="bs-input"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </Field>

          <Field id={`${uid}-msg`} label="What are you building?" error={errors.message} help={HELP_MESSAGE}>
            <textarea
              id={`${uid}-msg`}
              className="bs-input bs-textarea"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${uid}-msg-err` : undefined}
            />
          </Field>

          <div className="bs-submit">
            <MagneticCTA type="submit" variant="primary" ariaLabel="Send your brief">
              {status === "sending" ? "Sending…" : "Send the brief"}
            </MagneticCTA>
          </div>

          {status === "error" ? (
            <div className="bs-error" role="alert">
              <p>{FAILURE_LINE}</p>
              <a href={mailto} className="bs-mailto">Email it instead →</a>
            </div>
          ) : null}
        </form>

        {/* ── the reply ── */}
        <div className="bs-preview">
          <div className="bs-sticky">
            {/* the Outbox tab the draft folds into */}
            <motion.div
              className="bs-outbox"
              aria-hidden={!sent}
              initial={false}
              animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : 6 }}
              transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
            >
              Outbox · 1
            </motion.div>

            <div className="bs-stack">
              {/* the draft folds away — transform only */}
              <motion.div
                className="bs-draft"
                initial={false}
                animate={
                  sent
                    ? reduce
                      ? { opacity: 0 }
                      : { rotateX: -82, y: -34, scale: 0.94, opacity: 0 }
                    : { rotateX: 0, y: 0, scale: 1, opacity: 1 }
                }
                transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
                style={{ transformOrigin: "top center", transformPerspective: 1000 }}
              >
                <ReplyPreview draft={draft} />
              </motion.div>

              {/* and the receipt rises in its place */}
              <AnimatePresence>
                {sent ? (
                  <motion.div
                    className="bs-receipt"
                    initial={reduce ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : duration.slow, delay: reduce ? 0 : 0.18, ease: ease.outQuart }}
                  >
                    <div className="bs-rhead">
                      <span className="bs-rtick" aria-hidden="true">✓</span>
                      <span>Received</span>
                    </div>
                    <dl className="bs-rlist">
                      <Receipt k="Sent" v={`${sentAt} · Toronto`} />
                      {business ? <Receipt k="Business" v={business} /> : null}
                      <Receipt
                        k="Needs"
                        v={
                          unsure
                            ? UNSURE_LABEL
                            : pillars.length
                              ? joinNaturally(pillars.map((p) => PILLARS.find((x) => x.id === p)!.name)) +
                                (services.length ? ` · ${services.join(", ")}` : "")
                              : "—"
                        }
                      />
                      <Receipt k="Next" v={`A reply from Prachets within 24 hours.`} />
                    </dl>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bs { max-width: var(--container-wide); margin: 0 auto; }
        .bs-grid {
          display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
          gap: 64px; align-items: start;
        }
        .bs-form { display: flex; flex-direction: column; gap: 26px; }
        .bs-label {
          display: block; padding: 0;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--color-muted); margin-bottom: 9px;
        }
        .bs-input {
          width: 100%; font: inherit; font-size: 16px; color: var(--color-ink);
          background: var(--color-bg); border: 1px solid rgba(20,20,18,0.55);
          border-radius: 8px; padding: 13px 14px; min-height: 48px;
          transition: border-color ${duration.fast}s ease, box-shadow ${duration.fast}s ease;
        }
        .bs-input:hover { border-color: var(--color-ink); }
        .bs-input:focus-visible {
          outline: none; border-color: var(--color-ink);
          box-shadow: 0 0 0 3px rgba(177,133,68,0.45);
        }
        .bs-textarea { min-height: 128px; resize: vertical; line-height: 1.55; }
        .bs-help { margin: 7px 0 0; font-size: 13px; line-height: 1.5; color: var(--color-muted); }
        .bs-err { margin: 7px 0 0; font-size: 13px; color: #9A3412; }

        .bs-fieldset { border: none; padding: 0; margin: 0; }
        .bs-chips { display: flex; flex-wrap: wrap; gap: 9px; }
        .bs-chipwrap { display: inline-flex; }
        .bs-chip, .bs-sv, .bs-more {
          font: inherit; font-size: 14px; cursor: pointer;
          min-height: 44px; padding: 10px 18px;
          border: 1px solid rgba(20,20,18,0.28); border-radius: 999px;
          background: transparent; color: var(--color-ink);
          transition: background ${duration.fast}s ease, border-color ${duration.fast}s ease, color ${duration.fast}s ease;
        }
        .bs-chipwrap .bs-chip { border-radius: 999px 0 0 999px; border-right: none; }
        .bs-more { border-radius: 0 999px 999px 0; min-width: 44px; padding: 10px 14px; font-family: var(--font-mono); }
        .bs-chip:hover, .bs-sv:hover, .bs-more:hover { border-color: var(--color-ink); }
        .bs-chip--on, .bs-sv--on { background: var(--color-ink); color: var(--color-bg); border-color: var(--color-ink); }
        .bs-chip:focus-visible, .bs-sv:focus-visible, .bs-more:focus-visible {
          outline: 2px solid var(--color-ink); outline-offset: 2px;
        }
        .bs-services { overflow: hidden; }
        .bs-services-in { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 12px; }
        .bs-sv { font-size: 13px; padding: 9px 14px; }

        .bs-submit { margin-top: 4px; }
        .bs-error {
          border: 1px solid rgba(154,52,18,0.35); background: rgba(154,52,18,0.06);
          border-radius: 8px; padding: 14px 16px;
        }
        .bs-error p { margin: 0 0 8px; font-size: 14px; color: var(--color-ink); }
        .bs-mailto { font-size: 14px; color: var(--color-ink); text-decoration: underline; text-underline-offset: 3px; }

        .bs-preview { min-width: 0; }
        .bs-sticky { position: sticky; top: 104px; }
        .bs-outbox {
          display: inline-block; margin-bottom: -1px;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--color-ink);
          background: var(--color-bg-alt);
          border: 1px solid rgba(20,20,18,0.14); border-bottom: none;
          border-radius: 8px 8px 0 0; padding: 7px 14px;
        }
        .bs-stack { position: relative; }
        .bs-receipt {
          position: absolute; inset: 0;
          border: 1px solid rgba(20,20,18,0.16); border-radius: 12px;
          background: var(--color-bg); padding: 22px;
          box-shadow: 0 24px 56px -34px rgba(20,20,18,0.34);
        }
        .bs-rhead {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
          font-family: var(--font-display); font-weight: 500; font-size: 21px; color: var(--color-ink);
        }
        .bs-rtick {
          width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
          background: #2F7D4F; color: #fff; font-size: 14px;
        }
        .bs-rlist { margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .bs-rrow { display: grid; grid-template-columns: 82px minmax(0,1fr); gap: 12px; }
        .bs-rk {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--color-muted);
        }
        .bs-rv { font-size: 14px; color: var(--color-ink); margin: 0; }

        @media (max-width: 1023px) {
          .bs-grid { grid-template-columns: 1fr; gap: 34px; }
          .bs-sticky { position: static; }
        }
      `}</style>
    </div>
  );
}

function Receipt({ k, v }: { k: string; v: string }) {
  return (
    <div className="bs-rrow">
      <dt className="bs-rk">{k}</dt>
      <dd className="bs-rv">{v}</dd>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  help,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  help?: string | string[];
  optional?: boolean;
  children: React.ReactNode;
}) {
  const lines = Array.isArray(help) ? help : help ? [help] : [];
  return (
    <div>
      <label className="bs-label" htmlFor={id}>
        {label}
        {optional ? <span style={{ textTransform: "none", letterSpacing: 0 }}> · optional</span> : null}
      </label>
      {children}
      {lines.map((l) => (
        <p key={l} className="bs-help">{l}</p>
      ))}
      {error ? (
        <p className="bs-err" id={`${id}-err`} role="alert">{error}</p>
      ) : null}
    </div>
  );
}
