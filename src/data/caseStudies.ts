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
  heroImage?: string;
  context: string[];
  approach: { pillar: Pillar; body: string }[];
  inventory: string[];
  signatures: { title: string; body: string }[];
  signatureImage?: string;
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
  capitalcommand: {
    slug: "capitalcommand",
    client: "CapitalCommand",
    status: "live",
    pillars: ["Design", "Automate"],
    sector: "Fintech — portfolio intelligence",
    year: "2026 — internal alpha",
    hero: {
      eyebrow: "//_CASE_STUDY",
      thesis:
        "A research-first investment console that brings portfolios, markets, IPOs, signals, risk, and system health into one place — without pretending analysis and execution are the same thing.",
      thesisPill: "research-first",
      kicker:
        "Putting the steps back in order: start with the portfolio, inspect the signal, test the thesis, check the risk, verify the data — then, and only then, consider execution.",
    },
    heroImage: "/work/capitalcommand/01-overview.jpg",
    context: [
      "Most investing products confuse access to data with investment intelligence. They add charts, news feeds, screeners, alerts, and AI summaries until the interface looks sophisticated, but the investor is still responsible for connecting everything into a decision.",
      "The second mistake is collapsing research and execution into one loop. A signal appears, confidence gets implied, and the interface pushes the user toward a trade before the thesis, exposure, data freshness, and downside have been examined.",
      "CapitalCommand exists to put those steps back in order. Start with the portfolio. Establish the market context. Inspect the signal. Test the thesis. Check the risk. Verify the underlying data. Execution comes later, behind explicit controls — not disguised as a convenient button.",
    ],
    approach: [
      {
        pillar: "Design",
        body: "CapitalCommand demonstrates product UI and systems design across a dense financial application. The interface covers Overview, Markets, Portfolio, IPO Intelligence, Signal Desk, Research Lab, Risk Center, and System Health without reducing each area to a disconnected dashboard. Information hierarchy, confidence states, source freshness, exposure, and system status are treated as parts of the same decision environment.",
      },
      {
        pillar: "Automate",
        body: "Scheduled research jobs, IPO refresh and classification workflows, signal processing, portfolio calculations, alerts, notification records, audit logging, and health monitoring. Redis and BullMQ handle durable jobs, retries, leases, dead letters, and replay. A server-side OpenAI adapter exists behind feature flags and strict output validation, but AI and external provider calls remain disabled by default.",
      },
    ],
    inventory: [
      "TypeScript monorepo managed with pnpm and Turborepo — separate Next.js web application, worker application, and shared packages for the database, audit logging, observability, and common domain logic",
      "Prisma and PostgreSQL data layer covering users, sessions, workspaces, memberships, portfolios, transactions, holdings, IPO records, options research, signals, alerts, notifications, provider status, scheduled jobs, and audit events",
      "Database-backed authentication context with server-side sessions, workspace membership and role checks, resource ownership enforcement, protected routes, security headers, and a production guard preventing test auth from being enabled accidentally — production OAuth or password identity provider not yet connected",
      "Portfolio and command surfaces for the overall account view, portfolios, transactions, holdings, performance, SIP/DCA modelling, and exposure analysis — current workflows run against deterministic seeded data rather than brokerage accounts",
      "Markets and IPO research covering US and Indian listings — separate IPO routes, refresh and scoring jobs, watch workflows, SEC-document parsing and classification logic, market-regime context, and data-quality states; current provider layer is mock-backed",
      "Signal Desk and Research Lab for collecting signals, inspecting confidence and provenance, opening a research workspace, testing a thesis, and separating a research observation from an executable action — Discord signal models and ingestion jobs exist, real Discord ingestion still disabled",
      "Risk Center and System Health covering portfolio exposure, stale-data detection, provider status, readiness, worker health, structured logs, request and correlation IDs, internal metrics, alert rules, degraded-state reporting, and a protected metrics route",
      "Redis-backed BullMQ worker system with schedules, retries, leases, persistent job metadata, dead-letter handling, replay, graceful shutdown, and jobs for portfolio research, IPO monitoring, options paper workflows, signals, alerts, and notifications — Docker packaging, GitHub Actions validation, backup and restore guardrails, and recovery runbooks in place",
    ],
    signatures: [
      {
        title: "Research before execution",
        body: "CapitalCommand treats a signal as the beginning of an investigation, not permission to place an order. The product forces the path through thesis, provenance, portfolio exposure, and risk before brokerage access is even considered.",
      },
      {
        title: "Operational truth is part of the interface",
        body: "Most investment dashboards display a number without telling you whether the provider is delayed, the worker failed, or the data is stale. CapitalCommand exposes provider status, data quality, job health, readiness, and audit history — because unreliable infrastructure produces unreliable investment decisions.",
      },
      {
        title: "Deterministic before generative",
        body: "Portfolio calculations, risk rules, job state, ownership checks, and safety controls stay outside the model. AI is restricted to bounded research assistance with schema-validated output, sanitized telemetry, feature flags, and fail-closed behaviour. A fluent answer does not get to override system state.",
      },
    ],
    signatureImage: "/work/capitalcommand/05-signal-desk.jpg",
    outcome:
      "CapitalCommand currently works as an internal, research-first engineering build using deterministic seeded and mock-backed data. A user can move through portfolio state, market context, IPO research, signals, thesis work, exposure checks, system status, and audit history. The database, authenticated ownership model, durable worker layer, safety flags, observability, and recovery controls have all been built and tested. It is not a live brokerage product — no licensed live-market provider, no production identity provider, no real notification delivery, no connected brokerage account, no order execution. The architecture has been hardened through local and CI validation, but staging recovery checks and production deployment still need to be completed. What's been proven is the product model and the research loop. What remains unproven is whether that loop becomes valuable enough for external users to return to regularly.",
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
    next: "The next three-to-six months turn the internal build into a controlled multi-tenant beta: connecting a licensed market-data provider, replacing deterministic identity with production authentication, completing tenant-isolation and browser-level security testing, activating notification delivery, finishing staging backup-and-restore validation, and instrumenting the full research loop. A small beta will test portfolio import, US and Indian IPO tracking, signals, thesis workflows, and risk monitoring before execution is introduced. Brokerage connectivity belongs behind order previews, human confirmation, stale-quote checks, position and loss limits, reconciliation, and a kill switch. Before offering personalized recommendations or order routing, the product also needs legal review of where research software becomes regulated advice or dealer activity under CIRO and OSC requirements in Canada and SEC/FINRA requirements in the United States.",
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
  cadencestack: {
    slug: "cadencestack",
    client: "CadenceStack",
    status: "live",
    pillars: ["Design", "Automate", "Grow"],
    sector: "SaaS — LinkedIn presence",
    year: "2025 — ongoing",
    hero: {
      eyebrow: "//_CASE_STUDY",
      thesis:
        "LinkedIn stops being a blank-page obligation and starts being a managed system — deciding what to say, drafting it in your voice, moving it through review, and learning from what happens after publication.",
      thesisPill: "managed system",
      kicker:
        "Turning founder thought leadership into an editorial pipeline that remembers what it's already said — instead of a text generator with a calendar attached.",
    },
    context: [
      "Most LinkedIn tools treat the problem as content production. Give the model a topic, generate five posts, schedule them, repeat. That solves typing. It does not solve positioning.",
      "Founders rarely lack ideas. They lack a system for deciding which ideas support their reputation, which angle has already been exhausted, what evidence makes a post credible, and what should come next. Without that memory, automation produces competent-looking repetition: the same hook, the same lesson, the same vague CTA.",
      "CadenceStack exists because thought leadership is a state-management problem before it is a writing problem. The system has to understand the operator, preserve editorial decisions, rotate ideas deliberately, and connect published work back to future recommendations. Otherwise it's just another text generator with a calendar attached.",
    ],
    approach: [
      {
        pillar: "Design",
        body: "CadenceStack required a product system, not a prompt box. The interface makes editorial state visible: what is only an idea, what needs work, what is ready, what has been published, and what the system recommends next. The composer, Structure Guide, review states, Presence Score, personalized roadmap, onboarding, performance views, and founder controls all sit as first-class product surfaces — not settings buried in a sidebar.",
      },
      {
        pillar: "Automate",
        body: "The drafting path sits behind server-side gates, authentication, quotas, validation, timeouts, telemetry, and fail-closed provider handling. Supabase holds the persistent product state. The productized path is provider-neutral, with a direct OpenAI adapter live in the application and Claude used in the earlier operator-side research workflow. Trigger.dev and ClickUp move operator work through research, drafting, visual production, and completion.",
      },
      {
        pillar: "Grow",
        body: "CadenceStack encodes an actual LinkedIn operating model — the 7S Methodology, five editorial pillars, hook patterns, content rotation, publishing states, and a performance-learning loop. The objective is not to publish more often at any cost. It is to build a recognizable body of work without repeating the same point until it becomes wallpaper.",
      },
    ],
    inventory: [
      "The 7S Methodology as system logic — the founder's seven-part sales methodology translated from informal thinking into repeatable editorial rules that shape how an idea is structured, challenged, developed, and prepared for publication",
      "A five-pillar model: Voice, Strength, Hook, Cadence, and Signal — Voice and Strength inform the post score; score and Cadence shape the recommendation; recommendation and Signal inform the publish decision",
      "A stateful content pipeline with defined stages: Idea → Drafting → Needs Visual → Ready → Scheduled → Published → Repurpose — each record carrying pillar, hook, body, CTA, first comment, hashtags, audience, proof source, visual concept, schedule, publication link, and performance data",
      "Rotation and repetition controls: the next recommendation is evaluated against active pillar, recent subjects, hook usage, current pipeline inventory, and previously published material — the system remembers what it has already said instead of generating each post as an isolated request",
      "A deterministic Structure Guide that runs before AI touches the draft — browser-local rules inspect seven inputs (pillar, title, hook, body, CTA, first comment, hashtags) to identify what is structurally weak without rewriting the post or pretending to predict performance",
      "A guarded AI drafting core: the server-side generation path handles authentication, generation gates, quota reservation, retries, timeout control, sanitized telemetry, persistence, and strict output validation — malformed, truncated, refused, or unexpected provider output fails closed rather than leaking into the editor",
      "A persistent product layer in Supabase holding authentication, post records, AI runs, generated outputs, pillars, prompts, visuals, metrics, onboarding state, and recommendation state — service-level credentials stay server-side, user boundaries tested rather than assumed",
      "A staging product on Vercel with interactive onboarding, deterministic Presence Score, diagnosis, personalized strategy roadmap, first-post handoff, adaptive recommendations, review controls, and controlled-beta foundations",
    ],
    signatures: [
      {
        title: "Deterministic before generative",
        body: "The Structure Guide runs before the AI assistant and stays separate from it. That's deliberate. A model can produce fluent copy while missing a weak hook, absent proof, confused CTA, or incomplete first comment. CadenceStack checks the structure first, then decides whether generation is useful.",
      },
      {
        title: "The system remembers the last post",
        body: "Most content generators behave as if every prompt is the first conversation. CadenceStack keeps the pillar, hook, proof source, workflow state, publishing history, and recommendation state attached to the content. That memory is what makes deliberate rotation and adaptive recommendations possible.",
      },
      {
        title: "Presence before production",
        body: 'The product doesn\'t begin by asking, "what should the AI write?" It begins with onboarding, user intelligence, a Presence Score, diagnosis, and a roadmap. The bet is simple: a founder should know what reputation they are building before automating the posts meant to build it.',
      },
    ],
    outcome:
      "CadenceStack is beyond a concept and short of a public SaaS product. The editorial model, product interface, persistent workflow, deterministic guidance, guarded generation architecture, onboarding, scoring, roadmap, and adaptive recommendation work all exist across the main application and staging environment. The internal process can take an idea through structure, drafting, review, visual planning, approval, publication tracking, and repurposing without reducing the work to a single prompt. What has been proven is the operating model and the usefulness of persistent editorial state. What has not been proven is repeatable performance across a broad customer base — CadenceStack is still being run primarily against the founder's own presence, with controlled-beta infrastructure under construction. Production AI activation, unrestricted LinkedIn publishing, multi-tenant usage at scale, and commercial retention are not claims the product can make yet.",
    stack: [
      "TanStack Start",
      "Supabase",
      "Vercel",
      "OpenAI adapter",
      "Trigger.dev",
      "ClickUp",
    ],
    next: "The next three-to-six months turn a founder-operated system into a controlled multi-tenant product. Clearing the remaining protected-boundary checks, isolating staging and production configuration, completing tenant-safe data access, activating provider calls behind quotas and kill switches, finalizing consent and privacy controls, and connecting approved LinkedIn publishing where platform access permits it. A small allowlisted beta comes before open launch — testing onboarding completion, Presence Score usefulness, recommendation quality, review behaviour, publishing reliability, provider cost, and whether performance data actually improves the next decision. If that loop doesn't get smarter with use, the product is still only an organized writing tool.",
  },
};
