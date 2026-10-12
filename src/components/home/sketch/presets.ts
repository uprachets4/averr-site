/**
 * Seven industries, seven sites.
 *
 * Each preset is a whole design, not a recolour: its own five-colour
 * palette, its own type pairing drawn from the four self-hosted families,
 * its own hero layout, its own abstract hero art, its own service names
 * and its own headline. Switching preset re-composes the sketch; switching
 * name inside a preset only swaps the text tokens.
 *
 * PALETTE NOTE. These colours are a SCREEN INTERIOR and are allowed their
 * own identity — the 21 ruling says so explicitly, as /services' screens
 * already do. Nothing here reaches the page around the window, which stays
 * on the site's cream/ink tokens.
 *
 * ASSET RULE. No photographs and no real brands. Every mark and every
 * image in the sketch is drawn in SVG or CSS from the typed name.
 */

export type PresetId =
  | "food"
  | "health"
  | "trades"
  | "beauty"
  | "fitness"
  | "professional"
  | "local";

/** How the generated site arranges its first screen. */
export type HeroVariant = "stacked" | "split" | "split-reverse" | "centered" | "editorial";

export type Palette = {
  /** The page ground. */
  bg: string;
  /** Cards, the nav bar, the booking bar. */
  surface: string;
  /** Headlines and body. */
  ink: string;
  /** Secondary text and rules. */
  muted: string;
  /** The one colour that does the work. */
  accent: string;
  /** Text that sits on `accent`. */
  onAccent: string;
};

export type TypeStyle = {
  display: string;
  body: string;
  displayWeight: number;
  displayItalic?: boolean;
  /** em */
  displayTracking: number;
  navCase: "upper" | "normal" | "lower";
  /** em, for the nav and small labels */
  navTracking: number;
  navWeight: number;
};

export type Preset = {
  id: PresetId;
  /** What the corner of the sketch calls this kind of business. */
  kind: string;
  palette: Palette;
  type: TypeStyle;
  variant: HeroVariant;
  /** `{name}` is replaced with the business name. */
  headline: string;
  sub: string;
  nav: string[];
  services: { name: string; note: string }[];
  /** The booking bar's verb. */
  cta: string;
  /** Three fictional first names for the review strip. */
  reviewers: string[];
  reviews: string[];
};

const GEIST = '"Geist", ui-sans-serif, system-ui, sans-serif';
const INTER = '"Inter", "Inter Fallback", ui-sans-serif, system-ui, sans-serif';
const CORMORANT = '"Cormorant Garamond", Georgia, serif';
const MONO = '"Geist Mono", ui-monospace, monospace';

export const PRESETS: Record<PresetId, Preset> = {
  /* ── food: warm, appetising, lowercase, art-directed ─────────────── */
  food: {
    id: "food",
    kind: "café + kitchen",
    palette: {
      bg: "#FBF5EC",
      surface: "#FFFFFF",
      ink: "#2A1A10",
      muted: "#8C7459",
      accent: "#C2552C",
      onAccent: "#FFF6EE",
    },
    type: {
      display: CORMORANT,
      body: INTER,
      displayWeight: 600,
      displayItalic: true,
      displayTracking: -0.01,
      navCase: "lower",
      navTracking: 0.02,
      navWeight: 500,
    },
    variant: "stacked",
    headline: "{name}. Fresh every morning.",
    sub: "Baked on site, served from seven. Counter seating, takeaway, and a kitchen you can see into.",
    nav: ["menu", "mornings", "find us"],
    services: [
      { name: "Breakfast counter", note: "from 7:00" },
      { name: "Lunch, made to order", note: "11:30 – 3:00" },
      { name: "Whole-bean roasts", note: "ground to order" },
      { name: "Catering trays", note: "48 hours' notice" },
    ],
    cta: "Reserve a table",
    reviewers: ["Dana", "Marc", "Priya"],
    reviews: [
      "The sourdough is worth the queue.",
      "Best flat white on the street.",
      "They remember your order.",
    ],
  },

  /* ── health: calm, clinical, generous whitespace ──────────────────── */
  health: {
    id: "health",
    kind: "clinic",
    palette: {
      bg: "#F3F8F8",
      surface: "#FFFFFF",
      ink: "#0E272C",
      muted: "#67828A",
      accent: "#17746F",
      onAccent: "#F2FBFA",
    },
    type: {
      display: INTER,
      body: INTER,
      displayWeight: 600,
      displayTracking: -0.025,
      navCase: "normal",
      navTracking: 0.01,
      navWeight: 500,
    },
    variant: "split",
    headline: "{name}. Care that starts on time.",
    sub: "Same-week appointments, direct billing, and a team that explains what it is doing and why.",
    nav: ["Services", "Our team", "New patients", "Contact"],
    services: [
      { name: "New patient exam", note: "60 min" },
      { name: "Hygiene + cleaning", note: "45 min" },
      { name: "Emergency visits", note: "same day" },
    ],
    cta: "Book an appointment",
    reviewers: ["Alice", "Tomas", "Rhea"],
    reviews: [
      "Ran exactly on schedule.",
      "Explained every step first.",
      "Billing was handled for me.",
    ],
  },

  /* ── trades: sturdy, angular, confident ───────────────────────────── */
  trades: {
    id: "trades",
    kind: "contractor",
    palette: {
      bg: "#F1F2F3",
      surface: "#FFFFFF",
      ink: "#14181B",
      muted: "#6C747B",
      accent: "#D0711A",
      onAccent: "#1A1206",
    },
    type: {
      display: GEIST,
      body: INTER,
      displayWeight: 600,
      displayTracking: -0.035,
      navCase: "upper",
      navTracking: 0.1,
      navWeight: 500,
    },
    variant: "split-reverse",
    headline: "{name}. Built right, on schedule.",
    sub: "Licensed and insured. Fixed quotes, a written schedule, and the same crew from start to finish.",
    nav: ["Work", "Process", "Quote"],
    services: [
      { name: "Kitchens + baths", note: "4 – 8 weeks" },
      { name: "Basement finishing", note: "6 – 10 weeks" },
      { name: "Additions", note: "by consultation" },
      { name: "Decks + exteriors", note: "seasonal" },
    ],
    cta: "Get a fixed quote",
    reviewers: ["Grant", "Melanie", "Owen"],
    reviews: [
      "Finished two days early.",
      "The quote was the price.",
      "Site swept every evening.",
    ],
  },

  /* ── beauty: soft, centred, quietly luxurious ─────────────────────── */
  beauty: {
    id: "beauty",
    kind: "salon + spa",
    palette: {
      bg: "#FAF4F5",
      surface: "#FFFFFF",
      ink: "#241620",
      muted: "#8A7281",
      accent: "#8B4663",
      onAccent: "#FCF4F7",
    },
    type: {
      display: CORMORANT,
      body: INTER,
      displayWeight: 500,
      displayTracking: 0.005,
      navCase: "upper",
      navTracking: 0.22,
      navWeight: 400,
    },
    variant: "centered",
    headline: "{name}. Looking your best, every visit.",
    sub: "Unhurried appointments, one stylist from consultation to finish, and products you can take home.",
    nav: ["Treatments", "Team", "Book"],
    services: [
      { name: "Cut + finish", note: "60 min" },
      { name: "Colour + gloss", note: "120 min" },
      { name: "Treatments", note: "30 min" },
    ],
    cta: "Book a chair",
    reviewers: ["Nadia", "Iris", "June"],
    reviews: [
      "First time I've left happy.",
      "Never rushed, never upsold.",
      "Worth the drive across town.",
    ],
  },

  /* ── fitness: the dark one, loud and tight ────────────────────────── */
  fitness: {
    id: "fitness",
    kind: "studio",
    palette: {
      bg: "#101214",
      surface: "#191D1F",
      ink: "#F1F4F2",
      muted: "#96A09D",
      accent: "#C4F04A",
      onAccent: "#101214",
    },
    type: {
      display: GEIST,
      body: GEIST,
      displayWeight: 600,
      displayTracking: -0.045,
      navCase: "upper",
      navTracking: 0.14,
      navWeight: 500,
    },
    variant: "editorial",
    headline: "{name}. Stronger every week.",
    sub: "Small classes, named coaches, and a plan that moves with you. First session is free.",
    nav: ["Classes", "Coaches", "Rates"],
    services: [
      { name: "Strength", note: "45 min" },
      { name: "Conditioning", note: "30 min" },
      { name: "Mobility", note: "40 min" },
      { name: "1:1 coaching", note: "by block" },
    ],
    cta: "Claim a free session",
    reviewers: ["Kofi", "Sam", "Elena"],
    reviews: [
      "Coaches know your name.",
      "Never more than eight of us.",
      "Actually got stronger.",
    ],
  },

  /* ── professional: conservative, ruled, serif authority ───────────── */
  professional: {
    id: "professional",
    kind: "practice",
    palette: {
      bg: "#F7F6F1",
      surface: "#FFFFFF",
      ink: "#14203A",
      muted: "#697189",
      accent: "#1E3A72",
      onAccent: "#F4F7FD",
    },
    type: {
      display: CORMORANT,
      body: INTER,
      displayWeight: 600,
      displayTracking: -0.005,
      navCase: "upper",
      navTracking: 0.16,
      navWeight: 500,
    },
    variant: "split",
    headline: "{name}. Advice you can act on.",
    sub: "Plain answers, fixed engagements, and a named advisor who picks up the phone.",
    nav: ["Practice", "People", "Insights", "Contact"],
    services: [
      { name: "Initial consultation", note: "45 min" },
      { name: "Ongoing advisory", note: "monthly" },
      { name: "Filings + review", note: "by season" },
    ],
    cta: "Request a consultation",
    reviewers: ["Harold", "Simone", "Devi"],
    reviews: [
      "Answered in plain English.",
      "No surprises on the invoice.",
      "Returned the call same day.",
    ],
  },

  /* ── local: the honest default ────────────────────────────────────── */
  local: {
    id: "local",
    kind: "local service",
    palette: {
      bg: "#F6F5F1",
      surface: "#FFFFFF",
      ink: "#1B1E1A",
      muted: "#70756D",
      accent: "#3C6A48",
      onAccent: "#F3F8F3",
    },
    type: {
      display: GEIST,
      body: INTER,
      displayWeight: 600,
      displayTracking: -0.03,
      navCase: "normal",
      navTracking: 0.01,
      navWeight: 500,
    },
    variant: "stacked",
    headline: "{name}. Done properly, first time.",
    sub: "Clear pricing, a real schedule, and someone who answers when you call.",
    nav: ["Services", "About", "Contact"],
    services: [
      { name: "Consultation", note: "free" },
      { name: "Standard service", note: "most jobs" },
      { name: "Priority call-out", note: "24 hours" },
    ],
    cta: "Get in touch",
    reviewers: ["Beth", "Andre", "Lin"],
    reviews: [
      "Turned up when they said.",
      "Fair price, no haggling.",
      "Would use again.",
    ],
  },
};

/** Keyword → preset. First match wins, checked longest-first per group. */
const KEYWORDS: Array<[PresetId, string[]]> = [
  ["food", ["café", "cafe", "bakery", "coffee", "kitchen", "bistro", "pizza"]],
  ["health", ["dental", "physio", "clinic", "chiro", "wellness"]],
  ["trades", ["renovations", "renovation", "construction", "plumbing", "electric", "roofing", "landscaping"]],
  ["beauty", ["salon", "barbers", "barber", "spa", "nails"]],
  ["fitness", ["gym", "fitness", "yoga", "pilates"]],
  ["professional", ["law", "legal", "accounting", "cpa", "realty", "realtor"]],
];

/** Which site the name asks for. Case-insensitive, substring. */
export function presetFor(name: string): PresetId {
  const hay = name.toLowerCase();
  for (const [id, words] of KEYWORDS) {
    for (const w of words) if (hay.includes(w)) return id;
  }
  return "local";
}

export const MONO_FAMILY = MONO;
