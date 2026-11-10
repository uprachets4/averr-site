import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BRIEF_SERVICES, TALK_FACTS } from "../../../data/contactBrief";
import { CAL_LINK } from "../calConfig";
import { useReveal } from "./useReveal";
import type { useBrief } from "./briefState";

const CalEmbed = lazy(() => import("../CalEmbed"));

/**
 * "Talk" — the facts, and the real Cal.com embed in its dark theme,
 * inside the reference's frame.
 *
 * The embed is NOT loaded on page load. It mounts when the section
 * comes within 600px of the viewport, so nothing it pulls in is on
 * the page's critical path.
 *
 * The reference's frame, side panel and carry-over note are all kept
 * around it: the embed replaces only the sample month grid and time
 * column, which is the one part that was faked.
 */
export default function TalkSection({
  brief,
}: {
  brief: ReturnType<typeof useBrief>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [near, setNear] = useState(false);
  const leftReveal = useReveal<HTMLDivElement>();
  const calReveal = useReveal<HTMLDivElement>();

  useEffect(function loadOnApproach() {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      function onNear(entries) {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { state, carryReady } = brief;
  const name = state.name.trim();
  const email = state.email.trim();

  /* "Lakeshore Physio · Websites, AI Automation" */
  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));
  const notes = [state.business.trim(), chosen.map((s) => s.name).join(", ")]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="talk gut" id="talk" aria-labelledby="ct-th" ref={sectionRef}>
      <div className="orb d" aria-hidden="true" />
      <div className="wrap talkgrid">
        <div className={leftReveal.cls} ref={leftReveal.ref}>
          <span className="eyebrow">Talk</span>
          <h2 id="ct-th">Rather talk? Pick a time.</h2>
          <p className="lede">
            You tell me about the business. I ask questions. By the end you'll
            know whether we're a fit, and what it would take.
          </p>
          <ul className="facts">
            {TALK_FACTS.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                {v}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`cal ${calReveal.cls}`}
          aria-label="Booking calendar"
          ref={calReveal.ref}
        >
          <div className="calbar">
            <i />
            <i />
            <i />
            <span>cal.com/{CAL_LINK}</span>
          </div>
          <div className="calbody">
            <div className="cmeta">
              <img src="/about/avatar.webp" alt="" width={44} height={44} decoding="async" />
              <div>
                <span className="mono" style={{ color: "var(--mute)" }}>
                  Prachets Upadhyay
                </span>
                <br />
                <b>Discovery call</b>
              </div>
              <span className="k">
                <i />
                30 min · Google Meet
              </span>
              <span className="k">America/Toronto</span>
              <div className={`carry${carryReady ? " on" : ""}`}>
                {carryReady
                  ? `Booking as ${name} · ${email}. Nothing to type twice.`
                  : "Write first and your name and email carry over here, so there is nothing to type twice."}
              </div>
            </div>

            {/* The embed takes the two sample columns' place. */}
            <div className="calembed">
              {near ? (
                <Suspense fallback={<div className="calwait">Loading times…</div>}>
                  <CalEmbed
                    theme="dark"
                    name={carryReady ? name : undefined}
                    email={carryReady ? email : undefined}
                    notes={notes || undefined}
                  />
                </Suspense>
              ) : (
                <div className="calwait">Loading times…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
