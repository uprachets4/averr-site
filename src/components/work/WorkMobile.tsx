import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import ImageFrame from "../case-study/ImageFrame";
import MagneticCTA from "../MagneticCTA";
import { vault, liveCount, type VaultEntry } from "../../data/workIndex";

function rgba(hex: string | undefined, a: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(237,233,226,${a})`;
  const h = hex.slice(1);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * Mobile: no doors, no pin.
 *
 * A static hero, then one full-height section per project that the scroll
 * container snaps to, with small dots down the right instead of the index.
 */
export default function WorkMobile() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(function trackActive() {
    let frame = 0;
    function read() {
      frame = 0;
      const mid = window.innerHeight / 2;
      let next = 0;
      refs.current.forEach(function check(el, i) {
        if (el && el.getBoundingClientRect().top <= mid) next = i;
      });
      setActive(next);
    }
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(read);
    }
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return function cleanup() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <section
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "148px 0 80px",
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
          <div
            className="type-eyebrow"
            style={{ color: "var(--color-muted)", marginBottom: 20 }}
          >
            Selected work · {liveCount} live
          </div>
          <h1
            className="type-display-l"
            style={{ color: "var(--color-ink)", margin: "0 0 24px" }}
          >
            The vault.
          </h1>
          <p
            className="type-body-lg"
            style={{ color: "var(--color-muted)", margin: 0 }}
          >
            Every project below is real. Numbers are measured, not marketing.
            Descriptions are what happened, not what we wish we had.
          </p>
        </div>
      </section>

      <div
        data-tone="dark"
        className="work-snap"
        style={{
          backgroundColor: "var(--color-dark)",
          position: "relative",
          scrollSnapType: reduce ? "none" : "y proximity",
        }}
      >
        {vault.map(function section(entry, i) {
          return (
            <section
              key={entry.slug}
              ref={function keep(el) {
                refs.current[i] = el;
              }}
              style={{
                minHeight: "100svh",
                scrollSnapAlign: reduce ? undefined : "start",
                display: "flex",
                alignItems: "center",
                position: "relative",
                padding: "72px 0",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse 80% 45% at 50% 40%, ${rgba(
                    entry.live ? entry.tint : "#8A8377",
                    0.18
                  )}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  maxWidth: "var(--container-wide)",
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                }}
              >
                {entry.preview ? (
                  <motion.div
                    initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
                    style={{ marginBottom: 28 }}
                  >
                    <ImageFrame variant="gallery" tone="dark">
                      <img
                        src={entry.preview.src}
                        alt={entry.preview.alt}
                        loading="lazy"
                        decoding="async"
                        style={{ display: "block", width: "100%", height: "auto" }}
                      />
                    </ImageFrame>
                  </motion.div>
                ) : null}

                <div
                  className="type-eyebrow"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-muted-l)",
                    marginBottom: 12,
                  }}
                >
                  {entry.sector}
                  {entry.year ? ` · ${entry.year}` : ""}
                </div>

                <h2
                  className="type-h1"
                  style={{
                    color: entry.live ? "var(--color-parch)" : "rgba(237,233,226,0.45)",
                    margin: "0 0 16px",
                  }}
                >
                  {entry.name}
                </h2>

                {entry.figure ? (
                  <>
                    <div
                      className="type-display-l tnum"
                      style={{ color: "var(--color-parch)", lineHeight: 1 }}
                    >
                      {entry.figure.value}
                    </div>
                    <div
                      className="type-body"
                      style={{ color: "var(--color-muted-l)", marginTop: 8 }}
                    >
                      {entry.figure.caption}
                    </div>
                  </>
                ) : entry.status ? (
                  <div className="type-h3" style={{ color: "var(--color-muted-l)" }}>
                    {entry.status}
                  </div>
                ) : null}

                <div
                  className="type-eyebrow"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-muted-l)",
                    margin: "20px 0 28px",
                  }}
                >
                  {entry.live ? entry.pillars.join(" · ") : "IN PROGRESS"}
                </div>

                {entry.live ? (
                  <MagneticCTA to={`/work/${entry.slug}`} variant="primary" tone="dark">
                    Open case study
                  </MagneticCTA>
                ) : null}
              </div>
            </section>
          );
        })}

        {/* dots instead of the index */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          {vault.map(function dot(entry, i) {
            const on = i === active;
            return (
              <span
                key={entry.slug}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: on
                    ? rgba(entry.live ? entry.tint : "#8A8377", 1)
                    : "rgba(237,233,226,0.28)",
                  transition: `background-color ${duration.base * 1000}ms ease`,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export type { VaultEntry };
