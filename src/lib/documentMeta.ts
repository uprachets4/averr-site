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
    title: "Web Design, Web Apps, AI & Marketing Services | Averr Studios",
    description:
      "Websites, web apps, AI automation and marketing for Toronto and GTA businesses. What's included, how long each takes, and a free 30-minute call to start.",
    target: "web design services toronto",
  },
  serviceWebsites: {
    title: "Custom Website Design in Toronto | Averr Studios",
    description:
      "Custom websites for Toronto and GTA businesses, hand-built in code rather than assembled from a theme. What a build includes, who we've built for, and a free 30-minute call.",
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
      "Dashboards, internal tools and client portals for Toronto and GTA businesses, built by the person you brief. What a build includes, three tools in daily use, and a free 30-minute call.",
    target: PILLARS.webApps.target,
  },
  industryContractors: {
    title: "Contractor Website Design in Toronto | Averr Studios",
    description:
      "Websites for GTA contractors and home services: the work first, the licence early, the phone one tap away. Two trade builds — one found by homeowners, one grown through referrals — and a free 30-minute call.",
    /* From the industry registry for the same reason the pillars read
       from theirs — one copy of the keyword, in the file that owns it. */
    target: INDUSTRIES.contractors.target,
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
      "Plain-language guides to the things Toronto and GTA business owners ask us about most: Google Maps, Search Console, analytics and site speed. Free, no sign-up.",
    target: "small business guides toronto",
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
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
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

/** One case study's title and description, shared by the page and the prerender. */
export function caseMeta(p: { name: string; svc: readonly string[]; thesis: string; problem: string; sector: string }) {
  const kind = CASE_KIND[p.svc[0]] ?? "Project";
  const title = `${p.name}: ${kind} Case Study | Averr Studios`;
  const raw = `${p.name} (${p.sector}): ${p.thesis} ${p.problem} Built by Averr Studios, Toronto.`;
  const description = raw.length <= 158 ? raw : raw.slice(0, raw.lastIndexOf(" ", 157)) + "…";
  return { title, description };
}
