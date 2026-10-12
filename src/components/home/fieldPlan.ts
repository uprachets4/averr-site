import { caseStudies } from "../../data/caseStudies";

/**
 * The composition of the hero's 3D field.
 *
 * EVERY plane is a real case-study capture that already exists under
 * public/work/ with WebP derivatives. Nothing is generated, stocked or
 * placeheld, and nothing is repeated.
 *
 * The four live /services screens that used to hang here were replaced
 * by owner ruling in 24b: home must not import another page's
 * components, and taking them out lifts BuildScreens, GrowScreens and
 * AutomateScreens off home's module graph entirely. The replacements
 * are the next unused capture from each project.
 *
 * The layout is deliberate rather than scattered:
 *
 *   SAFE ZONE   the headline owns x 0–46%, y 16–74%. No plane's box may
 *               enter it at any width — measured, not eyeballed.
 *   DEPTH       an EVEN ladder from +80 to −2000, roughly 139px a rung.
 *               Clustering the planes near the camera left a stretch of
 *               the fly-through with nothing at a visible distance and
 *               the frame emptied out at 45% of the pin. Evenly spaced,
 *               something is always arriving.
 *
 * `x`/`y`/`w` are WHERE THE PLANE LANDS ON SCREEN, in percentages of the
 * frame, measured to its centre. HeroField undoes the perspective
 * foreshortening for each plane's own z, so this file reads as the
 * composition rather than as pre-projection coordinates.
 */

export type Plane = {
  id: string;
  /** Always a real capture now — see the note above. */
  kind: "shot";
  /** The JPEG path the WebP pipeline knows. */
  src: string;
  /** Which case study the plane belongs to — drives the link. */
  slug: string;
  label: string;
  x: number;
  y: number;
  w: number;
  z: number;
  /** Drift amplitude in px and period in seconds. */
  drift: [number, number];
  /** Degrees of its own yaw, so the field is not a flat deck. */
  yaw: number;
  /** Mobile keeps only the six marked. */
  mobile?: boolean;
};

const fig = function figure(slug: string) {
  return caseStudies[slug]?.headlineFigure;
};

/** The verified figure for a plane's project, or nothing. */
export function figureFor(slug?: string) {
  return slug ? fig(slug) : undefined;
}

export function clientFor(slug?: string) {
  return slug ? caseStudies[slug]?.client : undefined;
}

export const PLANES: Plane[] = [
  /* ── near: the focal pair ─────────────────────────────────────── */
  {
    id: "cg-hero",
    kind: "shot",
    src: "/work/cgwalls/hero.jpg",
    slug: "cg-walls-and-floors",
    label: "CG Walls & Floors",
    x: 82, y: 48, w: 38, z: 80,
    drift: [5, 19], yaw: -7, mobile: true,
  },
  {
    id: "sift-overview",
    kind: "shot",
    src: "/work/sift/01-command-overview.jpg",
    slug: "sift",
    label: "SIFT",
    x: 76, y: 90, w: 25, z: -59,
    drift: [4, 23], yaw: 5, mobile: true,
  },

  /* ── mid ──────────────────────────────────────────────────────── */
  {
    id: "cc-overview",
    kind: "shot",
    src: "/work/capitalcommand/01-overview.jpg",
    slug: "capitalcommand",
    label: "CapitalCommand",
    x: 90, y: 13, w: 24, z: -198,
    drift: [4, 27], yaw: -11, mobile: true,
  },
  {
    id: "cad-center",
    kind: "shot",
    src: "/work/cadencestack/01-command-center.jpg",
    slug: "cadencestack",
    label: "CadenceStack",
    x: 94, y: 34, w: 20, z: -754,
    drift: [3, 21], yaw: 8, mobile: true,
  },
  {
    id: "cg-testimonials",
    kind: "shot",
    src: "/work/cgwalls/testimonials.jpg",
    slug: "cg-walls-and-floors",
    label: "CG Walls & Floors",
    x: 64, y: 7, w: 15, z: -337,
    drift: [3, 25], yaw: -5, mobile: true,
  },
  {
    id: "sift-pipeline",
    kind: "shot",
    src: "/work/sift/04-pipeline.jpg",
    slug: "sift",
    label: "SIFT",
    x: 14, y: 95, w: 18, z: -476,
    drift: [3, 29], yaw: 10,
  },
  {
    id: "cc-ipo",
    kind: "shot",
    src: "/work/capitalcommand/04-ipo-intelligence.jpg",
    slug: "capitalcommand",
    label: "CapitalCommand",
    x: 89, y: 78, w: 16, z: -615,
    drift: [3, 18], yaw: -8, mobile: true,
  },

  /* ── far ──────────────────────────────────────────────────────── */
  {
    id: "cg-gallery",
    kind: "shot",
    src: "/work/cgwalls/gallery.jpg",
    slug: "cg-walls-and-floors",
    label: "CG Walls & Floors",
    x: 31, y: 96, w: 12, z: -893,
    drift: [2, 24], yaw: 6,
  },
  {
    id: "cc-markets",
    kind: "shot",
    src: "/work/capitalcommand/03-markets.jpg",
    slug: "capitalcommand",
    label: "CapitalCommand",
    x: 74, y: -3, w: 12, z: -1032,
    drift: [2, 30], yaw: -6,
  },
  {
    id: "sift-tailor",
    kind: "shot",
    src: "/work/sift/02-tailor-resume.jpg",
    slug: "sift",
    label: "SIFT",
    x: 70, y: 95, w: 11, z: -1310,
    drift: [2, 26], yaw: 9,
  },
  {
    id: "cad-analytics",
    kind: "shot",
    src: "/work/cadencestack/04-performance-analytics.jpg",
    slug: "cadencestack",
    label: "CadenceStack",
    x: 98, y: 49, w: 12, z: -1171,
    drift: [2, 22], yaw: -9,
  },
  {
    id: "sift-insights",
    kind: "shot",
    src: "/work/sift/08-command-insights.jpg",
    slug: "sift",
    label: "SIFT",
    x: 47, y: 7, w: 10, z: -1449,
    drift: [2, 28], yaw: 7,
  },
  {
    id: "cad-pillars",
    kind: "shot",
    src: "/work/cadencestack/02-content-pillars.jpg",
    slug: "cadencestack",
    label: "CadenceStack",
    x: 4, y: 86, w: 12, z: -1588,
    drift: [2, 20], yaw: 11,
  },
  {
    id: "cg-gallery2",
    kind: "shot",
    src: "/work/cgwalls/gallery2.jpg",
    slug: "cg-walls-and-floors",
    label: "CG Walls & Floors",
    x: 84, y: 97, w: 10, z: -1727,
    drift: [2, 31], yaw: -5,
  },
  {
    id: "cc-signal",
    kind: "shot",
    src: "/work/capitalcommand/05-signal-desk.jpg",
    slug: "capitalcommand",
    label: "CapitalCommand",
    x: 80, y: 58, w: 9, z: -1866,
    drift: [2, 23], yaw: 8,
  },
  {
    id: "cad-posts",
    kind: "shot",
    src: "/work/cadencestack/08-post-database.jpg",
    slug: "cadencestack",
    label: "CadenceStack",
    x: 63, y: 33, w: 9, z: -2000,
    drift: [2, 27], yaw: -7,
  },
];

/** The plane the fly-through lands on. */
export const LANDING_ID = "cg-hero";
