import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { duration, ease } from "../../lib/motion";

/**
 * What we built — a checklist that ticks itself as you read.
 *
 * Each item's box draws its check when the item crosses the reading line
 * (~60% of the viewport) and never un-ticks, so scrolling back up leaves
 * the list as you found it. One rAF-throttled scroll handler owns the
 * whole section; items are plain React state, not per-item listeners.
 */
export default function Inventory({
  items,
  stack,
  tint,
}: {
  items: string[];
  stack: string[];
  tint?: string;
}) {
  const reduce = useReducedMotion();
  const accent = tint || "var(--color-ink)";
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [ticked, setTicked] = useState(reduce ? items.length : 0);

  useEffect(
    function tickAsRead() {
      if (reduce) {
        setTicked(items.length);
        return;
      }
      let frame = 0;

      function read() {
        frame = 0;
        const line = window.innerHeight * 0.6;
        let count = 0;
        for (let i = 0; i < itemRefs.current.length; i++) {
          const el = itemRefs.current[i];
          if (el && el.getBoundingClientRect().top <= line) count = i + 1;
        }
        // ticks are one-way: never un-tick on the way back up
        setTicked(function keepHighest(prev) {
          return count > prev ? count : prev;
        });
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
    [items.length, reduce]
  );

  const keep = useCallback(function keepRef(i: number) {
    return function attach(node: HTMLLIElement | null) {
      itemRefs.current[i] = node;
    };
  }, []);

  const allTicked = ticked >= items.length;

  return (
    <section
      id={SECTIONS.inventory.id}
      style={{
        backgroundColor: "var(--color-bg)",
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
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          data-section-heading
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          {eyebrowFor(SECTIONS.inventory)}
        </motion.div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 64,
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
            className="type-h2"
            style={{ color: "var(--color-ink)", maxWidth: 900, margin: 0 }}
          >
            What <span className="fade-h">actually shipped.</span>
          </motion.h2>

          <div
            className="type-eyebrow tnum"
            aria-live="polite"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {String(ticked).padStart(2, "0")} / {String(items.length).padStart(2, "0")} shipped
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 64px" }}>
          {items.map(function row(item, i) {
            const on = i < ticked;
            return (
              <li
                key={i}
                ref={keep(i)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "16px 1fr",
                  gap: 20,
                  alignItems: "start",
                  padding: "22px 0",
                  borderBottom: "1px solid var(--hair)",
                }}
              >
                <CheckBox on={on} accent={accent} reduce={!!reduce} />
                <span
                  className="type-body"
                  style={{
                    color: "var(--color-ink)",
                    opacity: on ? 1 : 0.45,
                    transition: reduce
                      ? "none"
                      : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
                  }}
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ul>

        {stack.length > 0 ? (
          <div>
            <div
              className="type-eyebrow"
              style={{ color: "var(--color-muted-2)", marginBottom: 20 }}
            >
              Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {stack.map(function chip(label, i) {
                return (
                  <motion.span
                    key={label}
                    // the stack assembles only once the last item has ticked
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
                    animate={
                      allTicked || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                    }
                    transition={{
                      duration: reduce ? 0 : duration.base,
                      ease: ease.outQuart,
                      delay: reduce || !allTicked ? 0 : i * 0.04,
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--color-ink-soft)",
                      border: "1px solid var(--hair-hi)",
                      background: "transparent",
                    }}
                  >
                    {label}
                  </motion.span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** 16px hairline square; the check draws itself in the study's tint. */
function CheckBox({
  on,
  accent,
  reduce,
}: {
  on: boolean;
  accent: string;
  reduce: boolean;
}) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width: 16,
        height: 16,
        marginTop: 4,
        border: "1px solid",
        borderColor: on ? accent : "var(--hair-hi)",
        borderRadius: 3,
        position: "relative",
        transition: reduce
          ? "none"
          : `border-color ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
      }}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        style={{ position: "absolute", inset: -1, display: "block" }}
      >
        <motion.path
          d="M3.5 8.4 L6.6 11.4 L12.5 4.9"
          stroke={accent}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: on || reduce ? 1 : 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
            ease: ease.outQuart,
          }}
        />
      </svg>
    </span>
  );
}
