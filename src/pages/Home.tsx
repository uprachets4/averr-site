import { Suspense, lazy, useCallback, useEffect, type CSSProperties } from "react";
import NolanaHero from "../components/nolana/NolanaHero";
import LazyBelowFold from "../components/LazyBelowFold";
import { GradientDefs } from "../components/nolana/Bits";
import { Problem, WhatWeBuild, Numbers } from "../components/nolana/Sections";

import { useSetNavDarkOverride } from "../lib/navTone";

/**
 * Home, on the Nolana system.
 *
 * There is a single dark ground from the first pixel to the last. The
 * story is told with LIGHT — a fixed layer whose colour interpolates
 * with scroll — rather than with the cream/ink chapter grounds the site
 * used until Session 25. Every chapter sits on the same ground and is
 * coloured by where the reader is in the page.
 *
 * Chapter order: what we build (the hero) → websites → products →
 * automation → marketing → the work → who builds it → your move.
 *
 * Everything below the hero loads below the fold; the hero is the LCP
 * surface and carries nothing it does not need.
 */

/* Below the fold, so they stay out of the initial graph: with both in
   it home's initial JS was +4.43 kB against a +3 budget. */
const DeviceStory = lazy(() => import("../components/nolana/DeviceStory"));
const WorkCards = lazy(() => import("../components/nolana/WorkCards"));
const OneStudio = lazy(() => import("../components/nolana/Closing").then(m => ({ default: m.OneStudio })));
const WhoBuildsIt = lazy(() => import("../components/nolana/Closing").then(m => ({ default: m.WhoBuildsIt })));
const Ending = lazy(() => import("../components/nolana/Closing").then(m => ({ default: m.Ending })));

/** The reserve a chapter holds while its chunk is in flight.
 *  There are TWO of these per chapter -- LazyBelowFold's placeholder and
 *  the Suspense fallback behind it -- and they have to agree. A 320vh
 *  fallback left on the Suspense boundary was still collapsing the page
 *  by ~1,843px on a phone after the placeholder itself was fixed. */
function Reserve({ h, sm }: { h: string; sm: string }) {
  return (
    <div
      aria-hidden
      className="lbf-reserve"
      style={{ "--lbf-h": h, "--lbf-h-sm": sm } as CSSProperties}
    />
  );
}

export default function Home() {
  /* 27c: the footer is navy on every route now, so home no longer
     declares an end tone for it. */

  /* Session 27: the dark glass bar sits on EVERY section of home, light
     ones included — it is part of the system, not a reaction to what is
     under it. */
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

  const loadStory = useCallback(() => import("../components/nolana/DeviceStory"), []);
  const loadWorkCards = useCallback(() => import("../components/nolana/WorkCards"), []);
  const loadClosing = useCallback(() => import("../components/nolana/Closing"), []);

  return (
    <div className="home-nolana">

      <GradientDefs />
      <NolanaHero />
      <Problem />
      <WhatWeBuild />
      <LazyBelowFold load={loadStory} minHeight="420vh" minHeightSm="119vh" background="transparent">
        <Suspense fallback={<Reserve h="420vh" sm="119vh" />}>
          <DeviceStory />
        </Suspense>
      </LazyBelowFold>
      <Numbers />

      <LazyBelowFold load={loadWorkCards} minHeight="110vh" minHeightSm="158vh" background="transparent">
        <Suspense fallback={<Reserve h="110vh" sm="158vh" />}>
          <WorkCards />
        </Suspense>
      </LazyBelowFold>

      <LazyBelowFold load={loadClosing} minHeight="150vh" minHeightSm="150vh" background="transparent">
        <Suspense fallback={<Reserve h="150vh" sm="150vh" />}>
          <OneStudio />
          <WhoBuildsIt />
          <Ending />
        </Suspense>
      </LazyBelowFold>
    </div>
  );
}
