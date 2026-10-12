import { Suspense, lazy, useCallback } from "react";
import Hero from "../components/Hero";
import Chapter from "../components/Chapter";
import LazyBelowFold from "../components/LazyBelowFold";
import ChapterRail, { CHAPTERS } from "../components/home/ChapterRail";

/**
 * Home, as one journey in five chapters.
 *
 * Each chapter previews a destination and sends you there: the hero is
 * the sketch of your own business, then the real work (/work), then what
 * we do (/services), then who builds it (/about), then start (/contact).
 * The rail down the left edge is the table of contents.
 *
 * Chapters 2–5 load below the fold. The hero is the LCP surface and
 * carries nothing it does not need.
 *
 * `data-tone` is what the rail reads to flip its own contrast, so a
 * chapter that changes tone takes the rail with it.
 */

const WorkStrip = lazy(() => import("../components/home/WorkStrip"));
const ServicePanels = lazy(() => import("../components/home/ServicePanels"));
const FounderChapter = lazy(() => import("../components/home/FounderChapter"));
const StartChapter = lazy(() => import("../components/home/StartChapter"));

export default function Home() {
  const loadWork = useCallback(() => import("../components/home/WorkStrip"), []);
  const loadServices = useCallback(() => import("../components/home/ServicePanels"), []);
  const loadFounder = useCallback(() => import("../components/home/FounderChapter"), []);
  const loadStart = useCallback(() => import("../components/home/StartChapter"), []);

  return (
    <>
      <ChapterRail />

      <section id={CHAPTERS[0].id} data-tone="cream">
        <Hero />
      </section>

      {/* 2 · the work — the hero's sketch dissolves straight into this */}
      <section id={CHAPTERS[1].id} data-tone="dark">
        <LazyBelowFold load={loadWork} minHeight="420vh" background="var(--color-dark)">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "420vh", background: "var(--color-dark)" }} />}>
            <WorkStrip />
          </Suspense>
        </LazyBelowFold>
      </section>

      {/* 3 · what we do */}
      <Chapter tone="cream-alt" from="dark">
        <section id={CHAPTERS[2].id} data-tone="cream">
          <LazyBelowFold load={loadServices} minHeight="340vh" background="var(--color-bg-alt)">
            <Suspense fallback={<div aria-hidden style={{ minHeight: "340vh", background: "var(--color-bg-alt)" }} />}>
              <ServicePanels />
            </Suspense>
          </LazyBelowFold>
        </section>
      </Chapter>

      {/* 4 · who builds it */}
      <section id={CHAPTERS[3].id} data-tone="cream">
        <LazyBelowFold load={loadFounder} minHeight="92vh" background="var(--color-bg)">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "92vh", background: "var(--color-bg)" }} />}>
            <FounderChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      {/* 5 · start */}
      <section id={CHAPTERS[4].id} data-tone="cream">
        <LazyBelowFold load={loadStart} minHeight="82vh" background="var(--color-bg)">
          <Suspense fallback={<div aria-hidden style={{ minHeight: "82vh", background: "var(--color-bg)" }} />}>
            <StartChapter />
          </Suspense>
        </LazyBelowFold>
      </section>
    </>
  );
}
