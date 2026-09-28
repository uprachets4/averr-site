import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, easing } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import { caseStudies } from "../../data/caseStudies";

function rgba(hex: string, alpha: number) {
  if (!hex.startsWith("#")) return hex;
  const h = hex.slice(1);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Live studies in data order — the same order /work lists them. */
function liveSlugs() {
  return Object.values(caseStudies)
    .filter(function isLive(s) {
      return s.status === "live";
    })
    .map(function slug(s) {
      return s.slug;
    });
}

/** The next live study, wrapping at the end. Drafts are never linked. */
export function nextStudy(slug: string) {
  const live = liveSlugs();
  const i = live.indexOf(slug);
  const next = live[(i + 1) % live.length];
  return caseStudies[next];
}

/**
 * The film with no ending.
 *
 * The next study's hero image starts at 60% of the container and expands,
 * as you scroll, to the full viewport width — past the container, edge to
 * edge — with its radius closing and that study's tint rising behind it.
 * Normal flow, not sticky.
 */
export default function CaseFinale({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const next = nextStudy(slug);
  const ref = useRef<HTMLElement | null>(null);
  const [mobile, setMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  useEffect(function watch() {
    const mq = window.matchMedia("(max-width: 900px)");
    setMobile(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setMobile(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const tint = next.tint || "var(--color-ink)";
  const hero = next.heroImage || next.heroImages?.[0];

  // measured, not calc(): motion cannot interpolate calc(...) to 100vw and
  // snaps straight to the end value, so the widths are resolved to pixels
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ container: 0, viewport: 0 });

  useEffect(function measure() {
    function read() {
      setDims({
        container: containerRef.current?.clientWidth ?? 0,
        viewport: document.documentElement.clientWidth,
      });
    }
    read();
    window.addEventListener("resize", read);
    return function cleanup() {
      window.removeEventListener("resize", read);
    };
  }, []);

  // 60% of the container out to the full viewport; on mobile it stops at the
  // container so nothing bleeds past the screen edge
  const from = dims.container * (mobile ? 0.9 : 0.6);
  const to = mobile ? dims.container : dims.viewport;
  const width = useTransform(scrollYProgress, [0, 0.85], [from, to], {
    ease: [easing.inOut],
  });
  const radius = useTransform(scrollYProgress, [0, 0.85], [16, mobile ? 12 : 0], {
    ease: [easing.inOut],
  });

  return (
    <>
      <section
        ref={ref}
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "120px 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="grain-light" aria-hidden="true" />
        <TintGlow progress={scrollYProgress} tint={tint} reduce={!!reduce} />

        <div
          ref={containerRef}
          style={{
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{ color: "var(--color-muted)", marginBottom: 24 }}
          >
            Next case study
          </motion.div>

          <motion.h2
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: ease.outExpo, delay: 0.1 }}
            className="type-display-2xl"
            style={{ color: "var(--color-ink)", margin: "0 0 56px" }}
          >
            {next.client}
          </motion.h2>
        </div>

        {/* the image opens out of the container */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              position: "relative",
              width: reduce ? to : width,
              borderRadius: reduce ? (mobile ? 12 : 0) : radius,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(20,20,18,0.18)",
            }}
          >
            {hero ? (
              <img
                src={hero}
                alt={`${next.client} — next case study`}
                loading="lazy"
                decoding="async"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            ) : null}

            {/* a scrim so the CTA never reads as part of the client's own UI */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "35%",
                background:
                  "linear-gradient(to bottom, rgba(244,240,230,0) 0%, rgba(244,240,230,0.78) 55%, rgba(244,240,230,0.94) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* the whole image is clickable, but only the CTA takes a tab stop */}
            <Link
              to={`/work/${next.slug}`}
              aria-hidden="true"
              tabIndex={-1}
              style={{ position: "absolute", inset: 0 }}
            />

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "35%",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "var(--container-wide)",
                  // --container-wide already subtracts the gutter; adding
                  // padding here would inset the CTA twice
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                <div
                  className="type-eyebrow"
                  style={{ color: "var(--color-muted)", marginBottom: 12 }}
                >
                  {next.client}
                </div>
                <div style={{ pointerEvents: "auto", display: "inline-block" }}>
                  <MagneticCTA to={`/work/${next.slug}`} variant="primary">
                    {`Continue to ${next.client}`}
                  </MagneticCTA>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* the only booking CTA at the end of a case study */}
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "40px 0 96px",
          textAlign: "center",
        }}
      >
        <Link
          to="/contact"
          className="type-small case-finale__skip"
          style={{ color: "var(--color-muted)" }}
        >
          Or skip ahead — book a discovery call
        </Link>
      </div>

      <style>{`
        .case-finale__skip {
          border-bottom: 1px solid var(--hair-hi);
          padding-bottom: 2px;
          transition: color ${duration.base * 1000}ms var(--ease-in-out),
                      border-color ${duration.base * 1000}ms var(--ease-in-out);
        }
        .case-finale__skip:hover { color: var(--color-ink); border-color: var(--color-ink); }
        @media (prefers-reduced-motion: reduce) { .case-finale__skip { transition: none; } }
      `}</style>
    </>
  );
}

/** The next study's tint rises behind the opening image, 0 → 12%. */
function TintGlow({
  progress,
  tint,
  reduce,
}: {
  progress: MotionValue<number>;
  tint: string;
  reduce: boolean;
}) {
  const alpha = useTransform(progress, [0, 0.85], [0, 0.12]);
  const paint = useRef<HTMLDivElement | null>(null);

  useEffect(
    function repaint() {
      function write(a: number) {
        const el = paint.current;
        if (!el) return;
        el.style.background = `radial-gradient(ellipse 70% 60% at 50% 60%, ${rgba(
          tint,
          a
        )}, transparent 72%)`;
      }
      write(reduce ? 0.12 : alpha.get());
      if (reduce) return;
      return alpha.on("change", write);
    },
    [alpha, tint, reduce]
  );

  return (
    <div
      ref={paint}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  );
}
