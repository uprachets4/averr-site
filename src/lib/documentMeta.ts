import { useEffect } from "react";

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
 */
export const META = {
  home: {
    title: "Averr Studios | Web Design, Apps & AI Automation in Toronto",
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
  },
  services: {
    title: "Web Design, Web Apps, AI & Marketing Services | Averr Studios",
    description:
      "Websites, web apps, AI automation and marketing for Toronto and GTA businesses. What's included, how long each takes, and a free 30-minute call to start.",
  },
  about: {
    title: "About Averr Studios — Toronto Web Design and AI Studio",
    description:
      "Averr Studios is a Toronto studio where you work directly with the person who builds it. How we think and work, from the first call to launch.",
  },
  contact: {
    title: "Contact Averr Studios — Book a Free 30-Minute Call",
    description:
      "Write to Averr Studios or book a free 30-minute call about your website, web app, AI automation or marketing in Toronto and the GTA. Replies within 24 hours.",
  },
  work: {
    title: "Website, Web App and AI Case Studies | Averr Studios",
    description:
      "Real projects built by Averr Studios in Toronto: websites, web apps, AI automation and marketing, each with the problem, the build and the result.",
  },
  privacy: {
    title: "Privacy — Averr Studios",
    description: "How Averr Studios handles the information you send us, including cookies and analytics.",
  },
  card: {
    title: "Prachets Upadhyay, Founder of Averr Studios, Toronto",
    description:
      "Founder of Averr Studios, Toronto. Save my contact or book a 30-minute discovery call.",
  },
  /** The 404 takes the home description, as the table specifies. */
  notFound: {
    title: "Not found — Averr Studios",
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
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
