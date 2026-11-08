import { useEffect, useRef } from "react";
import Doors from "./Doors";

/**
 * The opening: the headline lighting word by word, the person, and
 * the two doors.
 *
 * The headline words and the live clock are written onto their nodes
 * directly. The clock is the one thing here that genuinely changes
 * over time, and it is a single text node, so it does not need — and
 * must not have — a React re-render behind it.
 */

/** "builds it" carries the gradient, as two separate words. */
const H1_WORDS = "Write to the person who builds it.".split(" ");

export default function Opening({ onGo }: { onGo: (id: string) => void }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const clockRef = useRef<HTMLSpanElement | null>(null);

  /* The words arrive once the first frame is on screen. The class
     goes on `.ct`, not `body`: the reference used `body.ready`, which
     would leak the state to every other route. */
  useEffect(function lightTheWords() {
    const scope = rootRef.current?.closest(".ct");
    if (!scope) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => scope.classList.add("ready"))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  /* Toronto, refreshed every 15s. */
  useEffect(function torontoClock() {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hour: "numeric",
      minute: "2-digit",
    });
    function tick() {
      if (clockRef.current) {
        clockRef.current.textContent = `Toronto · ${fmt.format(new Date())} · replies within 24 hours`;
      }
    }
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="open gut" aria-labelledby="ct-h1" ref={rootRef}>
      <div className="orb a" aria-hidden="true" />
      <div className="orb b" aria-hidden="true" />
      <div className="wrap opengrid">
        <div>
          <span className="eyebrow">Start here</span>
          <h1 id="ct-h1">
            {H1_WORDS.map(function word(w, i) {
              const grad = w === "builds" || w === "it.";
              return (
                <span key={w + i}>
                  <span className="w" style={{ transitionDelay: `${120 + i * 70}ms` }}>
                    {w === "builds" ? (
                      <span className="gt">builds</span>
                    ) : w === "it." ? (
                      <>
                        <span className="gt">it</span>.
                      </>
                    ) : (
                      w
                    )}
                  </span>
                  {i < H1_WORDS.length - 1 ? " " : null}
                  {grad ? null : null}
                </span>
              );
            })}
          </h1>
          <p className="lede">
            No forms passed between departments, no account managers. You reach
            me, and I'm the one who builds it.
          </p>
          <div className="presence">
            <span className="av">
              <img
                src="/about/avatar.webp"
                alt="Prachets Upadhyay"
                width={44}
                height={44}
                decoding="async"
              />
            </span>
            <div>
              <b>Prachets Upadhyay</b>
              <span ref={clockRef}>Toronto · replies within 24 hours</span>
            </div>
          </div>
        </div>

        <Doors onGo={onGo} />
      </div>
    </section>
  );
}
