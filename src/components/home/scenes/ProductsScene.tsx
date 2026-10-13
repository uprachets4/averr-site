import { motion, useTransform, type MotionValue } from "motion/react";
import { easing } from "../../../lib/motion";
import { useScrollStyle } from "../../../lib/useScrollStyle";

/**
 * Ch3 — "From pieces to a product."
 *
 *   B1  the pieces lock into an APP SKELETON in isometric 3D — a nav
 *       rail, KPI cards, a chart that draws, a table of rows — all
 *       primitives, no screenshot, with a contact shadow under it.
 *   B2  it EXPLODES along z into named layers with leader lines, and
 *       the camera orbits.
 *   B3  the layers re-lock and a design-system ring of components
 *       orbits the assembled app.
 *
 * Every opacity here is written straight to the node: this lives inside
 * a sticky pin, where motion would compile a scroll-linked opacity onto
 * a ViewTimeline that never advances.
 */

type P = {
  assemble: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
};

const LAYERS = [
  { id: "nav", name: "Navigation" },
  { id: "components", name: "Components" },
  { id: "data", name: "Data" },
  { id: "logic", name: "Logic" },
  { id: "system", name: "Design system" },
];

/** The ring that orbits the finished app in B3. */
const RING = ["Button", "Field", "Toggle", "Chip", "Card", "Tab"];

function Layer({ i, id, name, t }: { i: number; id: string; name: string; t: MotionValue<number> }) {
  const mid = (LAYERS.length - 1) / 2;
  const spread = useTransform(t, [0.08, 0.4, 0.66], [0, 1, 0], { ease: easing.inOut });
  const z = useTransform(spread, (s) => s * (i - mid) * -210);
  const y = useTransform(spread, (s) => s * (i - mid) * -58);
  const labelOn = useTransform(t, [0.18, 0.3, 0.54, 0.62], [0, 1, 1, 0]);
  const labelRef = useScrollStyle<HTMLSpanElement>(labelOn);

  return (
    <motion.div className={`pr-layer pr-layer--${id}`} style={{ z, y }}>
      <span className="pr-layer__plate" style={{ "--slot": i } as React.CSSProperties}>
        {id === "nav" ? (
          <span className="pr-nav">
            <i /><i /><i /><i />
          </span>
        ) : null}
        {id === "components" ? (
          <span className="pr-kpis">
            <b /><b /><b />
          </span>
        ) : null}
        {id === "data" ? (
          <span className="pr-table">
            <u /><u /><u /><u />
          </span>
        ) : null}
        {id === "logic" ? (
          <svg className="pr-line" viewBox="0 0 220 70" aria-hidden>
            <path d="M8 58 L48 44 L88 50 L128 26 L168 20 L212 8" fill="none" />
          </svg>
        ) : null}
        {id === "system" ? (
          <span className="pr-sys">
            <em>Aa</em>
            <i style={{ "--c": "#C8763C" } as React.CSSProperties} />
            <i style={{ "--c": "#EDE9E2" } as React.CSSProperties} />
          </span>
        ) : null}
      </span>
      <span ref={labelRef} className="pr-layer__lead" aria-hidden>
        <span className="pr-layer__rule" />
        <span className="pr-layer__name">{name}</span>
      </span>
    </motion.div>
  );
}

export default function ProductsScene({ assemble, tiltX, tiltY }: P) {
  /* B2's orbit — the camera turns about 15° while the layers are apart */
  const orbit = useTransform(assemble, [0.2, 0.45, 0.68], [0, 15, 0], { ease: easing.inOut });
  /* B3's ring */
  const ringOn = useTransform(assemble, [0.7, 0.82], [0, 1]);
  const ringRef = useScrollStyle<HTMLDivElement>(ringOn);
  const ringSpin = useTransform(assemble, [0.7, 1], [0, 62]);

  return (
    <motion.div
      className="pr-stage"
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1500 }}
    >
      {/* THE ORBIT AND THE ISOMETRIC CANNOT SHARE A NODE. motion writes
          its own `transform` from rotateZ, which replaced the
          stylesheet's rotateX/rotateZ entirely — the isometric lean
          silently never applied and the counter-rotated labels were
          undoing an angle that was not there. */}
      <motion.div className="pr-orbit" style={{ rotateZ: orbit }}>
        <div className="pr-iso">
        <span className="pr-shadow" aria-hidden />
        {LAYERS.map(function one(l, i) {
          return <Layer key={l.id} i={i} id={l.id} name={l.name} t={assemble} />;
        })}

        <motion.div ref={ringRef} className="pr-ring" style={{ rotateZ: ringSpin }} aria-hidden>
          {RING.map(function chip(label, i) {
            return (
              <span
                key={label}
                className="pr-ring__chip"
                style={{ "--a": `${(i / RING.length) * 360}deg` } as React.CSSProperties}
              >
                <span style={{ "--a": `${-(i / RING.length) * 360}deg` } as React.CSSProperties}>
                  {label}
                </span>
              </span>
            );
          })}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
