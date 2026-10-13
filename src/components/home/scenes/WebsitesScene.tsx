import { motion, useTransform, type MotionValue } from "motion/react";
import { easing } from "../../../lib/motion";
import { useScrollStyle } from "../../../lib/useScrollStyle";

/**
 * Ch2 — "From pieces to a page."
 *
 * Three beats on one scroll value, with the cursor camera leaning the
 * whole stage. Nothing here is a screenshot: the page is built from the
 * same primitives the hero is made of.
 *
 *   B1  the pieces arrive and separate into an EXPLODED AXONOMETRIC
 *       page — five layers stacked along z, each with a leader line and
 *       its name.
 *   B2  the layers COMPRESS into one finished page inside a browser
 *       frame, and it glows as it lands.
 *   B3  a phone folds out beside it with the same page reflowed, and a
 *       booking chip flies toward the camera and settles.
 *
 * The five layer names are the five things a site is made of, which is
 * the argument the chapter is making.
 */

type P = {
  assemble: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
};

const LAYERS = [
  { id: "type", name: "Typography" },
  { id: "colour", name: "Colour" },
  { id: "layout", name: "Layout" },
  { id: "components", name: "Components" },
  { id: "content", name: "Content" },
];

/** What each layer shows when it is exploded out on its own. */
function LayerFace({ id }: { id: string }) {
  if (id === "type") {
    return (
      <span className="wb-face wb-face--type">
        <b>Aa</b>
        <i>Aa</i>
      </span>
    );
  }
  if (id === "colour") {
    return (
      <span className="wb-face wb-face--colour">
        <i style={{ "--c": "#141412" } as React.CSSProperties} />
        <i style={{ "--c": "#C8763C" } as React.CSSProperties} />
        <i style={{ "--c": "#EDE9E2" } as React.CSSProperties} />
        <i style={{ "--c": "#6B665C" } as React.CSSProperties} />
      </span>
    );
  }
  if (id === "layout") {
    return (
      <span className="wb-face wb-face--layout">
        <i /><i /><i /><i /><i /><i />
      </span>
    );
  }
  if (id === "components") {
    return (
      <span className="wb-face wb-face--comp">
        <em>Get a quote</em>
        <span className="wb-face__sw" />
      </span>
    );
  }
  return (
    <span className="wb-face wb-face--content">
      <b>Northgate</b>
      <i /><i />
    </span>
  );
}

function Layer({
  i,
  id,
  name,
  t,
}: {
  i: number;
  id: string;
  name: string;
  t: MotionValue<number>;
}) {
  const mid = (LAYERS.length - 1) / 2;
  /* B1 separates them along z and up the diagonal; B2 brings them home.
     The explosion goes BACKWARD — a plane pushed toward the camera is
     magnified by the perspective and spills out of the column, the
     fault 25b found in the old exploded object. */
  const spread = useTransform(t, [0.05, 0.36, 0.62], [0, 1, 0], { ease: easing.inOut });
  const z = useTransform(spread, (s) => s * (i - mid) * -235);
  const x = useTransform(spread, (s) => s * (i - mid) * 46);
  const y = useTransform(spread, (s) => s * (i - mid) * -66);
  const labelOn = useTransform(t, [0.14, 0.26, 0.5, 0.58], [0, 1, 1, 0]);
  /* Opacity goes straight to the node. Inside this pin motion compiles a
     scroll-linked opacity onto a ViewTimeline that never advances — the
     rule Sessions 22 and 24a cost themselves learning. Transforms are
     unaffected and stay on motion. */
  const labelRef = useScrollStyle<HTMLSpanElement>(labelOn);

  return (
    <motion.div className="wb-layer" style={{ z, x, y }}>
      <span className="wb-layer__plate" style={{ "--slot": i } as React.CSSProperties}>
        <LayerFace id={id} />
      </span>
      <span ref={labelRef} className="wb-layer__lead" aria-hidden>
        <span className="wb-layer__rule" />
        <span className="wb-layer__name">{name}</span>
      </span>
    </motion.div>
  );
}

export default function WebsitesScene({ assemble, tiltX, tiltY }: P) {
  /* B2: the finished page resolves as the layers close up. */
  const pageOn = useTransform(assemble, [0.5, 0.66], [0, 1]);
  const pageGlow = useTransform(assemble, [0.6, 0.72, 0.86], [0, 1, 0.35]);
  /* B3: the phone folds out on its own hinge, and the chip flies in. */
  const foldDeg = useTransform(assemble, [0.7, 0.86], [-96, 0], { ease: easing.inOut });
  const phoneOn = useTransform(assemble, [0.7, 0.8], [0, 1]);
  const chipZ = useTransform(assemble, [0.82, 0.96], [-420, 60], { ease: easing.inOut });
  const chipOn = useTransform(assemble, [0.82, 0.9], [0, 1]);

  const pageRef = useScrollStyle<HTMLDivElement>(pageOn);
  const glowRef = useScrollStyle<HTMLSpanElement>(pageGlow);
  const phoneRef = useScrollStyle<HTMLDivElement>(phoneOn);
  const chipRef = useScrollStyle<HTMLDivElement>(chipOn);

  return (
    <motion.div
      className="wb-stage"
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1500 }}
    >
      <div className="wb-axon">
        {LAYERS.map(function one(l, i) {
          return <Layer key={l.id} i={i} id={l.id} name={l.name} t={assemble} />;
        })}

        {/* B2 — the finished page, in a browser frame */}
        <motion.div ref={pageRef} className="wb-page">
          <span className="wb-page__chrome" aria-hidden>
            <i /><i /><i />
          </span>
          <span className="wb-page__body">
            <span className="wb-page__mark">Northgate</span>
            <span className="wb-page__h">
              Rooms that <em>feel finished.</em>
            </span>
            <span className="wb-page__hero" />
            <span className="wb-page__cards">
              <i /><i /><i />
            </span>
          </span>
          <span ref={glowRef} className="wb-page__glow" aria-hidden />
        </motion.div>

        {/* B3 — the same page, reflowed, folding out on its hinge */}
        <motion.div ref={phoneRef} className="wb-phone" style={{ rotateY: foldDeg }}>
          <span className="wb-phone__screen">
            <span className="wb-phone__mark">Northgate</span>
            <span className="wb-phone__h">
              Rooms that <em>feel finished.</em>
            </span>
            <span className="wb-phone__hero" />
            <i /><i />
          </span>
        </motion.div>

        {/* B3 — the booking that the page exists to produce */}
        <motion.div ref={chipRef} className="wb-chip" style={{ z: chipZ }}>
          <span className="wb-chip__tick" aria-hidden>✓</span>
          New enquiry
        </motion.div>
      </div>
    </motion.div>
  );
}
