import { SCREENSHOTS } from "./screenshots";
import type { ServiceId } from "./serviceColors";

/**
 * Built by Averr — the data behind /work and /work/:slug (spec 31).
 *
 * Every string here is copied verbatim from the approved reference,
 * `docs/reference/work/index.html`, where it lives in the `P` array. The
 * reference is the spec: nothing is rewritten, lengthened or tidied, and
 * the only numbers that appear anywhere are the three measured figures
 * below.
 *
 * Two things are carried over rather than copied:
 *
 *   - Services are the repo's own `ServiceId`s, not the reference's
 *     numeric 1–4. The two agree exactly — 1 Websites, 2 Web Apps,
 *     3 AI Automation, 4 Marketing, in that order and those colours —
 *     so naming them keeps one source of colour truth instead of two.
 *   - Images are the SOURCE public path (`/work/sift/04-pipeline.jpg`),
 *     not a sized WebP. `screen()` resolves the two sizes the page needs
 *     out of `screenshots.ts`, which `tools/derive-screenshots.mjs`
 *     generates from the files themselves. The large rung is 1400 on
 *     some captures and 1680 on others, and a hand-written list of which
 *     is which is a list that drifts.
 *
 * `caseStudies.ts` is untouched and still carries the long-form Vault
 * copy that /services, /about's reel and the nav count read.
 */

export type BuiltSig = {
  title: string;
  text: string;
  /** Source path of the screen this moment zooms into. */
  image: string;
  /** Focal point, 0–1 of the frame. The zoom grows around it. */
  fx: number;
  fy: number;
};

export type BuiltStep = {
  service: ServiceId;
  /** The reference's own second label: "Websites · Design". */
  label: string;
  text: string;
  /** A verbatim phrase from `text`, underlined in the service colour. */
  emphasis: string;
  image: string;
};

export type BuiltProject = {
  slug: string;
  name: string;
  sector: string;
  /** "2025 · ongoing" — the tail doubles as the status chip. */
  year: string;
  svc: ServiceId[];
  /** The case accent. Always one of the four service colours. */
  c: string;
  /** A real recording, or `slides` for the projects without one. */
  video?: { src: string; poster: string };
  slides?: string[];
  thesis: string;
  /** A verbatim phrase from `thesis`, set in the studio gradient. */
  pill: string;
  figure?: { value: string; caption: string };
  problem: string;
  points: [string, string, string];
  approach: BuiltStep[];
  inventory: { title: string; text: string }[];
  sigs: BuiltSig[];
  gallery: { image: string; caption: string }[];
  outcome: { headline: string; body: string; emphasis: string };
  stack: string[];
  next: string[];
};

const CG = "/work/cgwalls";
const SIFT = "/work/sift";
const EX = "/work/express";
const CAD = "/work/cadencestack";
const CAP = "/work/capitalcommand";

/** Page order, and the order "next case file" walks. */
export const BUILT: BuiltProject[] = [
  {
    slug: "cg-walls-and-floors",
    name: "CG Walls & Floors",
    sector: "Home renovation, GTA",
    year: "2025 · ongoing",
    svc: ["websites", "aiAutomation", "marketing"],
    c: "#F9AF97",
    video: { src: "/media/home/cg.mp4", poster: "/media/home/cg.jpg" },
    thesis: "A realtor referral engine that runs itself.",
    pill: "referral engine",
    figure: { value: "85%", caption: "Reduction in manual outreach hours" },
    problem: "Grow a one-person renovation crew with no ad budget.",
    points: [
      "Max Francis runs drywall, paint, flooring and trim on his own.",
      "No ad budget, no headcount, no time to burn.",
      "Growth had to come from realtors, who hear from every contractor in the GTA.",
    ],
    approach: [
      {
        service: "websites",
        label: "Design",
        text: "A single-page site that opens with the work, not the company, styled like a boutique interior firm.",
        emphasis: "opens with the work, not the company",
        image: `${CG}/testimonials.jpg`,
      },
      {
        service: "aiAutomation",
        label: "Automate",
        text: "A monitor that spots listings needing pre-listing touch-ups, then drafts personalized emails per realtor, per listing.",
        emphasis: "personalized emails per realtor, per listing",
        image: `${CG}/gallery.jpg`,
      },
      {
        service: "marketing",
        label: "Grow",
        text: "A Durham door-to-door playbook: 29 neighbourhoods tier-ranked by home era and density, plus Google Business Profile.",
        emphasis: "29 neighbourhoods tier-ranked",
        image: `${CG}/gallery2.jpg`,
      },
    ],
    inventory: [
      { title: "Premium React site", text: "Animated hero, service cards, tap-to-call, trust bar." },
      { title: "Realtor lead-gen", text: "Scrapers watch listings; AI drafts the email." },
      {
        title: "Durham hotspot map",
        text: "29 neighbourhoods, target streets, routes and a 15-second script.",
      },
      {
        title: "Google Business Profile",
        text: "Set up and seeded with a real homeowner review.",
      },
      { title: "Zero-budget channels", text: "Kijiji, Facebook Groups, permit data, NextDoor." },
    ],
    sigs: [],
    gallery: [
      { image: `${CG}/hero.jpg`, caption: "The site's home page" },
      { image: `${CG}/testimonials.jpg`, caption: "Testimonials" },
      { image: `${CG}/gallery.jpg`, caption: "Project gallery" },
      { image: `${CG}/gallery2.jpg`, caption: "Gallery, continued" },
    ],
    outcome: {
      headline: "A premium presence, built for one-person growth.",
      body: "A repeatable outreach rhythm one person can run between jobs, and a site that reads three tiers up.",
      emphasis: "repeatable outreach rhythm",
    },
    stack: ["React", "Framer", "Python scrapers", "Claude API", "Google Business Profile"],
    next: [
      "Brokerage sequences for RE/MAX, Century 21 and Royal LePage",
      "Landlord and pre-listing seller flows",
      "NextDoor as a test channel",
    ],
  },

  {
    slug: "sift",
    name: "SIFT",
    sector: "SaaS, job search",
    year: "2025 · ongoing",
    svc: ["webApps", "aiAutomation"],
    c: "#D5818C",
    video: { src: "/media/home/sift.mp4", poster: "/media/home/sift.jpg" },
    thesis: "A job search built for craft, not volume.",
    pill: "craft, not volume",
    figure: {
      value: "42%",
      caption: "ATS-score improvement average after AI resume rewrite",
    },
    problem: "Job search is over-served on volume and under-served on precision.",
    points: [
      "Every new tool is auto-apply: more applications, not better ones.",
      "Listings are scattered across four to six tabs.",
      "Resumes get rewritten per job at 11pm, badly.",
    ],
    approach: [
      {
        service: "webApps",
        label: "Design",
        text: "Dark-first, with sodium amber on a four-step dark ladder. Built for people who job-hunt at night.",
        emphasis: "sodium amber",
        image: `${SIFT}/02-tailor-resume.jpg`,
      },
      {
        service: "aiAutomation",
        label: "Automate",
        text: "Daily sync from every job board, AI scoring on each posting, and a resume rewritten for every role.",
        emphasis: "a resume rewritten for every role",
        image: `${SIFT}/06-funnel.jpg`,
      },
    ],
    inventory: [
      {
        title: "Multi-tenant SaaS",
        text: "Next.js 16, Clerk, Supabase and Prisma, on Vercel with cron.",
      },
      {
        title: "Eight job sources",
        text: "YC, LinkedIn, Wellfound, Google Jobs, HN, Greenhouse, Lever, Ashby.",
      },
      { title: "AI matching", text: "Every posting scored against your resume." },
      {
        title: "Resume tailoring",
        text: "A version per job that closes the ATS keyword gap.",
      },
      { title: "Documents", text: "Cover letters, exported as DOCX and PDF." },
      {
        title: "Application pipeline",
        text: "Top Matches, Saved, Applied, Interviews.",
      },
      {
        title: "Launch surface",
        text: "Onboarding, pricing, FAQ, blog, SEO metadata.",
      },
    ],
    sigs: [
      {
        title: "Sodium amber on dark",
        text: "Warmer and more editorial than blue-on-white. Designed for how a screen feels at midnight.",
        image: `${SIFT}/05-outreach.jpg`,
        fx: 0.4,
        fy: 0.9,
      },
      {
        title: "A bug that became architecture",
        text: "A credit race double-charged on first sync. Paid sources now run in sequence, free ones in parallel.",
        image: `${SIFT}/07-sources.jpg`,
        fx: 0.52,
        fy: 0.58,
      },
      {
        title: "Craft over volume",
        text: "Not auto-apply, and never will be. Thirty focused minutes on one application beats blasting 200.",
        image: `${SIFT}/03-cover-letter.jpg`,
        fx: 0.78,
        fy: 0.19,
      },
    ],
    gallery: [
      { image: `${SIFT}/01-command-overview.jpg`, caption: "Command overview" },
      { image: `${SIFT}/08-command-insights.jpg`, caption: "Command insights" },
      { image: `${SIFT}/04-pipeline.jpg`, caption: "Application pipeline" },
      { image: `${SIFT}/02-tailor-resume.jpg`, caption: "Tailor resume" },
    ],
    outcome: {
      headline: "The engine now runs end to end.",
      body: "Source → score → tailor → apply → track, live at sifthq.app.",
      emphasis: "Source → score → tailor → apply → track",
    },
    stack: [
      "Next.js 16",
      "Clerk v7",
      "Supabase",
      "Prisma",
      "Tailwind v4",
      "shadcn/ui",
      "Anthropic API",
      "Vercel Pro",
    ],
    next: [
      "Close the AI quality gap on matching and tailoring",
      "Engagement prompts and a redesigned Settings page",
      "Pro tier with paid billing",
    ],
  },

  {
    slug: "express-contractors",
    name: "Express Contractors",
    sector: "Appliance installation, GTA",
    year: "2026 · live",
    svc: ["websites"],
    c: "#F9AF97",
    video: { src: "/media/work/express.mp4", poster: "/media/work/express.jpg" },
    thesis: "An installer's site that shows the work behind the wall.",
    pill: "the work behind the wall",
    figure: {
      value: "5.0",
      caption: "Google rating from 203 reviews, shown on the site",
    },
    problem: "The work that matters most is the work nobody sees.",
    points: [
      "Anas Elashi: licensed gas fitter, TSSA registered, 20+ years.",
      "Based in Hamilton, working across the GTA and Niagara.",
      "A good install lives behind the appliance: the line, the venting, the leak test.",
    ],
    approach: [
      {
        service: "websites",
        label: "The hero",
        text: "The hero draws an install as you scroll, ending in a correct blue flame.",
        emphasis: "a correct blue flame",
        image: `${EX}/02-hero-install.jpg`,
      },
      {
        service: "websites",
        label: "The services",
        text: "Eleven services, each with what is supplied and the one detail that matters.",
        emphasis: "the one detail that matters",
        image: `${EX}/03-service-detail.jpg`,
      },
      {
        service: "websites",
        label: "The proof",
        text: "Real job photos, the parts you never see, and 203 five-star reviews.",
        emphasis: "the parts you never see",
        image: `${EX}/06-recent-work.jpg`,
      },
      {
        service: "websites",
        label: "The booking",
        text: "A coverage map, a short booking form, and the phone one tap away.",
        emphasis: "one tap away",
        image: `${EX}/11-booking.jpg`,
      },
    ],
    inventory: [
      { title: "Scroll-drawn hero", text: "From the meter to a correct burn, in stages." },
      {
        title: "Eleven services",
        text: "Ranges, gas runs, laundry, water heaters and more.",
      },
      { title: "Recent work", text: "Full-screen job photos and the full gallery." },
      { title: "Our standard", text: "Vented outside, fed to code, supported every run." },
      {
        title: "Four steps, one visit",
        text: "Call, quote, install, test it together.",
      },
      { title: "Reviews", text: "5.0 from 203 Google reviews, with featured quotes." },
      { title: "Coverage map", text: "GTA, the Hamilton base, and Niagara." },
      { title: "Booking", text: "Appliance, town, timing, and tap-to-call." },
    ],
    sigs: [
      {
        title: "The install, drawn as you scroll.",
        text: "A gas line runs from the meter to a correct blue flame. Visitors see a proper install before reading a word.",
        image: `${EX}/02-hero-install.jpg`,
        fx: 0.8,
        fy: 0.3,
      },
      {
        title: "The parts you never see.",
        text: "Real job photos, labelled where the work is.",
        image: `${EX}/06-recent-work.jpg`,
        fx: 0.5,
        fy: 0.62,
      },
      {
        title: "203 reviews. None below five.",
        text: "The number leads; customers say the rest.",
        image: `${EX}/14-rating.jpg`,
        fx: 0.22,
        fy: 0.1,
      },
    ],
    gallery: [
      { image: `${EX}/01-home.jpg`, caption: "Home" },
      { image: `${EX}/04-kitchen.jpg`, caption: "Kitchen, start to finish" },
      { image: `${EX}/13-gas-cooktop.jpg`, caption: "Gas cooktop with griddle" },
      { image: `${EX}/05-water-heater.jpg`, caption: "Power-vented water heater" },
      { image: `${EX}/12-services.jpg`, caption: "Services" },
      { image: `${EX}/07-google-reviews.jpg`, caption: "Google reviews" },
      { image: `${EX}/09-coverage-map.jpg`, caption: "Coverage map" },
      { image: `${EX}/10-about.jpg`, caption: "About" },
    ],
    outcome: {
      headline: "Live, and built to make the phone ring.",
      body: "Live at expresscontractors.ca, leading with the work and the standard behind it.",
      emphasis: "leading with the work",
    },
    stack: [],
    next: [],
  },

  {
    slug: "cadencestack",
    name: "CadenceStack",
    sector: "SaaS, LinkedIn presence",
    year: "2025 · ongoing",
    svc: ["webApps", "aiAutomation", "marketing"],
    c: "#569AFA",
    video: { src: "/media/home/cadence.mp4", poster: "/media/home/cadence.jpg" },
    thesis: "LinkedIn presence as a managed system.",
    pill: "managed system",
    problem: "Thought leadership is a state problem before it is a writing problem.",
    points: [
      "Most LinkedIn tools solve typing, not positioning.",
      "Founders lack a system for what to say next.",
      "Without memory, automation repeats the same hook and lesson.",
    ],
    approach: [
      {
        service: "webApps",
        label: "Design",
        text: "A product system, not a prompt box: every idea's state is visible, from idea to published.",
        emphasis: "a product system, not a prompt box",
        image: `${CAD}/02-content-pillars.jpg`,
      },
      {
        service: "aiAutomation",
        label: "Automate",
        text: "Drafting behind quotas, validation and fail-closed provider handling, with Supabase holding state.",
        emphasis: "fail-closed provider handling",
        image: `${CAD}/03-content-pipeline.jpg`,
      },
      {
        service: "marketing",
        label: "Grow",
        text: "A real LinkedIn operating model: the 7S Methodology, five pillars, rotation and a learning loop.",
        emphasis: "a real LinkedIn operating model",
        image: `${CAD}/04-performance-analytics.jpg`,
      },
    ],
    inventory: [
      {
        title: "7S Methodology",
        text: "The founder's sales method, turned into editorial rules.",
      },
      { title: "Five pillars", text: "Voice, Strength, Hook, Cadence, Signal." },
      {
        title: "Content pipeline",
        text: "Idea → Drafting → Ready → Published → Repurpose.",
      },
      {
        title: "Rotation controls",
        text: "Remembers what it has said, so it doesn't repeat.",
      },
      {
        title: "Structure Guide",
        text: "Rule-based checks before AI touches the draft.",
      },
      {
        title: "Guarded AI drafting",
        text: "Quotas, retries, validation; bad output fails closed.",
      },
      {
        title: "Supabase product layer",
        text: "Posts, runs, metrics and recommendations.",
      },
      {
        title: "Staging on Vercel",
        text: "Onboarding, Presence Score, roadmap, review.",
      },
    ],
    sigs: [
      {
        title: "A voice, not a template.",
        text: "Scored prompts tuned to one voice, reused across the pipeline.",
        image: `${CAD}/05-prompt-library.jpg`,
        fx: 0.29,
        fy: 0.35,
      },
      {
        title: "Every post has a second life.",
        text: "Posts with real metrics become carousels, newsletters and scripts.",
        image: `${CAD}/06-repurpose-engine.jpg`,
        fx: 0.66,
        fy: 0.36,
      },
      {
        title: "The voice is a settings file.",
        text: "Positioning and voice live in one place; everything reads from it.",
        image: `${CAD}/07-brand-voice.jpg`,
        fx: 0.78,
        fy: 0.73,
      },
    ],
    gallery: [
      { image: `${CAD}/01-command-center.jpg`, caption: "Command center" },
      { image: `${CAD}/08-post-database.jpg`, caption: "Post database" },
      { image: `${CAD}/09-idea-bank.jpg`, caption: "Idea bank" },
      { image: `${CAD}/02-content-pillars.jpg`, caption: "Content pillars" },
    ],
    outcome: {
      headline: "The operating model is built and working.",
      body: "An idea moves from structure to published to repurposed, without reducing it to one prompt.",
      emphasis: "without reducing it to one prompt",
    },
    stack: ["TanStack Start", "Supabase", "Vercel", "OpenAI adapter", "Trigger.dev", "ClickUp"],
    next: [
      "A controlled multi-tenant beta",
      "Provider calls behind quotas and kill switches",
      "Approved LinkedIn publishing",
    ],
  },

  {
    slug: "capitalcommand",
    name: "CapitalCommand",
    sector: "Fintech, portfolio intelligence",
    year: "2026 · internal alpha",
    svc: ["webApps", "aiAutomation"],
    c: "#9874E8",
    slides: [
      `${CAP}/01-overview.jpg`,
      `${CAP}/02-portfolio.jpg`,
      `${CAP}/04-ipo-intelligence.jpg`,
      `${CAP}/08-system-health.jpg`,
      `${CAP}/05-signal-desk.jpg`,
    ],
    thesis: "A research-first investment console.",
    pill: "research-first",
    problem: "Access to data is not investment intelligence.",
    points: [
      "Investing apps pile on charts, feeds and AI summaries.",
      "They collapse research and execution into one loop.",
      "CapitalCommand puts the steps back in order.",
    ],
    approach: [
      {
        service: "webApps",
        label: "Design",
        text: "Eight surfaces, one decision environment, with data freshness and confidence always shown.",
        emphasis: "one decision environment",
        image: `${CAP}/02-portfolio.jpg`,
      },
      {
        service: "aiAutomation",
        label: "Automate",
        text: "Research jobs, IPO workflows and signals on Redis and BullMQ, with retries, dead letters and replay.",
        emphasis: "retries, dead letters and replay",
        image: `${CAP}/04-ipo-intelligence.jpg`,
      },
    ],
    inventory: [
      {
        title: "TypeScript monorepo",
        text: "Next.js web app, worker app, shared packages.",
      },
      {
        title: "Postgres data layer",
        text: "Portfolios, holdings, IPOs, signals, audit events.",
      },
      { title: "Auth and ownership", text: "Sessions, roles and resource checks." },
      {
        title: "Portfolio surfaces",
        text: "Holdings, performance, SIP/DCA, exposure.",
      },
      {
        title: "Markets and IPOs",
        text: "US and Indian listings, SEC-document parsing.",
      },
      { title: "Signal Desk", text: "Signals, provenance, thesis testing." },
      {
        title: "Risk and System Health",
        text: "Exposure, stale data, provider and worker health.",
      },
      {
        title: "BullMQ workers",
        text: "Schedules, retries, replay, recovery runbooks.",
      },
    ],
    sigs: [
      {
        title: "Research before execution",
        text: "A signal starts an investigation, not an order.",
        image: `${CAP}/05-signal-desk.jpg`,
        fx: 0.86,
        fy: 0.37,
      },
      {
        title: "Operational truth",
        text: "It shows when data is stale or a worker has failed.",
        image: `${CAP}/08-system-health.jpg`,
        fx: 0.46,
        fy: 0.29,
      },
      {
        title: "Deterministic before generative",
        text: "Risk rules stay outside the model, and AI fails closed.",
        image: `${CAP}/07-risk-center.jpg`,
        fx: 0.29,
        fy: 0.44,
      },
    ],
    gallery: [
      { image: `${CAP}/01-overview.jpg`, caption: "Overview" },
      { image: `${CAP}/03-markets.jpg`, caption: "Markets" },
      { image: `${CAP}/06-research-lab.jpg`, caption: "Research lab" },
      { image: `${CAP}/02-portfolio.jpg`, caption: "Portfolio" },
    ],
    outcome: {
      headline: "An internal build, ready for controlled beta.",
      body: "Portfolio, signals, risk and audit history, all wired and observable.",
      emphasis: "wired and observable",
    },
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "Turborepo",
      "OpenAI adapter",
    ],
    next: [
      "Licensed market data and production auth",
      "A multi-tenant beta",
      "Brokerage behind confirmations and a kill switch",
    ],
  },
];

export const BUILT_BY_SLUG: Record<string, BuiltProject> = Object.fromEntries(
  BUILT.map(function bySlug(p) {
    return [p.slug, p];
  })
);

/** Page order, so "next case file" wraps from the last back to the first. */
export function nextAfter(slug: string): BuiltProject {
  const i = BUILT.findIndex(function match(p) {
    return p.slug === slug;
  });
  return BUILT[(i + 1) % BUILT.length];
}

/** The three measured figures, in page order. The only numbers on /work. */
export const FIGURES = BUILT.filter(function hasFigure(p) {
  return !!p.figure;
});

const PAGE_WIDTH = 1280;

/**
 * The two sizes the page needs, from a screenshot's SOURCE path.
 *
 * `small` is the 1280 rung the wall, rows, device and gallery use;
 * `large` is the top rung, for the lightbox and the signature zoom. The
 * top rung is 1400 on some captures and 1680 on others, which is exactly
 * why it is read rather than written down.
 *
 * A path missing from the manifest means the derivatives have not been
 * generated — `node tools/derive-screenshots.mjs`. Rather than break the
 * page, it falls back to the source file and says so in dev.
 */
export function screen(src: string): { small: string; large: string } {
  const meta = SCREENSHOTS[src];
  if (!meta) {
    if (import.meta.env.DEV) {
      console.warn(`builtByAverr: ${src} is not in screenshots.ts — run tools/derive-screenshots.mjs`);
    }
    return { small: src, large: src };
  }
  const dir = src.slice(0, src.lastIndexOf("/"));
  const base = src.slice(src.lastIndexOf("/") + 1).replace(/\.(jpe?g|png)$/i, "");
  const at = (w: number) => `${dir}/w/${base}-${w}.webp`;
  const small = meta.widths.includes(PAGE_WIDTH)
    ? PAGE_WIDTH
    : meta.widths[meta.widths.length - 1];
  return { small: at(small), large: at(meta.widths[meta.widths.length - 1]) };
}
