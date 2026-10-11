import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import { joinNaturally, NEXT_STEP, PILLAR_LINE } from "./briefCopy";
import type { PillarId } from "../../data/servicePillars";

/**
 * The reply, composing itself as you fill the form.
 *
 * The point of /contact is that sending a brief feels like shouting
 * into a void. This shows the reply being written while you type, so
 * the page's promise — a real reply from a person, within 24 hours —
 * is demonstrated rather than claimed.
 *
 * Everything is client-side and lives in component state. No field
 * value leaves the browser until submit; nothing here is measured.
 *
 * Each new phrase arrives on transform and opacity only, so a line
 * appearing can never reflow the card.
 */

export type Draft = {
  name: string;
  email: string;
  business: string;
  pillars: PillarId[];
  unsure: boolean;
};

function firstName(full: string) {
  const t = full.trim().split(/\s+/)[0];
  return t || "";
}

/** A phrase that fades and lifts in the first time it has something to say. */
function Phrase({
  show,
  children,
  reduce,
  delay = 0,
}: {
  show: boolean;
  children: React.ReactNode;
  reduce: boolean;
  delay?: number;
}) {
  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.p
          className="rp-line"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart, delay: reduce ? 0 : delay }}
        >
          {children}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export default function ReplyPreview({ draft }: { draft: Draft }) {
  const reduce = !!useReducedMotion();
  const fn = firstName(draft.name);
  const biz = draft.business.trim();
  const picked = draft.pillars;
  const subject = biz || "your project";
  const to = draft.email.trim() || "you";
  const services = joinNaturally(
    picked.map((p) => ({ design: "design", automate: "automation", grow: "growth" })[p])
  );

  const empty = !fn && !biz && picked.length === 0 && !draft.unsure && !draft.email.trim();

  return (
    <div className="rp">
      <div className="rp-chrome">
        <span className="rp-tab">Draft</span>
        <span className="rp-meta">Composing…</span>
      </div>

      <div className="rp-head">
        <Row label="From" value="Prachets Upadhyay" />
        <Row label="To" value={to} dim={to === "you"} />
        <Row label="Subject" value={`Re: ${subject}`} dim={!biz} />
      </div>

      <div className="rp-body">
        {empty ? (
          <p className="rp-eg">
            e.g. “Hi Sam, — thanks for reaching out about design for Harbourview
            Bakehouse. …”
          </p>
        ) : (
          <>
            <Phrase show reduce={reduce}>
              Hi{fn ? ` ${fn}` : ""},
            </Phrase>

            <Phrase show={picked.length > 0 || draft.unsure || !!biz} reduce={reduce} delay={0.04}>
              {picked.length > 0 ? (
                <>
                  Thanks for reaching out about {services}
                  {biz ? <> for {biz}</> : null}.
                </>
              ) : draft.unsure ? (
                <>Thanks for reaching out{biz ? <> about {biz}</> : null} — happy to help you work out what you need.</>
              ) : (
                <>Thanks for reaching out about {biz}.</>
              )}
            </Phrase>

            {picked.map((p, i) => (
              <Phrase key={p} show reduce={reduce} delay={0.06 + i * 0.04}>
                {PILLAR_LINE[p]}
              </Phrase>
            ))}

            <Phrase show reduce={reduce} delay={0.12}>
              {NEXT_STEP}
            </Phrase>

            <Phrase show reduce={reduce} delay={0.16}>
              Prachets
            </Phrase>
          </>
        )}
      </div>

      <style>{`
        .rp {
          border: 1px solid rgba(20,20,18,0.14);
          border-radius: 12px;
          background: var(--color-bg);
          overflow: hidden;
          box-shadow: 0 24px 56px -34px rgba(20,20,18,0.34);
        }
        .rp-chrome {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 16px;
          background: var(--color-bg-alt);
          border-bottom: 1px solid rgba(20,20,18,0.12);
        }
        .rp-tab, .rp-meta {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .rp-tab { color: var(--color-ink); }
        .rp-meta { color: var(--color-muted); text-transform: none; letter-spacing: 0.03em; }
        .rp-head {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(20,20,18,0.10);
          display: flex; flex-direction: column; gap: 6px;
        }
        .rp-row { display: grid; grid-template-columns: 62px minmax(0,1fr); gap: 10px; align-items: baseline; }
        .rp-rl {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--color-muted);
        }
        .rp-rv { font-size: 14px; color: var(--color-ink); overflow-wrap: anywhere; }
        .rp-rv--dim { color: var(--color-muted); }
        .rp-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; min-height: 220px; }
        .rp-line { margin: 0; font-size: 15px; line-height: 1.6; color: var(--color-ink); }
        .rp-eg { margin: 0; font-size: 15px; line-height: 1.6; color: var(--color-muted-2); font-style: italic; }
        @media (max-width: 1023px) {
          .rp-body { min-height: 0; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="rp-row">
      <span className="rp-rl">{label}</span>
      <span className={dim ? "rp-rv rp-rv--dim" : "rp-rv"}>{value}</span>
    </div>
  );
}
