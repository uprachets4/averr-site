import { useCallback, useEffect, useId, useRef, useState } from "react";
import { track } from "../../../lib/analytics";
import { useSearchParams } from "react-router-dom";
import { EMAIL_ADDR, TIMINGS, validEmail } from "../../../data/contactBrief";
import ServiceTiles from "./ServiceTiles";
import Letter from "./Letter";
import SentState from "./SentState";
import { useFoldFlight } from "./useFoldFlight";
import { briefPayload, failureMailto, type MissingKey } from "./briefState";
import { useReveal } from "./useReveal";
import type { useBrief } from "./briefState";

/**
 * "Write" — the three-part brief, the letter beside it, and the send.
 *
 * NO REAL SENDS while testing: `?mockSend=1` routes the submit at a
 * local mock instead of /api/contact, and `?mockFail=1` forces the
 * failure path. Both are inert anywhere that is not localhost or a
 * vercel.app preview — the same guard `BriefSection` used, kept
 * verbatim so the harness behaves exactly as it did.
 */

type Status = "idle" | "sending" | "sent" | "error";

/** Preview and localhost only, like ?simulateBooking. */
function harnessAllowed() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.endsWith(".vercel.app");
}

export default function Brief({
  brief,
  onBook,
}: {
  brief: ReturnType<typeof useBrief>;
  onBook: () => void;
}) {
  const { state, changed, set, missing, ready } = brief;
  const [params] = useSearchParams();
  const uid = useId().replace(/:/g, "");
  const [status, setStatus] = useState<Status>("idle");
  const [emailError, setEmailError] = useState("");

  const deskRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const letterRef = useRef<HTMLElement | null>(null);
  const trailRef = useRef<SVGPathElement | null>(null);
  const flightRef = useRef<HTMLDivElement | null>(null);
  const firstTile = useRef<HTMLButtonElement | null>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const formReveal = useReveal<HTMLFormElement>();

  const { folding, run, cancel } = useFoldFlight(
    letterRef,
    formRef,
    trailRef,
    flightRef
  );

  /* The date on the letterhead, in Toronto. */
  const [date] = useState(() =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      month: "long",
      day: "numeric",
    }).format(new Date())
  );

  /* The start pass sends the business name as ?notes. */
  useEffect(
    function seedBusiness() {
      const notes = (params.get("notes") || "").slice(0, 60).trim();
      if (notes) set("business", notes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /** Pressing Send while it is disabled focuses the first gap. */
  const focusFirstMissing = useCallback(
    function focusFirstMissing() {
      const first: MissingKey | undefined = missing[0]?.key;
      if (!first) return;
      if (first === "need") firstTile.current?.focus();
      else fieldRefs.current[first]?.focus();
    },
    [missing]
  );

  const onSubmit = useCallback(
    async function onSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!ready) {
        focusFirstMissing();
        return;
      }
      if (status === "sending") return;
      setStatus("sending");

      const mock = harnessAllowed() && params.get("mockSend") === "1";

      /* The fold and the request run together. The sent state only
         appears if the request actually succeeded. */
      const flying = run();
      const request = (async function post() {
        if (mock) {
          await new Promise((r) => setTimeout(r, 650));
          if (params.get("mockFail") === "1") throw new Error("mocked failure");
          return;
        }
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(briefPayload(state)),
        });
        if (!res.ok) {
          /* The server's words are never rendered; dev/preview sees them. */
          if (harnessAllowed()) {
            const detail = await res.text().catch(() => "");
            console.warn("[contact] submit failed:", res.status, detail);
          }
          throw new Error(`status ${res.status}`);
        }
      })();

      try {
        await request;
        await flying;
        setStatus("sent");
        track("generate_lead", { form: "contact" });
      } catch (err) {
        if (harnessAllowed()) console.warn("[contact]", err);
        /* Nothing is lost and nothing pretends it went: the plane is
           cancelled and the letter unfolds exactly where it was. */
        cancel();
        setStatus("error");
      }
    },
    [ready, status, params, run, cancel, state, focusFirstMissing]
  );

  const onAgain = useCallback(
    function onAgain() {
      setStatus("idle");
      brief.reset();
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [brief]
  );

  const field = (key: string) => (el: HTMLElement | null) => {
    fieldRefs.current[key] = el;
  };

  const hint = ready
    ? "Ready. It goes straight to my inbox."
    : null;

  return (
    <>
      <div className={`desk${status === "sent" ? " done" : ""}`} ref={deskRef}>
        <form
          className={`brief ${formReveal.cls}`}
          noValidate
          onSubmit={onSubmit}
          ref={(el) => {
            formReveal.ref.current = el;
            formRef.current = el;
          }}
        >
          {/* 01 */}
          <div className="part">
            <div className="ph">
              <span className="n">01</span>
              <h3>What do you need?</h3>
              <span className="opt">Pick any</span>
            </div>
            <ServiceTiles
              state={state}
              toggleService={brief.toggleService}
              toggleSub={brief.toggleSub}
              toggleUnsure={brief.toggleUnsure}
              firstTileRef={(el) => {
                firstTile.current = el;
              }}
            />
          </div>

          {/* 02 */}
          <div className="part">
            <div className="ph">
              <span className="n">02</span>
              <h3>About you</h3>
            </div>
            <div className="fields">
              <div className="f">
                <input
                  id={`${uid}-name`}
                  autoComplete="name"
                  placeholder=" "
                  maxLength={40}
                  value={state.name}
                  onChange={(e) => set("name", e.target.value)}
                  ref={field("name") as React.Ref<HTMLInputElement>}
                />
                <label htmlFor={`${uid}-name`}>Your name</label>
              </div>
              <div className="f">
                <input
                  id={`${uid}-biz`}
                  autoComplete="organization"
                  placeholder=" "
                  maxLength={50}
                  value={state.business}
                  onChange={(e) => set("business", e.target.value)}
                />
                <label htmlFor={`${uid}-biz`}>Business name (optional)</label>
              </div>
              <div className="f full">
                <input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder=" "
                  maxLength={80}
                  value={state.email}
                  aria-describedby={`${uid}-e-email`}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    setEmailError(v && !validEmail(v) ? "That email looks incomplete." : "");
                  }}
                  ref={field("email") as React.Ref<HTMLInputElement>}
                />
                <label htmlFor={`${uid}-email`}>Email</label>
                <span className="err" id={`${uid}-e-email`} aria-live="polite">
                  {emailError}
                </span>
              </div>
            </div>
          </div>

          {/* 03 */}
          <div className="part">
            <div className="ph">
              <span className="n">03</span>
              <h3>The project</h3>
            </div>
            <div className="when" role="group" aria-label="Timing">
              {TIMINGS.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  aria-pressed={state.when === t.value}
                  onClick={() => brief.toggleWhen(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="f" style={{ marginTop: 12 }}>
              <textarea
                id={`${uid}-gist`}
                placeholder=" "
                maxLength={1200}
                value={state.gist}
                onChange={(e) => set("gist", e.target.value)}
                ref={field("gist") as React.Ref<HTMLTextAreaElement>}
              />
              <label htmlFor={`${uid}-gist`}>
                What are you building? A sentence is plenty.
              </label>
            </div>
            <div className="f" style={{ marginTop: 12 }}>
              <input
                id={`${uid}-link`}
                type="url"
                placeholder=" "
                maxLength={120}
                value={state.link}
                onChange={(e) => set("link", e.target.value)}
              />
              <label htmlFor={`${uid}-link`}>
                Current site or anything I should see (optional)
              </label>
            </div>
          </div>

          <div className="bfoot">
            <span className="hint" aria-live="polite">
              {hint ?? (
                <>
                  Still needed: <b>{missing.map((m) => m.label).join(", ")}</b>
                </>
              )}
            </span>
            <button className="btn" type="submit" aria-disabled={!ready}>
              {status === "sending" ? "Sending…" : "Send to Prachets →"}
            </button>

            <p className="sendnote">
              We only use this to reply to you.{" "}
              <a href="/privacy">Privacy</a>
            </p>

            {status === "error" ? (
              <p className="sendfail" role="alert">
                It didn't send. Email me directly at{" "}
                <a href={failureMailto(state)}>{EMAIL_ADDR}</a>
              </p>
            ) : null}
          </div>
        </form>

        <Letter
          state={state}
          changed={changed}
          date={date}
          folding={folding}
          letterRef={(el) => {
            letterRef.current = el;
          }}
        />

        {status === "sent" ? (
          <SentState email={state.email.trim()} onAgain={onAgain} onBook={onBook} />
        ) : null}
      </div>

      {/* The plane's trail. Fixed, outside the grid, its own scope. */}
      <div className="ct-flight" aria-hidden="true" ref={flightRef}>
        <svg>
          <path className="trail" ref={trailRef} />
        </svg>
      </div>
    </>
  );
}
