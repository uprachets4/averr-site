import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, easing } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import LineReveal from "../LineReveal";
import { liveCount } from "../../data/workIndex";

/** Load timings, unchanged from the old header. */
const T = { eyebrow: 0.2, h1: 0.35, sub: 0.9 };

/**
 * The vault doors.
 *
 * The title splits and walks off both edges while a dark stage opens from a
 * vertical slit in the middle — the doors parting. The wrapper is ~150vh so
 * the 100vh sticky frame has 50vh of travel to do it in.
 *
 * The slit is animated in measured pixels, not percentages: motion cannot
 * interpolate a percentage clip-path against a pixel one, and the stage has
 * to land exactly on the viewport edges.
 */
export default function VaultDoors() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(function measure() {
    function read() {
      setVw(document.documentElement.clientWidth);
    }
    read();
    window.addEventListener("resize", read);
    return function cleanup() {
      window.removeEventListener("resize", read);
    };
  }, []);

  const d = function delay(v: number) {
    return reduce ? 0 : v;
  };

  // pixels, not percentages: the inset has to land on 0 exactly
    // the 150vh wrapper pins the 100vh frame for only its first third, so the
  // doors have to be fully open by then — otherwise they finish opening
  // after the stage has already started scrolling away
  const inset = useTransform(scrollYProgress, [0.05, 0.3], [vw / 2, 0], {
    ease: [easing.inOut],
  });

  // The nav's tone detector collects its targets once per route and cannot
  // see through a clip-path, so the marker it watches lives OUTSIDE the
  // clipped stage and is parked above the viewport until the stage has
  // actually opened across the nav.
  const [covers, setCovers] = useState(false);
  useEffect(
    function watchCoverage() {
      function check(v: number) {
        setCovers(vw > 0 && v < vw * 0.22);
      }
      check(inset.get());
      return inset.on("change", check);
    },
    [inset, vw]
  );

  return (
    <div
      ref={ref}
      className="vault-doors"
      style={{ position: "relative", height: "150vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="grain-light" aria-hidden="true" />

        {/* the title, centred, splitting as you scroll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 2,
            padding: "0 var(--gutter)",
          }}
        >
          <Fading progress={scrollYProgress} reduce={!!reduce} range={[0, 0.17]}>
            <motion.div
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.5), ease: ease.outQuart, delay: d(T.eyebrow) }}
              className="type-eyebrow"
              style={{ color: "var(--color-muted)", marginBottom: 28 }}
            >
              Selected work · {liveCount} live
            </motion.div>
          </Fading>

          {/* the halves are separate flex items, so the accessible name is
              given explicitly rather than concatenating to "Thevault." */}
          <h1
            aria-label="The vault."
            className="type-display-2xl"
            style={{
              color: "var(--color-ink)",
              margin: 0,
              display: "flex",
              gap: "0.25em",
              whiteSpace: "nowrap",
            }}
          >
            <Half progress={scrollYProgress} reduce={!!reduce} vw={vw} side={-1}>
              <LineReveal delay={d(T.h1)} duration={reduce ? 0 : duration.slow}>
                The
              </LineReveal>
            </Half>
            <Half progress={scrollYProgress} reduce={!!reduce} vw={vw} side={1}>
              <LineReveal delay={d(T.h1)} duration={reduce ? 0 : duration.slow}>
                vault.
              </LineReveal>
            </Half>
          </h1>

          <Fading progress={scrollYProgress} reduce={!!reduce} range={[0, 0.15]}>
            <motion.p
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.6), ease: ease.outQuart, delay: d(T.sub) }}
              className="type-body-lg measure-body"
              style={{ color: "var(--color-muted)", margin: "32px auto 0" }}
            >
              Every project below is real. Numbers are measured, not marketing.
              Descriptions are what happened, not what we wish we had.
            </motion.p>
          </Fading>
        </div>

        {/* the stage opening from the centre slit */}
        <Stage inset={inset} reduce={!!reduce} />

        <div
          aria-hidden
          data-tone="dark"
          className="vault-doors__tone"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            // once open it spans the whole frame, so the nav stays dark for
            // as long as the stage is actually under it — a short marker
            // falls above the nav's band as the frame scrolls away
            top: reduce || covers ? 0 : -600,
            bottom: reduce || covers ? 0 : undefined,
            height: reduce || covers ? undefined : 140,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

/** One half of the title, walking off its own edge as it fades. */
function Half({
  progress,
  reduce,
  vw,
  side,
  children,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  vw: number;
  side: 1 | -1;
  children: React.ReactNode;
}) {
  const x = useTransform(progress, [0, 0.3], [0, side * vw * 0.32], {
    ease: [easing.inOut],
  });
  const opacity = useTransform(progress, [0.06, 0.24], [1, 0]);
  const ref = useScrollStyle<HTMLSpanElement>(opacity);

  if (reduce) return <span style={{ display: "inline-block" }}>{children}</span>;

  return (
    <motion.span ref={ref} style={{ display: "inline-block", x }}>
      {children}
    </motion.span>
  );
}

/** Fades up and out of the way as the doors part. */
function Fading({
  progress,
  reduce,
  range,
  children,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [1, 0]);
  const y = useTransform(progress, range, [0, -24], { ease: [easing.inOut] });
  const ref = useScrollStyle<HTMLDivElement>(opacity);

  if (reduce) return <div>{children}</div>;
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

/** The dark stage, opening from a vertical slit to the full viewport. */
function Stage({
  inset,
  reduce,
}: {
  inset: MotionValue<number>;
  reduce: boolean;
}) {
  const clip = useTransform(inset, function toClip(v: number) {
    return `inset(0px ${v}px 0px ${v}px)`;
  });

  return (
    <motion.div
      aria-hidden
      className="vault-doors__stage"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 3,
        backgroundColor: "var(--color-dark)",
        clipPath: reduce ? "inset(0px)" : clip,
        pointerEvents: "none",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />
    </motion.div>
  );
}
