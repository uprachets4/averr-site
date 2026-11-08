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
    title: "Averr Studios — Websites, Web Apps, AI Automation and Marketing",
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
  },
  services: {
    title: "Services — Averr Studios",
    description:
      "Websites, Web Apps, AI Automation and Marketing, built around your business. Watch all four come together, then book a call.",
  },
  about: {
    title: "About — Averr Studios",
    description:
      "You work directly with the person who builds it. How Averr thinks and works, from the first call to launch.",
  },
  contact: {
    title: "Contact — Averr Studios",
    description:
      "Write to the person who builds it, or book a 30-minute call. Replies within 24 hours.",
  },
  work: {
    title: "Built by Averr — Averr Studios",
    description:
      "Every screen is a real product we built: websites, web apps, AI automation and marketing for businesses across the GTA.",
  },
  /** The 404 takes the home description, as the table specifies. */
  notFound: {
    title: "Not found — Averr Studios",
    description:
      "A Toronto studio building websites, web apps, AI automation and marketing for businesses across the GTA. You work directly with the person who builds it.",
  },
} as const;
