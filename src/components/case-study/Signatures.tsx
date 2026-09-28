import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { duration, ease, easing } from "../../lib/motion";
import ImageFrame from "./ImageFrame";
import { CharRevealInView } from "../CharReveal";
import { ReadFill } from "./ReadFill";

type Focal = { x: number; y: number };
type Item = { title: string; body: string; image?: string; focal?: Focal };

const DEFAULT_FOCAL: Focal = { x: 0.5, y: 0.5 };

/**
 * Signature moments — one full-width row per signature, the image zooming
 * into the detail its copy describes.
 *
 * The zoom's transform-origin is the signature's own `focal` point, so the
 * push-in lands on the thing being talked about rather than the middle of
 * the screenshot. The frame clips; only the image transforms.
 */
export default function Signatures({
  items,
  imageSrc,
  imageAlt,
  tint,
}: {
  items: Item[];
  imageSrc?: string;
  imageAlt?: string;
  tint?: string;
}) {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(true);

  useEffect(function watch() {
    const mq = window.matchMedia("(min-width: 901px)");
    setDesktop(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // legacy single signatureImage still fills the first item that lacks one
  const merged: Item[] = items.map(function fill(it, i) {
    return i === 0 && !it.image && imageSrc ? { ...it, image: imageSrc } : it;
  });

  return (
    <section
      id={SECTIONS.signatures.id}
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "140px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="signatures-header"
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            gap: 40,
            alignItems: "start",
            marginBottom: 72,
          }}
        >
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            data-section-heading
            style={{ color: "var(--color-muted-l)", paddingTop: 12 }}
          >
            {eyebrowFor(SECTIONS.signatures)}
          </motion.div>

          <h2 className="type-h2" style={{ maxWidth: 900, color: "var(--color-parch)" }}>
            <CharRevealInView
              text="The moves that made it read premium."
              style={{ color: "var(--color-parch)" }}
            />
          </h2>
        </div>

        <div>
          {merged.map(function row(item, i) {
            return (
              <SignatureRow
                key={i}
                item={item}
                alt={imageAlt}
                desktop={desktop}
                reduce={!!reduce}
                tint={tint}
                last={i === merged.length - 1}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .signatures-header { grid-template-columns: 1fr !important; gap: 16px !important; }
          .signature-row { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

function SignatureRow({
  item,
  alt,
  desktop,
  reduce,
  tint,
  last,
}: {
  item: Item;
  alt?: string;
  desktop: boolean;
  reduce: boolean;
  tint?: string;
  last: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const focal = item.focal || DEFAULT_FOCAL;

  return (
    <div
      ref={ref}
      className="signature-row"
      style={{
        display: "grid",
        gridTemplateColumns: "58fr 42fr",
        gap: 56,
        alignItems: "center",
        padding: "72px 0",
        borderBottom: last ? "none" : "1px solid var(--hair-d)",
      }}
    >
      {item.image ? (
        <ImageFrame variant="gallery" tone="dark">
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 10",
              overflow: "hidden",
            }}
          >
            <ZoomImage
              src={item.image}
              alt={alt || `${item.title} screen`}
              focal={focal}
              progress={scrollYProgress}
              desktop={desktop}
              reduce={reduce}
            />
          </div>
        </ImageFrame>
      ) : null}

      <div>
        <h3 className="type-h3" style={{ color: "var(--color-parch)", marginBottom: 16 }}>
          {item.title}
        </h3>
        <ReadFill
          text={item.body}
          progress={scrollYProgress}
          reduce={reduce}
          tint={tint}
          className="type-body"
          style={{ color: "var(--color-muted-l)" }}
        />
      </div>
    </div>
  );
}

/** 1 → 1.35 with its origin on the focal point, so the zoom lands on the detail. */
function ZoomImage({
  src,
  alt,
  focal,
  progress,
  desktop,
  reduce,
}: {
  src: string;
  alt: string;
  focal: Focal;
  progress: MotionValue<number>;
  desktop: boolean;
  reduce: boolean;
}) {
  const scale = useTransform(progress, [0.1, 0.9], [1, 1.35], {
    ease: [easing.inOut],
  });

  const origin = `${(focal.x * 100).toFixed(1)}% ${(focal.y * 100).toFixed(1)}%`;

  if (reduce) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" style={IMG} />;
  }

  if (!desktop) {
    return (
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.2 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: duration.slow * 2, ease: ease.inOut }}
        style={{ ...IMG, transformOrigin: origin }}
      />
    );
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ ...IMG, transformOrigin: origin, scale }}
    />
  );
}

const IMG: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};
