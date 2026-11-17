import { PILLAR_SERVICES, PILLAR_TIMELINE } from "./servicePillars";
import { PROCESS, type ProcessStep } from "./aboutProcess";
import { BUILT, type BuiltProject } from "./builtByAverr";
import { SERVICE_COLOR } from "./serviceColors";

/**
 * /services/websites — the Websites service page.
 *
 * One page, one search: "web design Toronto". The keyword map gives this
 * page that search and no other, so it cannot compete with /services
 * (which targets all four services together) or with a case file.
 *
 * Nothing here is a new claim. Every offer, timing and proof point is
 * read from the data the site already ships:
 *
 *   - what's included → `PILLAR_SERVICES.design`, the Design pillar's own
 *     five records, which /services and home already print;
 *   - the timeline → `PILLAR_TIMELINE.design`, composed into sentences
 *     rather than typed, the way `aboutProcess.BUILD_WINDOW` does it, so
 *     the page cannot state a week count the rest of the site disagrees
 *     with;
 *   - how the build runs → `PROCESS`, the five steps /about prints;
 *   - proof → the case files whose own `svc` array says Websites was
 *     delivered, filtered rather than listed, so a renamed or removed
 *     project cannot leave a dead card behind.
 *
 * The questions are this page's own, and deliberately do not repeat the
 * six in `servicesBuild.FAQ`: two pages answering the same question in
 * FAQPage schema compete for one rich result instead of winning two.
 */

/** The one search this page is written for. */
export const WEBSITES_TARGET = "web design Toronto";

/** "2 – 3 weeks", from the one place that owns it. */
export const WEBSITES_TIMELINE = PILLAR_TIMELINE.design;

/** The same timeline inside a sentence: "2 – 3 week". */
const WINDOW = WEBSITES_TIMELINE.replace(/s$/, "");

/** The Websites accent. One service, one colour (serviceColors rules). */
export const WEBSITES_ACCENT = SERVICE_COLOR.websites;

/** What a website build includes — the Design pillar's own records. */
export const WEBSITES_INCLUDED = PILLAR_SERVICES.design;

/** The five steps, as /about states them. */
export const WEBSITES_PROCESS: ProcessStep[] = PROCESS;

/** The case files that say, in their own data, that Websites shipped. */
export const WEBSITES_PROOF: BuiltProject[] = BUILT.filter(function delivered(p) {
  return p.svc.includes("websites");
});

/* ── the hero ─────────────────────────────────────────────────────── */

export const WEBSITES_HERO = {
  eyebrow: "Websites · Toronto",
  /** Carries the page's search, and the home page's locked phrase. */
  head: "Web design in Toronto for businesses that want to be",
  headEmphasis: "Taken Seriously.",
  sub: `A custom site, designed and built by the person you talk to. Direction, design, build, and 30 days of adjustment after launch — in ${WEBSITES_TIMELINE}.`,
} as const;

/* ── the questions ────────────────────────────────────────────────── */

export const WEBSITES_FAQ: { q: string; a: string }[] = [
  {
    q: "What does a website build include?",
    a: `Design direction before anything is drawn, the site itself, and the work after launch: a palette and type that are yours, a custom build of up to 15 pages, and 30 days of monitoring and adjustment once you are live. A website takes ${WEBSITES_TIMELINE}.`,
  },
  {
    q: "Do you build on WordPress, Wix or Squarespace?",
    a: "No. Every site is hand-built in code, with real motion and a layout made for every screen. Nothing is dropped in from a theme, so nothing has to be worked around later.",
  },
  {
    q: "How many pages do I get?",
    a: "Up to 15 pages in a standard build, and the page count is settled on the discovery call rather than guessed at. Most businesses need fewer pages that each do more.",
  },
  {
    q: "Will it work properly on phones?",
    a: "Phones come first, not last. Every page is checked at phone, tablet and desktop sizes, and the polish pass goes through contrast, keyboards and reduced motion one by one before launch.",
  },
  {
    q: "Will Google be able to find it?",
    a: "Yes. Every page ships its own text, headings, title, description and structured data before any script runs, with a sitemap and a canonical address, so search engines and AI assistants read the real page rather than an empty shell.",
  },
  {
    q: "Can you rebuild a site I already have?",
    a: `Yes, and you keep what works: your domain, your email, your photos and any copy worth keeping. Redirects from your old pages are part of the build, so the rankings you already have move with you. Rebuilds run on the same ${WINDOW} timeline.`,
  },
];
