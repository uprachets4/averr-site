import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { duration, ease } from "../../lib/motion";
import { CharRevealInView } from "../CharReveal";

/** A leading phase marker, if the sentence opens with one. Nothing is rewritten. */
const PHASE = /^(Weeks?\s\d+(?:\s?[–-]\s?\d+)?|Next|Then|Before|After)\b/;

/** Split on sentence ends, keeping each sentence whole. */
function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(function trim(s) {
      return s.trim();
    })
    .filter(Boolean);
}

/**
 * What's next — a lit timeline.
 *
 * Each sentence is a node on a vertical hairline that fills with the study's
 * tint as you read. Sentences that open with a phase ("Weeks 4–12", "Next",
 * "A small beta") surface that phrase as a mono label on the node. No
 * sentence is rewritten; the label is a prefix of the sentence itself.
 */
export default function Next({ text, tint }: { text: string; tint?: string }) {
  const reduce = useReducedMotion();
  const accent = tint || "var(--color-ink)";
  const nodes = sentences(text);

  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [lit, setLit] = useState(reduce ? nodes.length : 0);

  useEffect(
    function trackReading() {
      if (reduce) {
        setLit(nodes.length);
        if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
        return;
      }
      let frame = 0;

      function read() {
        frame = 0;
        const line = window.innerHeight * 0.6;
        let count = 0;
        refs.current.forEach(function check(el, i) {
          if (el && el.getBoundingClientRect().top <= line) count = i + 1;
        });
        setLit(function keep(prev) {
          return count > prev ? count : prev;
        });
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${
            nodes.length ? Math.min(1, count / nodes.length) : 0
          })`;
        }
      }

      function onScroll() {
        if (frame) return;
        frame = requestAnimationFrame(read);
      }

      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return function cleanup() {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [nodes.length, reduce]
  );

  return (
    <section
      id={SECTIONS.next.id}
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 0",
        borderTop: "1px solid var(--hair)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          data-section-heading
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          {eyebrowFor(SECTIONS.next)}
        </motion.div>

        <h2 className="type-h2" style={{ color: "var(--color-ink)", marginBottom: 64 }}>
          <CharRevealInView
            text="What happens next."
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        <div style={{ position: "relative", paddingLeft: 36 }}>
          {/* the track, filling as the nodes light */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 5,
              top: 6,
              bottom: 6,
              width: 1,
              background: "var(--hair)",
            }}
          >
            <div
              ref={fillRef}
              style={{
                position: "absolute",
                inset: 0,
                background: accent,
                transformOrigin: "top",
                transform: "scaleY(0)",
                transition: reduce
                  ? "none"
                  : `transform ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
              }}
            />
          </div>

          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {nodes.map(function node(sentence, i) {
              const on = i < lit;
              const phase = sentence.match(PHASE);
              const label = phase ? phase[0] : null;
              // The phase becomes the node's label; the remainder keeps its
              // own words and punctuation. The only thing dropped is a colon
              // sitting directly after the label — its whole job was to
              // separate the two, which the layout now does.
              const rest = label
                ? sentence.slice(label.length).replace(/^:\s*/, "").trimStart()
                : sentence;
              return (
                <li
                  key={i}
                  ref={function keep(el) {
                    refs.current[i] = el;
                  }}
                  style={{ position: "relative", paddingBottom: 32 }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: -36,
                      top: 7,
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      border: "1px solid",
                      borderColor: on ? accent : "var(--hair-hi)",
                      background: on ? accent : "var(--color-bg-alt)",
                      transition: reduce
                        ? "none"
                        : `background-color ${duration.base * 1000}ms ease, border-color ${
                            duration.base * 1000
                          }ms ease`,
                    }}
                  />
                  {label ? (
                    <div
                      className="type-eyebrow"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: on ? accent : "var(--color-muted-2)",
                        marginBottom: 6,
                        transition: reduce
                          ? "none"
                          : `color ${duration.base * 1000}ms ease`,
                      }}
                    >
                      {label}
                    </div>
                  ) : null}
                  <p
                    className="type-body-lg"
                    style={{
                      color: "var(--color-ink-soft)",
                      maxWidth: 820,
                      margin: 0,
                      opacity: on ? 1 : 0.45,
                      transition: reduce
                        ? "none"
                        : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
                    }}
                  >
                    {rest}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
