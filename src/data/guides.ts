/**
 * The guides.
 *
 * The site had twelve URLs and no articles, which is why it could only
 * rank for a handful of searches. Each guide answers one question a
 * GTA business owner actually types, end to end, so that it is worth
 * reading rather than worth skimming.
 *
 * Guides are structured data, not JSX, for three reasons: the renderer
 * stays one component instead of one per article, `tools/prerender.mjs`
 * can build Article schema and a reading time from the same source,
 * and a guide can be checked — `tools/guides.test.ts` asserts the
 * shape rather than trusting that a new one was written correctly.
 *
 * Every factual claim in a guide is either something done on this
 * studio's own profile, or checked against the vendor's own
 * documentation on the date in `checked`. Where a guide states a rule
 * that Google can change, `checked` is what tells the next person how
 * stale it might be. Section 7 of the SEO checklist asks for a refresh
 * every six months; that date is the thing to refresh.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  /** A box: the thing people get wrong, or the thing we did ourselves. */
  | { t: "note"; label: string; text: string };

export type GuideSection = {
  /** Rendered as an h2, and used to build the on-page contents. */
  h: string;
  blocks: Block[];
};

export type Guide = {
  slug: string;
  /** The h1. Written as the question someone types, answered. */
  title: string;
  /** The ONE search this guide targets — the keyword map covers guides
   *  too, and `tools/keyword-map.test.ts` fails if two pages claim it. */
  target: string;
  /** The standfirst under the h1, and the meta description's basis. */
  dek: string;
  /** ISO date the guide first went live. */
  published: string;
  /** ISO date the facts were last checked against the source. */
  checked: string;
  /** Share-image id in `tools/og-images.mjs`. Short and stable: the
   *  slug is a sentence and makes a poor file name. */
  og: string;
  intro: Block[];
  sections: GuideSection[];
};

/**
 * Guide 1 — Google Maps.
 *
 * Written from this studio's own Google Business Profile, which is set
 * up as a service-area business with the address hidden and is waiting
 * on video verification as this is published. The parts we have not
 * reached ourselves are stated as what Google's documentation says,
 * not as what we have seen, and the guide says which is which — a
 * guide that pretends to more experience than it has is the kind that
 * gets a reader's profile suspended.
 *
 * Facts checked against Google Business Profile Help on 17 Nov 2026:
 * the service-area address rule, the video requirements and the three
 * things a service-area video has to show, the review window, and the
 * name guideline. Third-party sources agreed that video is now the
 * default path for service-area businesses and that postcard has
 * largely gone for them; that one is stated as the common case rather
 * than as a rule, because Google decides the method per profile.
 */
const googleMaps: Guide = {
  slug: "get-your-toronto-business-on-google-maps",
  title: "How to get your Toronto business on Google Maps",
  target: "get business on google maps toronto",
  dek: "A Google Business Profile is the single biggest thing a local business can do for itself, and most of the work is decisions rather than typing. Here is the whole process, in order, including the one choice that gets profiles suspended.",
  published: "2026-11-17",
  checked: "2026-11-17",
  og: "guide-google-maps",
  intro: [
    {
      t: "p",
      text: "When someone in the GTA searches for what you do and adds \"near me\", the results above the websites come from Google Business Profiles. Being there is free. It takes an afternoon of setup and then about ten minutes a week, and for most local businesses it brings in more enquiries than the website does in the first year.",
    },
    {
      t: "p",
      text: "This is the whole process in the order you should do it, written while setting up our own. Where we have been through a step ourselves we say so; where we are quoting Google's rules rather than our own experience, we say that too.",
    },
  ],
  sections: [
    {
      h: "Start with the one decision that matters",
      blocks: [
        {
          t: "p",
          text: "Before you type anything, decide which kind of business you are in Google's eyes, because almost every suspension traces back to getting this wrong.",
        },
        {
          t: "ul",
          items: [
            "A storefront is somewhere customers come to you, with permanent signage and someone there during opening hours. A dental office, a barbershop, a restaurant.",
            "A service-area business goes to the customer. A plumber, an electrician, a renovation crew, a cleaner — and most studios, consultants and trades working out of a home office.",
            "A hybrid does both: a repair shop with a counter and a mobile callout van.",
          ],
        },
        {
          t: "p",
          text: "Google's guideline is blunt: if you do not serve customers at your business address, do not put that address on your profile. If you work from home, that means your home address is hidden and you list the areas you serve instead. Your address is still entered during setup so Google knows where you operate from — it just is not shown publicly.",
        },
        {
          t: "note",
          label: "The thing people get wrong",
          text: "Leaving a home address visible on a service-area profile is one of the most common reasons a profile gets suspended, and a suspension is far harder to undo than it is to avoid. A PO box, a mailbox service or an unstaffed virtual office will not stand in for it either.",
        },
      ],
    },
    {
      h: "Create the profile",
      blocks: [
        {
          t: "p",
          text: "Search for your business name on Google first. If a profile already exists — Google generates them from other sources — claim that one rather than creating a second. Two profiles for one business compete with each other and one usually ends up suspended.",
        },
        {
          t: "ol",
          items: [
            "Enter your business name exactly as it appears on your registration, your invoices and your signage. Nothing else.",
            "Choose one primary category. This is the strongest single ranking signal on the profile, so pick the one that describes what you actually are, not the one with the most searches.",
            "Set your service areas by city or postal code. Google allows up to 20 and asks that the whole area stay inside roughly two hours' driving time of where you are based.",
            "Enter your address when asked, then set the profile to hide it if customers do not come to you.",
          ],
        },
        {
          t: "note",
          label: "Do not put keywords in your name",
          text: "\"Smith Plumbing — Best Emergency Plumber in Toronto\" is a guideline violation, not a clever trick. Google asks that the name match the one the business is known by in the real world, and a name stuffed with services or city names is one of the most frequently cited causes of suspension. It is also the easiest thing for a competitor to report.",
        },
        {
          t: "note",
          label: "What we did",
          text: "Averr Studios is a service-area business with the address hidden, one primary category, and ten GTA service areas — Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill and Oakville. We listed ten rather than the full twenty because they are the ones we genuinely work in, and an area you do not serve is a liability rather than reach.",
        },
      ],
    },
    {
      h: "Fill it in before you ask to be verified",
      blocks: [
        {
          t: "p",
          text: "A thin profile verifies no faster than a complete one, and a complete one starts earning the moment it goes live. Do this part first.",
        },
        {
          t: "ul",
          items: [
            "A description that says what you do, who for and where, in plain language. You have about 750 characters; use most of them.",
            "A phone number that actually rings, and that is not shared with another profile.",
            "Your website link. Add a tracking tag to it so you can tell in analytics which visits came from the profile rather than from search.",
            "Hours you will genuinely answer the phone in. Reasonable hours beat impressive ones.",
            "Secondary categories for the other things you do — these are much weaker than the primary one, but they are free.",
            "Photos: a logo, a cover image, and a handful of real pictures of the work. Avoid stock photography; it is obvious and it does nothing for you.",
          ],
        },
      ],
    },
    {
      h: "The verification video",
      blocks: [
        {
          t: "p",
          text: "Google decides which verification method you get and you cannot reliably pick another. For service-area businesses it is now almost always a video; the postcard that older guides describe has largely gone for this kind of profile.",
        },
        {
          t: "p",
          text: "The video has to be one continuous, unedited take, recorded live on a phone through the Business Profile itself. Pre-recorded clips are not accepted, and it cannot be done on a desktop. Google asks for at least 30 seconds and most successful recordings run one to two minutes.",
        },
        {
          t: "p",
          text: "For a service-area business, it has to show three things:",
        },
        {
          t: "ol",
          items: [
            "Where you operate — street signs, a building number or recognisable landmarks nearby. If you work from home, the signs and landmarks in your immediate neighbourhood are what Google asks for. Avoid filming somewhere with no identifying markers.",
            "That the business is real — the tools, equipment, workspace or products you work with. Branded clothing, business cards and specialised machinery all count.",
            "That you manage it — yourself performing a service, or opening something only the owner has access to, such as a branded vehicle. A document whose name matches the profile works too: a permit, an invoice or a utility bill.",
          ],
        },
        {
          t: "note",
          label: "Keep out of the frame",
          text: "Do not film bank, tax or ID numbers, anything private about you or anyone else, or other people's faces. Plan the walk before you start recording — you cannot pause, and starting over is the usual cost of not planning it.",
        },
        {
          t: "p",
          text: "Google's review takes up to five business days. While it is in progress, leave the profile alone: editing the name, address or category mid-review is a good way to restart the clock.",
        },
      ],
    },
    {
      h: "The first week after approval",
      blocks: [
        {
          t: "p",
          text: "Verification is the beginning of the work, not the end of it. In rough order of what it is worth:",
        },
        {
          t: "ol",
          items: [
            "Ask five past clients for a review, with a direct review link, on the day you finish something for them. Reviews are the biggest lever on local ranking and the hardest to catch up on later.",
            "Reply to every review within a couple of days, naming the service they bought. Replies are public and they are read.",
            "Add your services, each with its own short description, so the profile says what you sell rather than only what category you are in.",
            "Add an appointment or booking link, with its own tracking tag.",
            "Post once a week — a project photo, a short tip, something finished. It is a small signal, and it compounds.",
            "Seed a few questions and answers on the profile. You are allowed to ask and answer your own; it is the fastest way to get the common questions visible.",
          ],
        },
        {
          t: "note",
          label: "Where we are",
          text: "Our own profile is set up and waiting on video verification as this goes live, so the steps above are what Google's documentation specifies rather than what we have personally been through end to end. We will update this guide once ours is through, with whatever turned out to be different in practice.",
        },
      ],
    },
    {
      h: "What actually gets profiles suspended",
      blocks: [
        {
          t: "p",
          text: "Three things account for most of it, and all three are avoidable on the first day:",
        },
        {
          t: "ul",
          items: [
            "An address showing on a profile that should be a service-area business, or an address the business does not genuinely operate from.",
            "A business name with services, cities or superlatives added to it.",
            "A second profile for the same business, usually created to cover another area.",
            "Beyond those: PO boxes and unstaffed virtual offices, the same phone number across several profiles, and overlapping service areas between profiles you control.",
          ],
        },
        {
          t: "p",
          text: "Suspensions can be appealed, but the appeal is slow and you are invisible while it runs. Setting it up correctly on the first afternoon costs less than being right and suspended.",
        },
      ],
    },
    {
      h: "How long the whole thing takes",
      blocks: [
        {
          t: "ul",
          items: [
            "Setup, with the description and photos ready: an afternoon.",
            "Verification review: up to five business days once the video is submitted.",
            "First reviews: as long as it takes to ask, which is the part most businesses put off.",
            "Showing up for competitive searches: months, not weeks, and it tracks reviews and consistency more than anything you can do in one sitting.",
          ],
        },
      ],
    },
  ],
};

export const GUIDES: Guide[] = [googleMaps];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g])
);

/**
 * A reading time, derived rather than typed, so it cannot claim four
 * minutes after a guide doubles in length. 200 words a minute, which
 * is the slow end of adult reading and therefore the honest end.
 */
export function readingMinutes(g: Guide): number {
  const fromBlocks = (bs: Block[]): number =>
    bs.reduce(function count(n, b) {
      if (b.t === "p") return n + b.text.split(/\s+/).length;
      if (b.t === "note") return n + b.text.split(/\s+/).length;
      return n + b.items.join(" ").split(/\s+/).length;
    }, 0);

  const words =
    fromBlocks(g.intro) +
    g.sections.reduce((n, s) => n + s.h.split(/\s+/).length + fromBlocks(s.blocks), 0);

  return Math.max(1, Math.round(words / 200));
}

/** "17 November 2026" — the form the rest of the site writes dates in. */
export function guideDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
