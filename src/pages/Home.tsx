import { useEffect, type CSSProperties } from "react";
import PlanetHero from "../components/home/planet/PlanetHero";

import ThreeScenes from "../components/ThreeScenes";
import ThreeDoors from "../components/ThreeDoors";
import ProofLedger from "../components/ProofLedger";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";
import Chapter from "../components/Chapter";

import { useSetNavDarkOverride } from "../lib/navTone";

/**
 * Home — Session 29.
 *
 * Everything below the hero is the September home restored verbatim from
 * `54c6285` ("20-2 fix: the wordmark actually spans the container"), the
 * last commit whose hero read "businesses that want to look serious."
 * Same components, same copy, same order; the sections themselves are
 * untouched.
 *
 * The hero is the Planet: a pinned 780vh WebGL story that ends on its
 * takeover panel. The takeover opens into --navy-2, so the handoff into
 * the first chapter is dark-to-dark and the page never flashes a ground
 * the site has retired.
 */

/**
 * The September palette, remapped to the dark system — owner instruction,
 * Session 29.
 *
 * These are the SAME token names the restored sections already use, given
 * new values on a wrapper that only home mounts. Nothing global moves, so
 * /services, /about, /work, the case studies and /contact keep the cream
 * ground until they migrate on their own.
 *
 * They are set INLINE rather than in a stylesheet on purpose. `:root` and
 * `.home-sept` have the same specificity, so a stylesheet rule would be
 * decided by source order — the trap §5.76 and §5.38 both record. An
 * inline custom property is inherited by the whole subtree and cannot be
 * outranked by either `:root` block.
 *
 * The values come from the Nolana tokens that already exist in
 * `index.css`, so the dark palette stays single-sourced.
 *
 * Three foldings, because September had four text levels and the owner's
 * map has two: `--color-ink-soft` folds into ink, `--color-muted-2` into
 * muted, and `--hair-hi` into the one hairline value.
 */
const SEPT_DARK = {
  /* grounds */
  "--color-bg": "var(--navy-1)",        /* cream ground      #121C27 */
  "--color-bg-alt": "var(--navy-2)",    /* alternate section #182633 */
  "--color-bg-warm": "var(--navy-2)",
  "--surface-elevated": "var(--navy-3)", /* card / elevated  #232837 */
  "--color-dark": "var(--black)",       /* the contrast moment #080A0A */
  "--color-dark-alt": "var(--navy-3)",

  /* type */
  "--color-ink": "#F5F4F9",
  "--color-ink-soft": "#F5F4F9",
  "--color-parch": "#F5F4F9",
  "--color-muted": "rgba(245,244,249,.66)",
  "--color-muted-2": "rgba(245,244,249,.66)",
  "--color-muted-l": "rgba(245,244,249,.66)",

  /* hairlines and borders */
  "--hair": "rgba(245,244,249,.16)",
  "--hair-hi": "rgba(245,244,249,.16)",
  "--hair-d": "rgba(245,244,249,.16)",
  "--hair-d-hi": "rgba(245,244,249,.16)",
} as CSSProperties;

export default function Home() {
  /* Session 27, reaffirmed for 29: the dark glass bar sits on EVERY
     section of home, light ones included — it is part of the system, not
     a reaction to what is under it. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      /* Over a LIGHT section the default translucent bar washes out to
         grey. On home it is the solid dark bar the system calls for. */
      const root = document.documentElement;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
      };
    },
    [setNavDark]
  );

  return (
    <>
      <PlanetHero />

      <div className="home-sept" style={SEPT_DARK}>
        {/* The closer's pill, inverted for the dark ground.
            `PillHl`'s own `invert` prop CANNOT do this: the component
            early-returns the static pill when `entrance === "none" &&
            surface`, before `invert` is ever read, so passing it here is
            a silent no-op — the DOM comes out `.pill-hl` with no
            `--invert` and no slab child. The static pill paints its
            surface on `.pill-hl` itself and its text on
            `.pill-hl:not(.pill-hl--bare) > span`, so those are the two
            rules to answer.
            Compound selectors at (0,3,0) and (0,3,1) against the base
            rules' (0,1,0) and (0,1,1), so this cannot turn on source
            order the way §5.38 and §5.76 did, and it is scoped to
            .home-sept so the 404's pill is untouched. */}
        <style>{`
          .home-sept .pill-hl:not(.pill-hl--bare) {
            background: linear-gradient(135deg, #F5F4F9 0%, #EFEEF5 100%);
            box-shadow:
              inset 0 0 0 1px rgba(15,17,23,0.08),
              inset 0 -1px 0 rgba(15,17,23,0.12),
              0 10px 40px -14px rgba(0,0,0,0.7);
          }
          /* background-IMAGE, not the shorthand: the word is painted with
             background-clip:text, and the shorthand resets background-clip
             to border-box. Written as the shorthand here it filled the box
             instead of the glyphs and the word disappeared entirely. The
             clip properties are re-declared so this rule is self-contained. */
          .home-sept .pill-hl:not(.pill-hl--bare) > span {
            background-image: linear-gradient(180deg, #0F1117 0%, #121C27 100%);
            -webkit-background-clip: text;
            background-clip: text;
          }
        `}</style>

        {/* The hero ends dark in every mode, so the handoff back to the
            first chapter uses the site's own transition signature. The
            tone names are September's; only their values have moved. */}
        <Chapter tone="cream" from="dark">
          <ThreeScenes />
          <ThreeDoors />
        </Chapter>

        {/* One darker chapter: the work, then the manifesto. */}
        <Chapter tone="dark" from="cream-alt">
          <ProofLedger />
          <Manifesto />
        </Chapter>

        <Chapter tone="cream" from="dark">
          <FinalCTA markerNumber="06" />
        </Chapter>
      </div>
    </>
  );
}
