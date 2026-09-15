export type Pillar = "Design" | "Automate" | "Grow";

export type CaseStudy = {
  slug: string;
  client: string;
  status: "live" | "draft";
  pillars: Pillar[];
  sector: string;
  year: string;
  hero: {
    eyebrow: string;
    thesis: string;
    thesisPill: string;
    kicker: string;
  };
  context: string[];
  approach: { pillar: Pillar; body: string }[];
  inventory: string[];
  signatures: { title: string; body: string }[];
  outcome: string;
  stack: string[];
  next: string;
};

const draft = (
  slug: string,
  client: string,
  pillars: Pillar[],
  sector: string
): CaseStudy => ({
  slug,
  client,
  status: "draft",
  pillars,
  sector,
  year: "",
  hero: { eyebrow: "", thesis: "", thesisPill: "", kicker: "" },
  context: [],
  approach: [],
  inventory: [],
  signatures: [],
  outcome: "",
  stack: [],
  next: "",
});

export const caseStudies: Record<string, CaseStudy> = {
  "cg-walls-and-floors": {
    slug: "cg-walls-and-floors",
    client: "CG Walls & Floors",
    status: "live",
    pillars: ["Design", "Automate", "Grow"],
    sector: "Home renovation, GTA",
    year: "2025 — ongoing",
    hero: {
      eyebrow: "//_CASE_STUDY",
      thesis:
        "A one-man renovation crew, a zero-budget mandate, and a realtor referral engine that runs itself.",
      thesisPill: "referral engine",
      kicker:
        "Turning a solo operator into a market presence that punches three brokerages above its weight.",
    },
    context: [
      "CG Walls & Floors is Max Francis's renovation business — drywall, paint, flooring, framing, trim, and door-and-window install. Ontario-registered, fully insured, one person in the truck.",
      "The mandate was blunt: no ad budget, no headcount, no time to burn. Growth had to come from realtor referrals — the single highest-leverage channel in the trade, where one relationship compounds into ten jobs a year. But realtors get pitched by every contractor in the GTA. The work was to make CG feel like the obvious call.",
    ],
    approach: [
      {
        pillar: "Design",
        body: "A single-page site that opens with the work, not the company. Cormorant Garamond display, copper accent — deliberately positioned to read like a boutique interior firm, not a Kijiji handyman.",
      },
      {
        pillar: "Automate",
        body: "A realtor activity monitor that surfaces which properties are about to hit market and need pre-listing touch-ups, plus an outreach system that drafts personalized emails per realtor, per listing.",
      },
      {
        pillar: "Grow",
        body: 'A Durham Region door-to-door playbook covering 29 neighbourhoods tier-ranked by home era and density, Google Business Profile optimization, and a single repeatable "free estimate" CTA baked into every touchpoint.',
      },
    ],
    inventory: [
      "Premium React site: animated hero, interactive service cards, tap-to-call CTAs wired to Max's number, Ontario-registered and fully-insured trust bar",
      "Realtor lead-gen infrastructure: scrapers that watch posting activity, AI email generator that references the specific listing",
      "Durham Region hotspot map: 29 neighbourhoods across Ajax, Pickering, Whitby, Oshawa, and Clarington — target streets, home-era data, tier rankings, tailored pitches, route planning, and a 15-second script playbook (Brock, Uxbridge, and Scugog flagged as skip zones)",
      "Google Business Profile seeded with an authentic Brampton homeowner review (basement flooring + paint, on-time delivery, transparent pricing)",
      "Zero-budget channel stack: Kijiji monitoring, Facebook Groups, building-permit data, NextDoor",
    ],
    signatures: [
      {
        title: "Copper on cream",
        body: "A deliberate departure from the trades-industry default of black and hazard yellow. Cost nothing; changed how the business reads at a glance.",
      },
      {
        title: '"Free estimate" as the only CTA',
        body: "One commitment, everywhere, in the same voice. No secondary asks fighting for attention.",
      },
      {
        title:
          "The map isn't a marketing asset — it's an operations tool",
        body: "Built for the driver behind the wheel, not the visitor scrolling a homepage.",
      },
    ],
    outcome:
      "The business now has a repeatable outreach rhythm one person can run between jobs, a website that reads at the same level as the firms three tiers up, and a referral infrastructure aimed at the highest-leverage segment in the trade. Realtor outreach that used to be ad-hoc is now templated, targeted, and personalized at scale — without a headcount to run it.",
    stack: [
      "React",
      "Framer",
      "Python scrapers",
      "Claude API",
      "Google Business Profile",
    ],
    next: "Brokerage-specific sequences across RE/MAX, Century 21, and Royal LePage. Landlord and pre-listing-seller flows. NextDoor as a warm-neighbourhood test channel.",
  },
  "careerclarity-ai": draft(
    "careerclarity-ai",
    "CareerClarity AI",
    ["Automate"],
    "AI for education"
  ),
  sift: {
    slug: "sift",
    client: "SIFT",
    status: "live",
    pillars: ["Design", "Automate"],
    sector: "SaaS — job search",
    year: "2025 — ongoing",
    hero: {
      eyebrow: "//_CASE_STUDY",
      thesis:
        "Every job board watched, every resume tailored, every application tracked — in one place, built for craft, not volume.",
      thesisPill: "craft, not volume",
      kicker:
        "Building the tool job-seekers wish existed — the one that treats every application as a portfolio shot, not a lottery ticket.",
    },
    context: [
      "The job-search market is over-served on volume and under-served on precision. Every product built in the last two years is some flavor of auto-apply — mass-blast tools optimizing for applications submitted per hour. But every job-seeker who's been on the market knows the truth: volume doesn't get you interviews, fit does. Two hundred templated applications produce the same interview rate as twenty mediocre ones. The market is loud about the wrong metric.",
      "The other half of the problem is fragmentation. YC's job board lives at ycombinator.com/jobs. LinkedIn's ATS scoring is a paid feature buried three levels deep. Google Jobs surfaces listings but doesn't score them. Wellfound is startup-only. Every serious job-seeker keeps four to six tabs open, tracks applications in a Notion doc, and rewrites their resume per job at 11pm after their day job — badly.",
      "SIFT bets the market wants craft, not volume — and that the winning product will do the manual work well, not do more of it fast.",
    ],
    approach: [
      {
        pillar: "Design",
        body: "Dark-first UI, sodium amber (#F2A93C) as the primary accent, Instrument Serif in the display, Geist for the interface, Geist Mono where numbers or identifiers appear. Deliberate departure from the blue-and-white productivity-SaaS default. shadcn/ui as primitive scaffolding, not as identity — every card, table, and modal styled to SIFT's own system. Dark-first was a call about the actual user: job-seekers work on this at night, on their own time.",
      },
      {
        pillar: "Automate",
        body: "The entire product is automation. Cron-driven daily sync across every connected job source. AI scoring on each new posting against the user's confirmed resume, running post-response via Vercel's after() API so the UI never waits. AI resume rewriting per job to close the ATS keyword gap. AI cover letter generation. The user's job is to review, not to grind.",
      },
    ],
    inventory: [
      "Multi-tenant SaaS on Next.js 16, Clerk v7 auth, Supabase Postgres via Prisma, deployed on Vercel Pro with cron, Sentry scaffolding, Vercel Analytics, Speed Insights, usage tracking, and cap thresholds",
      "Job source aggregation across YC, LinkedIn, Wellfound, Google Jobs, Hacker News, Greenhouse, Lever, and Ashby — free sources auto-connect, paid sources gated behind credits, cron-driven daily sync plus manual refresh with 15-minute server-side cooldown",
      "AI matching engine that scores every new posting against the user's confirmed resume signals, decoupled from the request/response cycle so scoring happens post-response",
      "Resume tailoring: AI rewrites the resume per specific job to close the ATS keyword gap, with a master resume holding confirmed structured fields and per-job tailored versions saved as drafts",
      "Documents system: cover letter generator, ExportedDocument schema with export logging, aggregation page across every generated document, DOCX and PDF as fully separate generators",
      "Application pipeline: Top Matches, Saved, Applied, Interviews — all with server-side filter, sort, search, and pagination via a real /api/jobs endpoint",
      "Marketing and launch surface: onboarding, /pricing, /about, /faq, three-post blog, favicon, robots.txt, sitemap, full OpenGraph and Twitter metadata",
    ],
    signatures: [
      {
        title: "Sodium amber on dark",
        body: "#F2A93C on a four-step dark surface ladder. The productivity-SaaS default is either blue-on-white or clinical-white minimalism. Sodium amber is warmer, more editorial — reads as a tool built by someone who cares about how a screen feels at midnight, not just what it does at noon.",
      },
      {
        title: "The sync engine's concurrency model",
        body: "Paid job sources run sequentially — because a credit race condition, where two concurrent fetches both passed the credit check before either incremented usage, was silently double-charging on first sync. Free sources run parallelized at concurrency 4. The fix came from a bug and became architecture.",
      },
      {
        title: "Craft over volume as a positioning bet",
        body: "SIFT explicitly isn't an auto-apply product, and won't be. It's built for the job-seeker willing to spend 30 focused minutes on one application instead of blasting 200. The pricing, the copy, the entire UX assumes the user is treating their job search as a portfolio of shots, not a lottery of tickets.",
      },
    ],
    outcome:
      "The engine runs end-to-end. Source → score → tailor → apply → track works, live in production at sifthq.app. The plumbing is stable: cron fires on schedule, sync respects cooldowns, AI scoring runs decoupled, documents export cleanly, pipeline pages filter and paginate against real server-side queries. What's left is quality, not architecture — the current beta blocker is AI output across matching, tailoring, and cover-letter generation, all queued for another pass before public launch. The stack was built to hold weight; now the weight has to earn the stack.",
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
    next: "Weeks 4–12 of the 16-week launch plan: closing the AI quality gap on matching, tailoring, and cover letters. Adding visual interactivity and user engagement prompts. Redesigning the Settings/Outreach page. Weeks 13–16: Pro tier launch — quota tracking rebuilt for scale, paid billing infrastructure, and a redesigned paid-source credit model.",
  },
  cadencestack: draft(
    "cadencestack",
    "CadenceStack",
    ["Design", "Grow"],
    "SaaS — LinkedIn growth"
  ),
};
