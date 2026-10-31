/**
 * The film's copy and data, verbatim from
 * `docs/reference/home-film/index.html`.
 *
 * Colours come from `src/data/serviceColors.ts` so home has one source
 * for them; the hex values are the same ones the reference inlines.
 */
import { SERVICE_COLOR } from "../../../data/serviceColors";

export type Service = {
  name: string;
  color: string;
  /** tint id in the particle shader */
  tint: number;
  line: string;
  inc: string[];
};

export const SERVICES: Service[] = [
  {
    name: "Websites",
    color: SERVICE_COLOR.websites,
    tint: 1,
    line: "Sites that look like you meant it.",
    inc: ["Brand direction", "Marketing sites", "Landing pages"],
  },
  {
    name: "Web Apps",
    color: SERVICE_COLOR.webApps,
    tint: 2,
    line: "Software built around how you work.",
    inc: ["Customer portals", "Booking & ordering", "Internal tools"],
  },
  {
    name: "AI Automation",
    color: SERVICE_COLOR.aiAutomation,
    tint: 3,
    line: "The busywork, handled.",
    inc: ["AI agents", "Integrations", "Human sign-off"],
  },
  {
    name: "Marketing",
    color: SERVICE_COLOR.marketing,
    tint: 4,
    line: "Found first. Chosen more.",
    inc: ["Local search", "Outreach", "Paid ads", "Content"],
  },
];

export type Project = {
  name: string;
  line: string;
  chips: Array<[string, string]>;
  color: string;
  tint: number;
  src: string;
  poster: string;
  /** The study's own page where one exists, otherwise the vault. */
  href: string;
};

export const PROJECTS: Project[] = [
  {
    name: "CG Walls & Floors",
    line: "A renovation site built for realtors and homeowners, with an AI agent that finds renovation-ready listings and drafts the outreach.",
    chips: [["Websites", SERVICE_COLOR.websites], ["AI Automation", SERVICE_COLOR.aiAutomation]],
    color: SERVICE_COLOR.websites,
    tint: 1,
    src: "/media/home/cg.mp4",
    poster: "/media/home/cg.jpg",
    href: "/work/cg-walls-and-floors",
  },
  {
    name: "SIFT",
    line: "One command center for a job search. It pulls roles from YC, LinkedIn, Google Jobs and Indeed, tailors the resume to each one and tracks every application.",
    chips: [["Web Apps", SERVICE_COLOR.webApps]],
    color: SERVICE_COLOR.webApps,
    tint: 2,
    src: "/media/home/sift.mp4",
    poster: "/media/home/sift.jpg",
    href: "/work/sift",
  },
  {
    name: "CadenceStack",
    line: "A content operating system for LinkedIn: ideas, pillars, templates and a publishing calendar in one place, with every post tracked.",
    chips: [["Web Apps", SERVICE_COLOR.webApps], ["Marketing", SERVICE_COLOR.marketing]],
    color: SERVICE_COLOR.marketing,
    tint: 4,
    src: "/media/home/cadence.mp4",
    poster: "/media/home/cadence.jpg",
    href: "/work/cadencestack",
  },
];

export const PARTNERS: Array<{ name: string; logo: string }> = [
  { name: "Google", logo: "/logos/partners/google.png" },
  { name: "RE/MAX", logo: "/logos/partners/remax.png" },
  { name: "Royal LePage", logo: "/logos/partners/royallepage.png" },
];

export const CLIENTS = ["CG Walls & Floors", "SIFT", "CadenceStack", "CareerClarity AI"];

export const OUTCOMES: Array<[string, string, string]> = [
  ["Websites", SERVICE_COLOR.websites, "Your new site is live"],
  ["Web Apps", SERVICE_COLOR.webApps, "New booking · Thursday, 2:30 pm"],
  ["AI Automation", SERVICE_COLOR.aiAutomation, "Lead qualified and answered"],
  ["Marketing", SERVICE_COLOR.marketing, "Top of local search"],
];
