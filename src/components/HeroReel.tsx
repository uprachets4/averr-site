import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ease, spring } from "../lib/motion";
import ImageFrame from "./case-study/ImageFrame";
import MagneticCTA from "./MagneticCTA";
import { reelCards, type ReelCard } from "../data/heroReel";
import Screenshot from "./Screenshot";

/** Reel cards are a third of the viewport at most. */
const REEL_SIZES = "(min-width: 900px) 640px, 70vw";

const MAX_TILT = 3;

/** One anchor per card. Created once at module scope — motion.create()
 *  returns a new component each call and would remount the row. */
const MotionLink = motion.create(Link);
export const CARD_ASPECT = 16 / 10;

/* ── heading ───────────────────────────────────────────────────────── */

export function ReelHeading() {
  return (
    <>
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-muted-l)", marginBottom: 16 }}
      >
        //_SELECTED WORK
      </div>
      <h2 className="type-h2 measure-wide" style={{ color: "var(--color-parch)" }}>
        This is what serious looks like.
      </h2>
    </>
  );
}

export function ReelCTA() {
  return (
    <MagneticCTA to="/work" variant="text" size="md" tone="dark">
      See all work
    </MagneticCTA>
  );
}

/* ── one card ──────────────────────────────────────────────────────── */

export function ReelCardTile({
  card,
  width,
  onFocusCard,
}: {
  card: ReelCard;
  /** CSS width for the tile (38vw pinned, 82vw on the snap row). */
  width: string;
  /** Called when the link takes keyboard focus, so a pinned reel can scroll
   *  the card into view. */
  onFocusCard?: (slug: string) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lift = useMotionValue(0);
  const sRx = useSpring(rx, spring.soft);
  const sRy = useSpring(ry, spring.soft);
  const sLift = useSpring(lift, spring.soft);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
    lift.set(-6);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
    lift.set(0);
  }

  return (
    <MotionLink
      ref={ref}
      to={`/work/${card.slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onFocus={function focus() {
        onFocusCard?.(card.slug);
      }}
      aria-label={`${card.client} — case study`}
      style={{
        flex: `0 0 ${width}`,
        width,
        display: "block",
        textDecoration: "none",
        color: "inherit",
        rotateX: reduce ? 0 : sRx,
        rotateY: reduce ? 0 : sRy,
        y: reduce ? 0 : sLift,
        transformPerspective: 1200,
      }}
    >
      <div
        style={{
          aspectRatio: String(CARD_ASPECT),
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        <ImageFrame variant="gallery" tone="dark">
          <Screenshot
            src={card.src}
            alt={card.alt}
            // the h1 must stay LCP — never let a reel image outrank it
            fetchPriority="low"
            sizes={REEL_SIZES}
            style={{ height: "100%", objectFit: "cover" }}
          />
        </ImageFrame>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          marginTop: 20,
        }}
      >
        <h3 className="type-h3" style={{ color: "var(--color-parch)", margin: 0 }}>
          {card.client}
        </h3>
        <div
          className="type-eyebrow"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-muted-l)",
            whiteSpace: "nowrap",
          }}
        >
          {card.tags.join(" · ")}
        </div>
      </div>
    </MotionLink>
  );
}

/* ── static reel: mobile, short viewports, reduced motion ──────────── */

export default function HeroReelStatic() {
  const reduce = useReducedMotion();

  return (
    <div style={{ padding: "96px 0 104px" }}>
      <div style={{ padding: "0 20px", maxWidth: 1200, margin: "0 auto" }}>
        <ReelHeading />
      </div>

      <motion.ul
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart }}
        style={{
          listStyle: "none",
          margin: "40px 0 0",
          padding: "0 20px",
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollSnapType: reduce ? "none" : "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
        className="hero-reel-row"
      >
        {reelCards.map(function drawCard(card) {
          return (
            <li key={card.slug} style={{ scrollSnapAlign: "start" }}>
              <ReelCardTile card={card} width="82vw" />
            </li>
          );
        })}
      </motion.ul>

      <div style={{ padding: "40px 20px 0", maxWidth: 1200, margin: "0 auto" }}>
        <ReelCTA />
      </div>

      <style>{`
        .hero-reel-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export { reelCards };
