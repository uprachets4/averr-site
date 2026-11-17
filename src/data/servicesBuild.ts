import { PILLAR_TIMELINE } from "./servicePillars";
import { SERVICE_COLOR, SERVICE_NAMES, type ServiceId } from "./serviceColors";

/**
 * The four-service build — the data behind /services (spec 32).
 *
 * Every string is copied verbatim from the approved reference,
 * `docs/reference/services/index.html`, where it lives in `SV`, `TR`,
 * `B`, `QUAD`, `ILL` and `FAQ`.
 *
 * Three things are read rather than copied:
 *
 *   - Service names and colours come from `serviceColors.ts`. The
 *     reference writes the four hexes inline; repeating them here would
 *     be a second place for them to drift.
 *   - Three of the four timelines come from `PILLAR_TIMELINE`, which is
 *     where "2 – 3 weeks", "1 – 2 weeks" and "Ongoing" already live.
 *     Web Apps has no pillar, so "Scoped on the call" is new and local.
 *   - Proof chips carry a real case-file slug, so a chip cannot point
 *     at a project that no longer exists.
 *
 * The refusals came here from `servicesProcess.ts` with their verbatim
 * check intact; that module went with `NoList` in step 3.
 */

/* ── the four services ─────────────────────────────────────────────── */

export type ServiceCard = {
  id: ServiceId;
  /** The visible name, from SERVICE_NAMES. */
  name: string;
  color: string;
  time: string;
  line: string;
};

const SERVICE_SOURCE: { id: ServiceId; time: string; line: string }[] = [
  { id: "websites", time: PILLAR_TIMELINE.design, line: "Brand, site, bookings" },
  { id: "webApps", time: "Scoped on the call", line: "Dashboards, portals, systems" },
  { id: "aiAutomation", time: PILLAR_TIMELINE.automate, line: "Audit, agents, review" },
  { id: "marketing", time: PILLAR_TIMELINE.grow, line: "Search, campaigns, reporting" },
];

export const SERVICES: ServiceCard[] = SERVICE_SOURCE.map(function fill(s) {
  return { ...s, name: SERVICE_NAMES[s.id], color: SERVICE_COLOR[s.id] };
});

export const SERVICE_INDEX: Record<ServiceId, number> = {
  websites: 0,
  webApps: 1,
  aiAutomation: 2,
  marketing: 3,
};

/* ── the five trades ───────────────────────────────────────────────── */

export type TradeId = "reno" | "dental" | "food" | "law" | "fit";

export type Trade = {
  label: string;
  name: string;
  area: string;
  head: string;
  sub: string;
  cta: string;
  toast: string;
  /** The three service tabs on the mock site. */
  s: [string, string, string];
  /** What the dashboard counts. */
  entity: string;
  /** The three dashboard figures. */
  k: [string, string, string];
  /** Dashboard rows: [what, where, early status, settled status]. */
  rows: [string, string, string, string][];
  msg: string;
  draft: string;
  /** Appended to the draft when the agent has finished thinking. */
  ins: string;
  crm: string;
  cal: string;
  query: string;
  tasks: string[];
  cust: string;
  proj: string;
  /** The customer portal's timeline. */
  pst: string[];
  aud: string;
  kind: string;
};

export const TRADES: Record<TradeId, Trade> = {
  reno: {
    label: "Renovation",
    name: "Northside Renovations",
    area: "Durham Region",
    head: "Kitchens and basements, done right.",
    sub: "Licensed, insured, and on site when we say we'll be.",
    cta: "Book a free estimate",
    toast: "Estimate request received",
    s: ["Kitchens", "Basements", "Bathrooms"],
    entity: "Jobs",
    k: ["New enquiries", "Booked this week", "Follow-ups due"],
    rows: [
      ["Basement finish", "Whitby", "Quoted", "Booked"],
      ["Kitchen refit", "Oshawa", "In progress", "In progress"],
      ["Bathroom", "Ajax", "Booked", "Booked"],
      ["Flooring", "Pickering", "Done", "Done"],
    ],
    msg: "Hi, do you do basement finishing in Whitby? Hoping to start next month.",
    draft: "We do. Can we book a free walkthrough on Thursday at 10?",
    ins: " I'll bring finish samples.",
    crm: "New lead · Basement finish, Whitby",
    cal: "Thu 10:00 · Walkthrough",
    query: "renovation contractor near me",
    tasks: [
      "Quote follow-ups",
      "Crew scheduling",
      "Invoice reminders",
      "Permit paperwork",
      "Review requests",
    ],
    cust: "Rachel",
    proj: "Basement finish",
    pst: ["Walkthrough", "Quote approved", "Framing and drywall", "Finishing", "Handover"],
    aud: "Realtors in Durham Region",
    kind: "estimate",
  },
  dental: {
    label: "Dental",
    name: "Northside Dental",
    area: "Downtown",
    head: "Gentle care for the whole family.",
    sub: "New patients welcome, with evening and Saturday hours.",
    cta: "Book a cleaning",
    toast: "Appointment request received",
    s: ["Cleanings", "Invisalign", "Emergencies"],
    entity: "Patients",
    k: ["New patients", "Booked this week", "Recalls due"],
    rows: [
      ["J. M.", "Cleaning", "Requested", "Booked"],
      ["A. P.", "Consult", "In chair", "In chair"],
      ["L. C.", "Filling", "Booked", "Booked"],
      ["R. D.", "Recall", "Done", "Done"],
    ],
    msg: "Do you take new patients? My son needs a cleaning.",
    draft: "We do. Saturday at 9:30 is open for him. Shall I book it?",
    ins: " We'll text a reminder the day before.",
    crm: "New patient · Cleaning",
    cal: "Sat 9:30 · Cleaning",
    query: "dentist near me",
    tasks: [
      "Recall reminders",
      "Insurance paperwork",
      "Appointment confirmations",
      "Intake forms",
      "Review requests",
    ],
    cust: "Jordan",
    proj: "Invisalign plan",
    pst: ["Consult", "Scans", "Aligners ordered", "Fitting", "Check-ins"],
    aud: "Families nearby",
    kind: "appointment",
  },
  food: {
    label: "Restaurant",
    name: "Northside Kitchen",
    area: "Queen West",
    head: "Wood-fired, every night from five.",
    sub: "Walk-ins welcome. Book ahead for groups.",
    cta: "Reserve a table",
    toast: "Table request received",
    s: ["Menu", "Private dining", "Events"],
    entity: "Reservations",
    k: ["Covers tonight", "Booked this week", "Events coming up"],
    rows: [
      ["Party of 8", "Fri 8:00 pm", "Requested", "Confirmed"],
      ["Party of 4", "7:00 pm", "Confirmed", "Confirmed"],
      ["Party of 2", "7:30 pm", "Seated", "Seated"],
      ["Party of 2", "6:00 pm", "Done", "Done"],
    ],
    msg: "Can you fit a party of 8 this Friday? It's a birthday.",
    draft: "Happy to. Friday at 8 works, and we'll hold the back table.",
    ins: " Tell us if anyone has allergies.",
    crm: "Event · Party of 8",
    cal: "Fri 20:00 · Birthday, 8",
    query: "restaurant near me",
    tasks: [
      "Reservation replies",
      "Event enquiries",
      "Supplier orders",
      "Review replies",
      "Staff scheduling",
    ],
    cust: "Maya",
    proj: "Birthday dinner, party of 8",
    pst: ["Requested", "Confirmed", "Menu chosen", "Table set", "Enjoy the night"],
    aud: "Local offices",
    kind: "reservation",
  },
  law: {
    label: "Law firm",
    name: "Northside Law",
    area: "Mississauga",
    head: "Clear advice, fixed fees, no surprises.",
    sub: "Real estate, wills and small business, in plain language.",
    cta: "Book a consultation",
    toast: "Consultation request received",
    s: ["Real estate", "Wills", "Business"],
    entity: "Matters",
    k: ["New enquiries", "Consults this week", "Deadlines due"],
    rows: [
      ["Home purchase", "Closing next month", "Enquiry", "Opened"],
      ["Will and POA", "Draft", "In review", "In review"],
      ["Incorporation", "Filed", "Waiting", "Waiting"],
      ["Lease review", "Sent", "Done", "Done"],
    ],
    msg: "We're closing on a house next month. Do you handle that?",
    draft: "We do. Let's set a 20-minute call on Tuesday at 2 to walk through it.",
    ins: " Please bring your purchase agreement.",
    crm: "New matter · Home purchase",
    cal: "Tue 14:00 · Intro call",
    query: "real estate lawyer near me",
    tasks: [
      "Intake calls",
      "Document collection",
      "Deadline reminders",
      "Billing follow-ups",
      "Review requests",
    ],
    cust: "Sam",
    proj: "Home purchase",
    pst: ["Retainer signed", "Documents received", "Title search", "Closing", "Keys in hand"],
    aud: "Realtors and mortgage brokers",
    kind: "consultation",
  },
  fit: {
    label: "Fitness",
    name: "Northside Fitness",
    area: "Leslieville",
    head: "Strength classes that fit your week.",
    sub: "Small groups, real coaching, mornings and evenings.",
    cta: "Try a free class",
    toast: "Free class booked",
    s: ["Classes", "Coaching", "Memberships"],
    entity: "Members",
    k: ["Trials this week", "Classes booked", "Renewals due"],
    rows: [
      ["M. B.", "Trial", "Requested", "Booked"],
      ["K. S.", "Strength 6 am", "Checked in", "Checked in"],
      ["T. N.", "Coaching", "Renewing", "Renewing"],
      ["S. A.", "Mobility", "Done", "Done"],
    ],
    msg: "Is there a beginner class on weekday mornings?",
    draft: "Yes, Strength Basics runs Tuesdays at 6:30. Want a free spot?",
    ins: " Just bring water and runners.",
    crm: "Trial · Strength Basics",
    cal: "Tue 6:30 · Free class",
    query: "gym near me",
    tasks: [
      "Trial follow-ups",
      "Class reminders",
      "Renewal nudges",
      "Waitlist emails",
      "Review requests",
    ],
    cust: "Alex",
    proj: "Strength Basics",
    pst: ["Trial class", "Plan chosen", "Week one", "Week four", "Check-in"],
    aud: "New movers nearby",
    kind: "class",
  },
};

export const TRADE_ORDER: TradeId[] = ["reno", "dental", "food", "law", "fit"];

/* ── proof chips ───────────────────────────────────────────────────── */

/**
 * The reference labels these by hand. Here each one carries the real
 * case-file slug as well, so "See it in …" can never point at a project
 * that is not there.
 *
 * The names are literals rather than a read of `builtByAverr`: importing
 * that would pull all five case files' copy into the /services chunk for
 * five strings. They are checked against it at commit time instead.
 */
export type ProofKey = "cg" | "sift" | "express" | "cadence" | "capital";

export const PROOF: Record<ProofKey, { name: string; slug: string }> = {
  cg: { name: "CG Walls & Floors", slug: "cg-walls-and-floors" },
  sift: { name: "SIFT", slug: "sift" },
  express: { name: "Express Contractors", slug: "express-contractors" },
  cadence: { name: "CadenceStack", slug: "cadencestack" },
  capital: { name: "CapitalCommand", slug: "capitalcommand" },
};

/* ── the twelve beats ──────────────────────────────────────────────── */

/** The mock each beat builds. Also the key `QUAD` and `ILL` use. */
export type SlotId =
  | "w1" | "w2" | "w3"
  | "a1" | "a2" | "a3"
  | "i1" | "i2" | "i3"
  | "m1" | "m2" | "m3";

export type Beat = {
  service: ServiceId;
  title: string;
  line: string;
  proof: ProofKey[];
  slot: SlotId;
};

export const BEATS: Beat[] = [
  {
    service: "websites",
    title: "Brand and design direction",
    line: "A palette, type and logo that are yours, decided before a line of code.",
    proof: ["cg", "sift"],
    slot: "w1",
  },
  {
    service: "websites",
    title: "The website itself",
    line: "Custom-built, up to 15 pages, fast on every phone, and written for your customers.",
    proof: ["cg", "express"],
    slot: "w2",
  },
  {
    service: "websites",
    title: "Bookings and enquiries",
    line: "Visitors pick a day and a time, and it lands straight in your calendar.",
    proof: ["express"],
    slot: "w3",
  },
  {
    service: "webApps",
    title: "Dashboards for your team",
    line: "Your jobs, bookings and follow-ups in one place your team can actually find their way around.",
    proof: ["sift", "capital"],
    slot: "a1",
  },
  {
    service: "webApps",
    title: "Portals for your customers",
    line: "Customers see where their job stands without calling to ask.",
    proof: ["cadence"],
    slot: "a2",
  },
  {
    service: "webApps",
    title: "Design systems",
    line: "Components, tokens and motion your team can reuse, in light and dark.",
    proof: ["sift"],
    slot: "a3",
  },
  {
    service: "aiAutomation",
    title: "Workflow audit",
    line: "We map where your week goes, and what can come off your team's plate.",
    proof: [],
    slot: "i1",
  },
  {
    service: "aiAutomation",
    title: "AI agents",
    line: "Enquiries read, replies drafted, leads logged and calls booked, automatically.",
    proof: ["cg", "sift"],
    slot: "i2",
  },
  {
    service: "aiAutomation",
    title: "Human review built in",
    line: "AI drafts, your team approves, and nothing goes out unchecked.",
    proof: ["sift", "cadence"],
    slot: "i3",
  },
  {
    service: "marketing",
    title: "Local search",
    line: "Google Business Profile, reviews and local rankings that bring in nearby customers.",
    proof: ["cg"],
    slot: "m1",
  },
  {
    service: "marketing",
    title: "Campaigns and outreach",
    line: "Ads on Google, Meta and LinkedIn, and outreach to the people most likely to hire you.",
    proof: ["cg"],
    slot: "m2",
  },
  {
    service: "marketing",
    title: "Plain-numbers reporting",
    line: "A monthly report that says what worked, in plain language.",
    proof: ["cadence"],
    slot: "m3",
  },
];

/** The thirteenth segment: four of the mocks, tiled. */
export const QUAD: Partial<Record<SlotId, "q1" | "q2" | "q3" | "q4">> = {
  w2: "q1",
  a1: "q2",
  i2: "q3",
  m1: "q4",
};

/** Beats whose mock shows made-up figures, and so carry the tag. */
export const ILLUSTRATIVE = new Set<SlotId>([
  "a1",
  "a2",
  "i1",
  "i2",
  "i3",
  "m1",
  "m2",
  "m3",
]);

export const ALL_FOUR = {
  kicker: "All four",
  title: "One team. Everything talks to everything.",
  line: "The site books the job, the app tracks it, the automation follows up, and marketing brings the next one.",
  cta: "Get your project start pass →",
};

/* ── what you get ──────────────────────────────────────────────────── */

/**
 * What every engagement includes, whichever of the four services it
 * starts with. This replaced "What we don't do" — three refusals drawn
 * through with a rule — which told visitors what they would not be
 * getting at the point in the page where they most want to know what
 * they would.
 *
 * The altitude matters. The pinned stage above already walks through
 * twelve named deliverables, three per service, with a working mock of
 * each; listing those again here would be the same page twice. These
 * five sit a level up: they are true of a website, a web app, an
 * automation and a marketing engagement alike, which is what makes them
 * worth stating on a page that sells all four.
 *
 * Every line is already live somewhere on the site, rewritten to fit
 * this list but not re-argued:
 *
 *   1 → `aboutProcess.PROCESS` "Direction"
 *   2 → the studio's own schema description, and the home hero
 *   3 → `ALL_FOUR.line`, verbatim
 *   4 → `FAQ` "How much does a project cost?"
 *   5 → `FAQ` "What happens after launch?"
 *
 * Keeping them sourced is the point: a page that sells four services is
 * the easiest place on the site to start promising a fifth thing nobody
 * agreed to deliver.
 */
export const INCLUDED: { name: string; outcome: string }[] = [
  {
    name: "Direction before the build",
    outcome:
      "What you do, who it's for and how it should feel, settled before a line of code.",
  },
  {
    name: "The person on the call builds it",
    outcome:
      "No account manager, no handoff. You work directly with the person doing the work.",
  },
  {
    name: "Everything talks to everything",
    outcome: ALL_FOUR.line,
  },
  {
    name: "A fixed scope, timeline and price",
    outcome:
      "In writing within 3 business days of the call. If we can't quote it, we'll tell you why.",
  },
  {
    name: "Support after you're live",
    outcome:
      "We keep refining once you've launched, and your team gets the documentation to run it without us.",
  },
];

/* ── questions ─────────────────────────────────────────────────────── */

/**
 * The questions people ask before the call.
 *
 * The first six are the page's originals and are unchanged. The last
 * five came from the /services/websites draft, which asked a different
 * set — the concrete build questions a buyer asks once they have
 * decided they want something made. Both sets were real, so both are
 * here rather than one replacing the other.
 *
 * Order is general to specific: what it costs and how it runs, then
 * what gets built and how. "What does a website build include?" was
 * dropped on the merge — "How long does it take?" and the `INCLUDED`
 * list above already answer it, and a FAQ that answers the same
 * question twice reads as padding to a visitor and as duplication to a
 * search engine.
 *
 * This array is the page's FAQPage schema: `tools/prerender.mjs` reads
 * it through `entry-server`, so adding a question here ships it to
 * Google without a second edit.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "How much does a project cost?",
    a: "Every project gets a fixed quote after the discovery call: fixed scope, fixed timeline, fixed price, in writing within 3 business days. If we can't quote it, we'll tell you why.",
  },
  {
    q: "How long does it take?",
    a: "Websites take 2 – 3 weeks and AI automation 1 – 2 weeks. Web apps are scoped on the call, and marketing is ongoing. We don't take projects we can't ship in 90 days.",
  },
  {
    q: "Do I need all four services?",
    a: "No. Start with the one you need most. Everything we build is designed to connect, so adding the next one later is straightforward.",
  },
  {
    q: "Will the AI send things without us?",
    a: "No. Every automation we build has human review: the AI drafts, your team approves, and nothing goes out unchecked.",
  },
  {
    q: "How involved do I need to be?",
    a: "Thirty minutes for the discovery call, then one review call a week. Everything else is async, and you get preview links from day one, not deliverables at the end.",
  },
  {
    q: "What happens after launch?",
    a: "We keep refining after you're live, and you get handoff documentation so your team can run and change things without us.",
  },
  {
    q: "Do you build on WordPress, Wix or Squarespace?",
    a: "No. Every site is hand-built in code, with real motion and a layout made for every screen. Nothing is dropped in from a theme, so nothing has to be worked around later.",
  },
  {
    q: "How many pages do I get?",
    a: "Up to 15 pages in a standard site build, and the page count is settled on the discovery call rather than guessed at. Most businesses need fewer pages that each do more.",
  },
  {
    q: "Will it work properly on phones?",
    a: "Phones come first, not last. Every screen is checked at phone, tablet and desktop sizes, and the polish pass goes through contrast, keyboards and reduced motion one by one before launch.",
  },
  {
    q: "Will Google be able to find it?",
    a: "Yes. Every page ships its own text, headings, title, description and structured data before any script runs, with a sitemap and a canonical address, so search engines and AI assistants read the real page rather than an empty shell.",
  },
  {
    q: "Can you rebuild something I already have?",
    a: "Yes, and you keep what works: your domain, your email, your photos and any copy worth keeping. Redirects from your old pages are part of the build, so the rankings you already have move with you.",
  },
];

export const CONTACT_EMAIL = "prachets@averrstudios.com";

/* ── what the visitor's name turns into ────────────────────────────── */

/**
 * Everything the mocks derive from the typed name, ported exactly from
 * the reference's `slug()` and `apply()`.
 *
 * Note which fallback is which: the MOCKS fall back to the trade's own
 * business name, so the screens are never half-filled, while the HERO
 * falls back to "your business", so the headline reads as a sentence
 * before anyone types. Swapping the two would put "Northside Dental"
 * in the h1 of a page nobody has typed into.
 */

/** Lowercase, decomposed, stripped, de-spaced, capped at 22, plus `.ca`. */
export function domainFor(name: string): string {
  const slug =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "")
      .slice(0, 22) || "yourbusiness";
  return `${slug}.ca`;
}

/** The name the mock screens show. */
export function mockName(typed: string, trade: TradeId): string {
  return typed.trim() || TRADES[trade].name;
}

/** The name the hero headline shows. */
export function heroName(typed: string): string {
  return typed.trim() || "your business";
}

/** First word, for the places that only have room for one. */
export function shortName(name: string): string {
  return name.split(/\s+/)[0];
}

/** First character, for the avatar. */
export function initialOf(name: string): string {
  return name.trim()[0] || "N";
}

/**
 * Everything the twelve mocks read, in one object.
 *
 * The reference computes this in `apply()` and writes it into the DOM
 * through `[data-f]` attributes. Here the mocks take it as a prop and
 * interpolate it, which is the same values by a shorter route.
 */
export type Fields = {
  trade: Trade;
  name: string;
  domain: string;
  short: string;
  initial: string;
  /** The project name, lowercased, as it reads mid-sentence. */
  projl: string;
  /** The portal's latest-update line. */
  pupd: string;
  /** The portal's next-visit line. */
  pnext: string;
  /** The hero headline's name, which falls back differently. */
  hero: string;
};

export function fieldsFor(typed: string, tradeId: TradeId): Fields {
  const trade = TRADES[tradeId];
  const name = mockName(typed, tradeId);
  return {
    trade,
    name,
    domain: domainFor(name),
    short: shortName(name),
    initial: initialOf(name),
    projl: trade.proj.toLowerCase(),
    pupd: `${trade.pst[2]} started today. Photos are below.`,
    pnext: trade.cal,
    hero: heroName(typed),
  };
}
