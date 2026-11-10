/**
 * /contact — the brief's copy and options, spec 34.
 *
 * Every string is the reference's, word for word: the service
 * descriptions, the sub-option lists, the timing labels and the
 * letter's sentence templates.
 *
 * Ids, names and colours are NOT repeated here — they come from
 * `serviceColors.ts`, which is already the one source for all four.
 */

import {
  SERVICE_COLOR,
  SERVICE_NAMES,
  type ServiceId,
} from "./serviceColors";

/**
 * Where to write when the send fails.
 *
 * Moved here from `briefCopy.ts`, which goes with the old Contact
 * components — the failure fallback needs it after they're gone.
 */
export const EMAIL_ADDR = "prachets@averrstudios.com";

export type BriefService = {
  id: ServiceId;
  /** The reference's short key, kept because the letter reads by it. */
  key: string;
  name: string;
  color: string;
  description: string;
  subs: string[];
};

/** The four, in the owner's fixed order. */
export const BRIEF_SERVICES: BriefService[] = [
  {
    id: "websites",
    key: "web",
    name: SERVICE_NAMES.websites,
    color: SERVICE_COLOR.websites,
    description: "A site that looks like you meant it.",
    subs: [
      "Brand & design direction",
      "A new website",
      "A redesign",
      "Online booking",
      "Landing pages",
    ],
  },
  {
    id: "webApps",
    key: "app",
    name: SERVICE_NAMES.webApps,
    color: SERVICE_COLOR.webApps,
    description: "Software built around how you work.",
    subs: [
      "Customer portal",
      "Team dashboard",
      "Booking & ordering",
      "Internal tools",
      "Design system",
    ],
  },
  {
    id: "aiAutomation",
    key: "ai",
    name: SERVICE_NAMES.aiAutomation,
    color: SERVICE_COLOR.aiAutomation,
    description: "The busywork, handled.",
    subs: [
      "Workflow audit",
      "AI agents",
      "Tool integration",
      "Human review built in",
      "Handoff documentation",
    ],
  },
  {
    id: "marketing",
    key: "mkt",
    name: SERVICE_NAMES.marketing,
    color: SERVICE_COLOR.marketing,
    description: "Found first. Chosen more.",
    subs: [
      "Local search",
      "Outreach campaigns",
      "Paid ads",
      "Content",
      "Monthly reporting",
    ],
  },
];

/** The timing buttons. `value` is what the letter says. */
export const TIMINGS: { label: string; value: string }[] = [
  { label: "As soon as possible", value: "as soon as possible" },
  { label: "Within a month", value: "within a month" },
  { label: "In a few months", value: "in the next few months" },
  { label: "Flexible", value: "whenever the timing is right" },
];

/** The four "what happens next" steps in the sent state. */
export const NEXT_STEPS: { mark: string; title: string; line: string }[] = [
  {
    mark: "✓",
    title: "Your letter lands",
    line: "Straight to me. Nobody filters it first.",
  },
  {
    mark: "2",
    title: "I reply within 24 hours",
    line: "Usually with a question or two, and what I'd look at first.",
  },
  {
    mark: "3",
    title: "A 30-minute call",
    line: "You talk about the business, I ask questions. No slide deck.",
  },
  {
    mark: "4",
    title: "A rough plan",
    line: "What it would take and how long, before you commit to anything.",
  },
];

/** The facts beside the calendar. */
export const TALK_FACTS: [string, string][] = [
  ["Length", "30 minutes"],
  ["Where", "Google Meet"],
  ["Who", "Just me, the person who builds it"],
  ["Bring", "Nothing. A link to your current site helps."],
];

/* ── the letter's sentence templates ─────────────────────────────── */

export const LETTER = {
  greeting: "Hi Prachets,",
  /** Used when "Not sure yet" is ticked. */
  unsure:
    "I'm not sure yet exactly what we need, and I'd like to work it out together.",
  needPrefix: "We're looking for help with ",
  whenPrefix: " We'd like to get going ",
  linkPrefix: "You can see where we are now at ",
  reachPrefix: "You can reach me at ",
  signOff: "Thanks,",
  footer: "Your letter, exactly as it lands in my inbox",
  /** The dashed placeholders, before anything is typed. */
  blanks: {
    name: "your name",
    need: "what you need",
    gist: "A sentence or two about the project.",
    email: "your email",
  },
} as const;

/** `a, b and c` — the reference's joiner, used in the letter. */
export function joinList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

/** A valid-enough email. The reference's test, not a stricter one. */
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
