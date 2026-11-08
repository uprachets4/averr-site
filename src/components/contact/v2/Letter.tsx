import { useEffect, useRef } from "react";
import { BRIEF_SERVICES, LETTER, joinList } from "../../../data/contactBrief";
import { lowerFirst, type BriefState } from "./briefState";
import { useReveal } from "./useReveal";

/**
 * The letter, composing itself from the brief.
 *
 * Built as real elements rather than the reference's innerHTML
 * string: the values are whatever the visitor typed, and React
 * escapes them for us. The reference had to call `esc()` by hand on
 * every one.
 *
 * A changed value flashes once. The flash is a class on a node, and
 * the letter re-renders on the next keystroke anyway, so it is
 * cleared by a timer that only touches that node.
 */

/** A blank, shown as a dashed placeholder. */
function Blank({ children }: { children: React.ReactNode }) {
  return <span className="bl">{children}</span>;
}

export default function Letter({
  state,
  changed,
  date,
  letterRef,
  folding,
}: {
  state: BriefState;
  /** Which field changed last, so only that value flashes. */
  changed: string;
  /** "November 8", in Toronto. */
  date: string;
  letterRef: (el: HTMLElement | null) => void;
  folding: boolean;
}) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  /* `.in` is state, not a class written onto the node: this element
     re-renders on every keystroke and React would reconcile it away. */
  const reveal = useReveal<HTMLElement>();

  /* Clear the flash after it has played, without re-rendering. */
  useEffect(
    function unflash() {
      const el = bodyRef.current?.querySelector(".v.flash");
      if (!el) return;
      const t = window.setTimeout(() => el.classList.remove("flash"), 700);
      return () => window.clearTimeout(t);
    },
    [state, changed]
  );

  const V = function V({ k, children }: { k: string; children: React.ReactNode }) {
    return <span className={`v${k === changed ? " flash" : ""}`}>{children}</span>;
  };

  const name = state.name.trim();
  const biz = state.business.trim();
  const email = state.email.trim();
  const gist = state.gist.trim();
  const link = state.link.trim();
  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));

  return (
    <article
      className={`letter ${reveal.cls}${folding ? " folding" : ""}`}
      ref={(el) => {
        reveal.ref.current = el;
        letterRef(el);
      }}
      aria-label="Your letter, as it will arrive"
    >
      <div className="lhd">
        <span className="mono">To · Prachets Upadhyay</span>
        <span className="mono st">
          <i />
          <span>{date}</span>
        </span>
      </div>

      <div className="lbody" ref={bodyRef}>
        <p>{LETTER.greeting}</p>
        <p>
          I'm {name ? <V k="name">{name}</V> : <Blank>{LETTER.blanks.name}</Blank>}
          {biz ? (
            <>
              , from <V k="business">{biz}</V>
            </>
          ) : null}
          .{" "}
          {state.unsure ? (
            LETTER.unsure
          ) : chosen.length ? (
            <>
              {LETTER.needPrefix}
              {chosen.map(function part(s, i) {
                const subs = (state.subs[s.key] ?? []).map(lowerFirst);
                const last = i === chosen.length - 1;
                const sep = chosen.length < 2 ? "" : last ? "" : i === chosen.length - 2 ? " and " : ", ";
                return (
                  <span key={s.key}>
                    <span className="svcw" style={{ "--sc": s.color } as React.CSSProperties}>
                      {s.name}
                    </span>
                    {subs.length ? ` (${joinList(subs)})` : ""}
                    {sep}
                  </span>
                );
              })}
              .
            </>
          ) : (
            <>
              {LETTER.needPrefix}
              <Blank>{LETTER.blanks.need}</Blank>.
            </>
          )}
          {state.when ? (
            <>
              {LETTER.whenPrefix}
              <V k="when">{state.when}</V>.
            </>
          ) : null}
        </p>

        {gist ? (
          <p className="gist">
            <V k="gist">{gist}</V>
          </p>
        ) : (
          <p>
            <Blank>{LETTER.blanks.gist}</Blank>
          </p>
        )}

        {link ? (
          <p>
            {LETTER.linkPrefix}
            <V k="link">{link}</V>.
          </p>
        ) : null}

        <p>
          {LETTER.reachPrefix}
          {email ? <V k="email">{email}</V> : <Blank>{LETTER.blanks.email}</Blank>}.
        </p>

        <div className="lsig">
          <span>
            {LETTER.signOff}
            <br />
            <b>{name ? name : <Blank>{LETTER.blanks.name}</Blank>}</b>
          </span>
        </div>
      </div>

      <div className="lfoot">{LETTER.footer}</div>
    </article>
  );
}
