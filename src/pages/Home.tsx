import { Suspense, lazy, useCallback } from "react";
import Hero from "../components/Hero";
import LazyBelowFold from "../components/LazyBelowFold";
import ChapterRail from "../components/home/ChapterRail";
import ChapterLightLayer from "../components/home/ChapterLight";
import { useDeclarePageEndTone } from "../lib/pageTone";

/**
 * Home, as one storytelling film on ONE colour flow.
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

const WebsitesChapter = lazy(() => import("../components/home/WebsitesChapter"));
const ProductsChapter = lazy(() => import("../components/home/ProductsChapter"));
const AutomationChapter = lazy(() => import("../components/home/AutomationChapter"));
const MarketingChapter = lazy(() => import("../components/home/MarketingChapter"));
const WorkWall = lazy(() => import("../components/home/WorkWall"));
const FounderChapter = lazy(() => import("../components/home/FounderChapter"));
const StartChapter = lazy(() => import("../components/home/StartChapter"));

export default function Home() {
  /* Home ends dark, so the global footer closes on the same ground instead
     of ending the colour flow with a cream slab. Declared here rather than
     in StartChapter because that chapter is lazy and the footer would
     otherwise paint cream until it mounted. */
  useDeclarePageEndTone("dark");

  const loadWebsites = useCallback(() => import("../components/home/WebsitesChapter"), []);
  const loadProducts = useCallback(() => import("../components/home/ProductsChapter"), []);
  const loadAI = useCallback(() => import("../components/home/AutomationChapter"), []);
  const loadMarketing = useCallback(() => import("../components/home/MarketingChapter"), []);
  const loadWork = useCallback(() => import("../components/home/WorkWall"), []);
  const loadFounder = useCallback(() => import("../components/home/FounderChapter"), []);
  const loadStart = useCallback(() => import("../components/home/StartChapter"), []);

  return (
    <div className="home-dark">
      <ChapterLightLayer />
      <ChapterRail />

      <section id="ch-build" data-tone="dark">
        <Hero />
      </section>

      <section id="ch-websites" data-tone="dark">
        <LazyBelowFold load={loadWebsites} minHeight="320vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "320vh" }} />}>
            <WebsitesChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-products" data-tone="dark">
        <LazyBelowFold load={loadProducts} minHeight="320vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "320vh" }} />}>
            <ProductsChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-ai" data-tone="dark">
        <LazyBelowFold load={loadAI} minHeight="320vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "320vh" }} />}>
            <AutomationChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-marketing" data-tone="dark">
        <LazyBelowFold load={loadMarketing} minHeight="320vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "320vh" }} />}>
            <MarketingChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-work" data-tone="dark">
        <LazyBelowFold load={loadWork} minHeight="320vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "320vh" }} />}>
            <WorkWall />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-founder" data-tone="dark">
        <LazyBelowFold load={loadFounder} minHeight="92vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "92vh" }} />}>
            <FounderChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-start" data-tone="dark">
        <LazyBelowFold load={loadStart} minHeight="82vh" background="transparent">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "82vh" }} />}>
            <StartChapter />
          </Suspense>
        </LazyBelowFold>
      </section>
    </div>
  );
}
