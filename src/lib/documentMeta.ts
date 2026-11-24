import { useEffect } from "react";
/* Explicit .ts because `tools/keyword-map.test.ts` imports this file
   under plain Node, which cannot resolve an extensionless specifier —
   the same reason builtByAverr imports ./screenshots.ts. */
import { INDUSTRIES } from "../data/industries.ts";
import { PILLARS } from "../data/pillars.ts";

/**
 * One route's title and meta description, set on mount and put back on
 * unmount.
 *
 * Work and the case files already did this, each with its own copy of
 * the same effect; the audit asked for the rest of the routes to get
 * their own pair too, so the effect lives here once instead of six
 * times. The restore matters: these are the only two tags the SPA
 * mutates, and a route that set them without restoring would leave its
 * own description on whatever you navigated to next.
 *
 * The defaults in `index.html` are Home's, so Home passes its pair
 * explicitly rather than relying on them — otherwise Home would show
 * whatever the previous route happened to leave behind.
 */
export function useDocumentMeta(title: string, description: string) {
  useEffect(
    function titleAndDescription() {
      const prevTitle = document.title;
      document.title = title;

      const meta = document.querySelector('meta[name="description"]');
      const prevDesc = meta?.getAttribute("content") ?? null;
      meta?.setAttribute("content", description);

      return function restore() {
        document.title = prevTitle;
        if (prevDesc !== null) meta?.setAttribute("content", prevDesc);
      };
    },
    [title, description]
  );
}

/**
 * The pairs, from the spec 34 audit table. Home's also lives in
 * `index.html` as the document default; the two must stay in step.
 *
 * ── the keyword map ───────────────────────────────────────────────
 *
 * Each entry carries the ONE search it is written to win. The map
 * lives here, beside the titles, rather than in a document, because a
 * keyword map in a document is a keyword map nobody opens before
 * rewriting a title. `tools/keyword-map.test.ts` fails the build if
 * two pages claim the same search, which is the whole point of having
 * one: two pages competing for a query win neither.
 *
 * `target: null` means the page is not a search target — it is a
 * utility page (privacy), a 404, or exists for a different job. That
 * is a decision, not a gap to be filled.
 *
 * Case study targets are NOT here; each case file owns its own, in
 * `builtByAverr.ts`, next to the project it describes.
 *
 * Known close pair, deliberately left alone: home and /services both
 * read on "web design" and "Toronto". They are split by intent — home
 * is the studio, /services is what you get and how long it takes —
 * and Google generally resolves that. Indexing for the current titles
 * was only just requested, so rewriting them now would throw that
 * away to fix something not yet observed. The honest check is Search
 * Console once impressions appear: if the two pages trade places on
 * the same query, that is the signal to split them harder.
 */
export const META = {
  home: {
    title: "Averr Studios | Web Design, Apps & AI Automation in Toronto",
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
    target: "toronto web design studio",
  },
  services: {
    title: "Web Design, Web Apps, AI & Marketing | Averr Studios",
    description:
      "Websites, web apps, AI automation and marketing for Toronto and GTA businesses. What's included, how long each takes, and a free 30-minute call to start.",
    target: "web design services toronto",
  },
  serviceWebsites: {
    title: "Custom Website Design in Toronto | Averr Studios",
    description:
      "Custom websites for Toronto and GTA businesses, hand-built in code rather than assembled from a theme. What a build includes, and a free 30-minute call.",
    /* Narrower than /services, which keeps "web design services
       toronto": this is the phrase someone types when they have already
       decided against a builder.
       Read from the registry rather than typed again — the pillar owns
       the search it competes for, and two copies of a keyword are two
       things to keep in step. */
    target: PILLARS.websites.target,
  },
  serviceWebApps: {
    title: "Web App Development in Toronto | Averr Studios",
    description:
      "Dashboards, internal tools and client portals for Toronto and GTA businesses, built by the person you brief. Three tools in daily use, and a free call.",
    target: PILLARS.webApps.target,
  },
  industryContractors: {
    title: "Contractor Website Design in Toronto | Averr Studios",
    description:
      "Websites for GTA contractors and home services: the work first, the licence early, the phone one tap away. Two trade builds, and a free 30-minute call.",
    /* From the industry registry for the same reason the pillars read
       from theirs — one copy of the keyword, in the file that owns it. */
    target: INDUSTRIES.contractors.target,
  },
  toolFindable: {
    title: "Free Website Findability Check | Averr Studios",
    description:
      "Put in your website address and see what a search engine can and cannot work out about your business: structure, crawlability, mobile, trust. No email.",
    /* A tool's first job is earning links rather than ranking, but a
       page with no search of its own is a page nobody decided about.
       This is the long-tail phrasing a GTA owner actually types, and it
       collides with nothing. */
    target: "free website seo check toronto",
  },
  toolAutomationRoi: {
    title: "Free Automation Time Calculator | Averr Studios",
    description:
      "Work out what a repeated task costs your business in a year, in hours and in money. Four numbers, no email, nothing stored.",
    /* Sits beside the findability checker: a tool earns links first and
       ranks second, but a page with no search of its own is a page
       nobody decided about. Collides with nothing. */
    target: "automation roi calculator",
  },
  about: {
    title: "About Averr Studios — Toronto Web Design and AI Studio",
    description:
      "Averr Studios is a Toronto studio where you work directly with the person who builds it. How we think and work, from the first call to launch.",
    target: "toronto web designer",
  },
  contact: {
    title: "Contact Averr Studios — Book a Free 30-Minute Call",
    description:
      "Write to Averr Studios or book a free 30-minute call about your website, web app, AI automation or marketing in Toronto and the GTA. Replies within 24 hours.",
    target: "book a web design call toronto",
  },
  work: {
    title: "Website, Web App and AI Case Studies | Averr Studios",
    description:
      "Real projects built by Averr Studios in Toronto: websites, web apps, AI automation and marketing, each with the problem, the build and the result.",
    target: "web design case studies toronto",
  },
  /** The guides index. Each guide owns its own target, in `guides.ts`;
   *  this is the hub's, and it is deliberately a different kind of
   *  search from any single guide's — someone browsing rather than
   *  someone with one question. */
  guides: {
    title: "Guides for Toronto Small Businesses | Averr Studios",
    description:
      "Plain-language guides to what Toronto and GTA owners ask us about most: Google Maps, Search Console, site speed, and what to build. Free, no sign-up.",
    target: "small business guides toronto",
  },
  /** The trust page. Deliberately `target: null` — it exists to answer
   *  a question a buyer already on the site has, not to win a search.
   *  Giving it a phrase it will not rank for would take that phrase out
   *  of circulation for a page that could. */
  howWeWork: {
    title: "How We Work \u2014 Averr Studios, Toronto",
    description:
      "What a project with Averr Studios actually involves: the four stages, what we commit to, what we need from you, and what you own at the end.",
    target: null,
  },
  privacy: {
    title: "Privacy — Averr Studios",
    description: "How Averr Studios handles the information you send us, including cookies and analytics.",
    target: null,
  },
  card: {
    title: "Prachets Upadhyay, Founder of Averr Studios, Toronto",
    description:
      "Founder of Averr Studios, Toronto. Save my contact or book a 30-minute discovery call.",
    target: "prachets upadhyay",
  },
  /** The 404 takes the home description, as the table specifies. */
  notFound: {
    title: "Not found — Averr Studios",
    /* Was a copy of the home page's, which is harmless for ranking —
       this page is noindex — and wrong for anyone who lands here. */
    description:
      "That page is not here. Try the work, the services or the guides, or book a free 30-minute call and ask us directly.",
    target: null,
  },
} as const;

/** What a case study is, in the words people search with. */
const CASE_KIND: Record<string, string> = {
  websites: "Website",
  webApps: "Web App",
  aiAutomation: "AI Automation",
  marketing: "Marketing",
};

/**
 * The lengths a search result actually shows. Titles past roughly 60
 * characters are trimmed with an ellipsis; descriptions past roughly
 * 158 are cut. `tools/meta-lengths.test.ts` holds every page to these,
 * which is the only reason they stay true — ten titles and eighteen
 * descriptions had drifted over before the test existed.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 158;

/** One guide's title and description, shared by the page and the prerender. */
export function guideMeta(g: { title: string; dek: string }): { title: string; description: string } {
  const title = `${g.title} | Averr Studios`;
  const description =
    g.dek.length <= DESCRIPTION_MAX
      ? g.dek
      : g.dek.slice(0, g.dek.lastIndexOf(" ", DESCRIPTION_MAX - 1)) + "…";
  return { title, description };
}

/** One case study's title and description, shared by the page and the prerender. */
export function caseMeta(p: { name: string; svc: readonly string[]; thesis: string; problem: string; sector: string }) {
  const kind = CASE_KIND[p.svc[0]] ?? "Project";
  const title = `${p.name}: ${kind} Case Study | Averr Studios`;

  /* This used to build the whole sentence and clip whatever ran past
     the limit, which cut the credit off the end of all five case
     studies — the one clause that says whose work it is. Build the
     longest version that fits instead: drop the problem sentence
     before the credit, and clip only if even the short form is long. */
  const credit = " Built by Averr Studios, Toronto.";
  const lead = `${p.name} (${p.sector}): ${p.thesis}`;
  const full = `${lead} ${p.problem}${credit}`;
  const short = `${lead}${credit}`;
  const description =
    full.length <= DESCRIPTION_MAX
      ? full
      : short.length <= DESCRIPTION_MAX
        ? short
        : lead.slice(0, lead.lastIndexOf(" ", DESCRIPTION_MAX - credit.length - 1)) + "…" + credit;

  return { title, description };
}
