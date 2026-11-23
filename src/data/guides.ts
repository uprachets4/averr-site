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
 * and a guide can be checked — `tools/keyword-map.test.ts` asserts the
 * shape rather than trusting that a new one was written correctly.
 *
 * (That line named `tools/guides.test.ts` for a while, which was never
 * written. The rules live in the keyword-map test because a guide's
 * target and the pillar it supports are the same decision as the rest
 * of the map, and one enforced file beats two aspirational ones.)
 *
 * Every factual claim in a guide is either something done on this
 * studio's own profile, or checked against the vendor's own
 * documentation on the date in `checked`. Where a guide states a rule
 * that Google can change, `checked` is what tells the next person how
 * stale it might be. Section 7 of the SEO checklist asks for a refresh
 * every six months; that date is the thing to refresh.
 */
import type { ServiceId } from "./serviceColors";

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
  /**
   * The service(s) this guide sells. A guide is a cluster page: it
   * earns traffic on a question and hands the reader up to the pillar
   * that answers it commercially. Before this field existed every
   * guide ended at /contact, so the traffic arrived and then had
   * nowhere service-shaped to go.
   *
   * One declaration drives four things: the "part of" link on the
   * guide, the guide list on the pillar page, the schema `about` edge,
   * and the readiness rule in the keyword-map test that stops a pillar
   * shipping without a cluster. Which is why it is a field and not a
   * link typed into each page.
   */
  svc: ServiceId[];
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
  /**
   * The closing paragraph, written for this guide.
   *
   * This was one hardcoded paragraph in `Guide.tsx` offering to set up
   * a Google Business Profile, which is right for exactly one of the
   * four guides. The other three closed by offering a reader who had
   * just finished an article on site speed, or Search Console, or
   * builders-versus-custom, something unrelated to what they had just
   * read — the weakest possible moment to lose them.
   *
   * It lives per guide rather than per service because the reader's
   * position is what the closer has to answer: someone who has just
   * read why their site is slow is not in the same place as someone
   * weighing Wix. `tools/keyword-map.test.ts` requires it to be
   * present and to differ from every other guide's, which is the rule
   * that would have caught the original.
   */
  close: string;
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
  /* Local visibility is the marketing service's own subject. This
     guide and the Search Console one are why Marketing has the
     strongest cluster and the weakest proof of the four. */
  svc: ["marketing"],
  close:
    "Setting up a Google Business Profile is part of what we do for clients in Toronto and the GTA, along with the website it points at. Thirty minutes on a call and you'll know what it takes.",
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

/**
 * Guide 2 — Search Console.
 *
 * Drawn from verifying averrstudios.com by DNS on Namecheap, getting
 * the sitemap accepted and the home page indexed, and watching /work
 * and /about sit in "Discovered — not indexed" for days. The waiting
 * is the part no guide mentions and the part everyone panics about,
 * so it gets a section.
 */
const searchConsole: Guide = {
  slug: "set-up-google-search-console",
  title: "How to set up Google Search Console, and what to actually look at",
  target: "set up google search console",
  svc: ["marketing"],
  close:
    "Search Console will tell you what Google thinks of your site. Acting on it — fixing what's broken, writing what's missing, watching whether it worked — is the part we do for businesses across the GTA. Thirty minutes on a call and you'll know where yours actually stands.",
  dek: "Search Console is the only place Google tells you what it thinks of your site. Setting it up takes twenty minutes; knowing which four screens matter saves you from the other thirty.",
  published: "2026-11-17",
  checked: "2026-11-17",
  og: "guide-search-console",
  intro: [
    {
      t: "p",
      text: "Analytics tells you what visitors did once they arrived. Search Console tells you something you cannot get anywhere else: which searches you appear in, where you rank, whether Google can read your pages at all, and what it is refusing to index. It is free, and for a new site it is the only honest feedback loop you have.",
    },
    {
      t: "p",
      text: "Most of it you will never need. Here is the setup, then the four screens worth opening.",
    },
  ],
  sections: [
    {
      h: "Choose a domain property, not a URL prefix",
      blocks: [
        {
          t: "p",
          text: "Search Console offers two kinds of property and the choice matters more than it looks.",
        },
        {
          t: "ul",
          items: [
            "A domain property covers everything on the domain: www and non-www, http and https, and every subdomain. One property, the whole picture. It can only be verified through DNS.",
            "A URL prefix property covers exactly one address. If you verify https://www.yoursite.com, data for the bare domain lands somewhere you are not looking.",
          ],
        },
        {
          t: "p",
          text: "Take the domain property. The DNS step is five minutes and it saves you from a split view of your own traffic later.",
        },
      ],
    },
    {
      h: "Verify it through DNS",
      blocks: [
        {
          t: "ol",
          items: [
            "In Search Console, add a property and choose Domain. Enter your domain without https or www.",
            "Google gives you a TXT record. Copy it.",
            "Open wherever your DNS lives — the registrar you bought the domain from, unless you moved it. Add a TXT record on the root of the domain, usually written as @, and paste the value.",
            "Save, go back to Search Console and press Verify. If it fails, wait and try again: DNS changes take time to spread, sometimes an hour.",
          ],
        },
        {
          t: "note",
          label: "What we did",
          text: "averrstudios.com is verified by DNS with a TXT record on Namecheap. It took one attempt and about ten minutes, most of which was waiting for the record to propagate.",
        },
      ],
    },
    {
      h: "Submit your sitemap, then leave it alone",
      blocks: [
        {
          t: "p",
          text: "Your sitemap is a list of every page you want indexed, usually at /sitemap.xml. Under Indexing, Sitemaps, enter sitemap.xml and submit it. Google will report how many URLs it discovered.",
        },
        {
          t: "p",
          text: "Discovered is not indexed. Those are different things and the gap between them is where new sites lose their nerve.",
        },
      ],
    },
    {
      h: "Why your pages say \"Discovered — not indexed\"",
      blocks: [
        {
          t: "p",
          text: "This is the status that worries people most, and usually it means nothing is wrong. Google knows the page exists and has not got round to crawling it. On a new domain with few links pointing at it, that queue is slow — days, sometimes weeks.",
        },
        {
          t: "p",
          text: "What actually helps, in order: links to the page from elsewhere on your own site, links from other sites, and time. What does not help is resubmitting it daily. You can request indexing for a specific URL, but there is a small daily limit and it does not jump the queue so much as join it.",
        },
        {
          t: "note",
          label: "What we are seeing",
          text: "Our home page was indexed within days of verification. Two other pages sat in \"Discovered — not indexed\" for over a week with nothing wrong with them. The fix was not a trick; it was adding internal links to them and waiting.",
        },
      ],
    },
    {
      h: "The four screens worth opening",
      blocks: [
        {
          t: "ol",
          items: [
            "Performance. Which searches showed your site, how often, where you ranked and how many people clicked. Nothing appears for the first while on a new site, and that is normal. Once it does, this is the report that tells you what to write next.",
            "Pages, under Indexing. Which pages are indexed and, for the ones that are not, the reason. Read the reasons; most are informational rather than errors.",
            "Enhancements. If you have structured data — breadcrumbs, FAQs, videos — this is where Google reports whether it parsed them. Errors here are worth fixing because they are usually one line of markup.",
            "Experience, Core Web Vitals. Real-visitor speed. It stays empty until you have enough traffic for Google to have data, which on a new site can take months.",
          ],
        },
      ],
    },
    {
      h: "A sensible rhythm",
      blocks: [
        {
          t: "ul",
          items: [
            "Weekly, for five minutes: has anything moved from not-indexed to indexed, and are there new errors.",
            "Monthly, for twenty: read the Performance report. Find searches where you get impressions but few clicks — that usually means your title is not answering the search, and a better title is the cheapest ranking work there is.",
            "After publishing anything: nothing. The sitemap tells Google. Requesting indexing on every new page is a habit worth not forming.",
          ],
        },
      ],
    },
    {
      h: "What to ignore",
      blocks: [
        {
          t: "ul",
          items: [
            "Daily rank fluctuation. The number moves constantly and means nothing over a few days.",
            "Crawl stats, unless something is broken. Interesting, rarely actionable for a small site.",
            "Any email offering to fix your Search Console problems. Google does not send those.",
          ],
        },
      ],
    },
  ],
};

/**
 * Guide 3 — site speed.
 *
 * The Core Web Vitals thresholds in this guide were checked against
 * current sources on the `checked` date. They have been stable for
 * some time — INP replaced FID in March 2024 and the numbers have not
 * moved since — but they are Google's to change, which is exactly
 * what `checked` is published for.
 *
 * The before-and-after is this site's own: 63 to 93 on mobile.
 */
const siteSpeed: Guide = {
  slug: "why-your-website-is-slow",
  title: "Why your website is slow, and what actually fixes it",
  target: "why is my website slow",
  svc: ["websites"],
  close:
    "Everything above is ordinary work, and we do it while building rather than coming back to it afterwards — which is why this site scores what it does. If you'd rather not audit your own images and scripts, thirty minutes on a call and you'll know what yours needs.",
  dek: "Most speed advice is a list of fixes with no order. Here are the three numbers Google measures, the handful of things that actually cause a slow site, and the fixes ranked by how much they pay back.",
  published: "2026-11-17",
  checked: "2026-11-17",
  og: "guide-site-speed",
  intro: [
    {
      t: "p",
      text: "A slow site costs you twice: visitors leave before it loads, and Google knows they did. The fix is rarely the thing people reach for first, which is usually compressing a few images and hoping.",
    },
  ],
  sections: [
    {
      h: "The three numbers Google measures",
      blocks: [
        {
          t: "p",
          text: "Google's Core Web Vitals are three measurements of how a page feels to a real visitor. A page passes only when all three clear their threshold for at least 75% of real visits, measured over a rolling four weeks.",
        },
        {
          t: "ol",
          items: [
            "Largest Contentful Paint — how long until the biggest thing on screen appears. Good is 2.5 seconds or less.",
            "Interaction to Next Paint — how long the page takes to respond when someone taps or clicks. Good is 200 milliseconds or less. This one replaced an older metric in 2024 and is now the one sites fail most often.",
            "Cumulative Layout Shift — how much the page jumps around while loading. Good is 0.1 or less. This is the one that makes people tap the wrong button.",
          ],
        },
      ],
    },
    {
      h: "Lab scores and real visitors are not the same thing",
      blocks: [
        {
          t: "p",
          text: "Run your site through PageSpeed Insights and you get two things: a lab score out of 100 from a simulated load, and, if Google has enough data, field data from actual Chrome users.",
        },
        {
          t: "p",
          text: "The lab score is the one everybody screenshots. The field data is the one that counts, because it is what Google uses. A new site will have no field data at all for months — that is not a failure, it is an empty sample.",
        },
        {
          t: "note",
          label: "Use the lab score for what it is good at",
          text: "The number is noisy and re-running it gives different answers. What is useful is the list of opportunities underneath it, which does not move around and tells you where the weight actually is.",
        },
      ],
    },
    {
      h: "What actually makes sites slow",
      blocks: [
        {
          t: "p",
          text: "In rough order of how often it is the culprit:",
        },
        {
          t: "ul",
          items: [
            "Images shipped at far larger dimensions than they are displayed at, in formats from a decade ago. One hero photo can outweigh everything else on the page combined.",
            "Third-party scripts. Chat widgets, pop-up tools, analytics, pixels, review embeds, font services. Each one is a request to someone else's server, and you do not control how slow their day is.",
            "Fonts loaded from another domain, which adds a connection before any text can be drawn.",
            "Too much JavaScript running before the page becomes usable — the usual cause of a bad Interaction to Next Paint, because the browser is busy and cannot answer the tap.",
            "No caching, so every visit downloads everything again.",
            "Content with no reserved space — images without dimensions, banners that appear late — which is what layout shift actually is.",
          ],
        },
      ],
    },
    {
      h: "The fixes, in order of payback",
      blocks: [
        {
          t: "ol",
          items: [
            "Fix the images. Export at the size they are actually shown, in a modern format, and set width and height on every one so the browser reserves the space. This is usually the single biggest win and it is the least technical.",
            "Remove third-party scripts you are not using. Audit what is loading. Most sites carry at least one tool nobody has opened in a year.",
            "Host your fonts yourself and load only the weights you use. Two weights, not seven.",
            "Defer whatever does not need to run before the page is usable, and only preload the one or two things that genuinely block the first paint. Preloading everything is the same as preloading nothing.",
            "Turn on long-lived caching for anything with a fingerprinted filename.",
            "Reserve space for anything that loads late — embeds, banners, consent notices.",
          ],
        },
      ],
    },
    {
      h: "What we did on this site",
      blocks: [
        {
          t: "p",
          text: "This site went from 63 to 93 on mobile. In order of what moved the number: logos converted to a modern format with their dimensions set, fonts moved onto our own domain with only the two headline faces preloaded, long-term caching for code and fonts, and holding the 3D scenes still on machines without a graphics card so they do not fight for the processor during load.",
        },
        {
          t: "p",
          text: "None of those was clever. They were the ordinary list, done in order, measured after each one.",
        },
      ],
    },
    {
      h: "How to check yours in ten minutes",
      blocks: [
        {
          t: "ol",
          items: [
            "Run your busiest page through PageSpeed Insights and look at the mobile tab. Mobile is where the problems are.",
            "Ignore the score. Read the opportunities, sorted by the time they claim to save.",
            "Check whether there is field data. If there is, that is your real standing; if not, come back when you have traffic.",
            "Open the page on a phone on mobile data, not office Wi-Fi. It is the fastest honesty check there is.",
          ],
        },
      ],
    },
  ],
};

/**
 * Guide 4 — the comparison.
 *
 * Section 7 of the SEO checklist calls for comparison pages because
 * people search them immediately before hiring someone. The risk with
 * a page like this, written by a studio that sells the custom option,
 * is that it argues for itself; so it says plainly where the builder
 * is the right answer, and the summary sends some readers away. A
 * comparison nobody could lose is not a comparison.
 *
 * No figures: the site states no prices anywhere, and a cost argument
 * made in generalities is more honest than one made with numbers we
 * would have to invent for somebody else's product.
 */
const wixVsCustom: Guide = {
  slug: "wix-vs-custom-website",
  title: "Wix vs a custom website: which one your business actually needs",
  target: "wix vs custom website",
  /* The clearest cluster page on the site: someone comparing a
     builder to a custom build is one step from hiring. */
  svc: ["websites"],
  close:
    "If the line in this guide puts you on the custom side, that's what we build. If it puts you on the builder side, we'll say so on the call rather than sell you something you don't need yet. Thirty minutes either way.",
  dek: "Site builders are genuinely good at some things and quietly expensive at others. Here is where the line falls, written by people who sell the custom side and will tell you when you do not need it.",
  published: "2026-11-17",
  checked: "2026-11-17",
  og: "guide-wix-vs-custom",
  intro: [
    {
      t: "p",
      text: "We build custom websites, so treat the source accordingly. The useful version of this comparison is not which is better — it is which problems each one solves, and at what point a builder stops being the cheaper option.",
    },
  ],
  sections: [
    {
      h: "What a builder is genuinely good at",
      blocks: [
        {
          t: "p",
          text: "Wix, Squarespace and the rest are good products, and for a real set of businesses they are the correct answer. Specifically:",
        },
        {
          t: "ul",
          items: [
            "You need to exist online this week and the site is mostly a business card.",
            "You will edit it yourself, often, and you do not want to ask anyone.",
            "The site has a handful of pages and no unusual behaviour.",
            "You are testing whether the business works at all. Spending on a custom site before you know is the wrong order.",
          ],
        },
        {
          t: "p",
          text: "If you recognise your business in that list, use a builder. Spend the difference on photography and on getting your Google Business Profile right, which will bring in more work than either kind of site will in the first year.",
        },
      ],
    },
    {
      h: "Where builders start to cost you",
      blocks: [
        {
          t: "p",
          text: "The bill is rarely the problem. The cost shows up in four other places.",
        },
        {
          t: "ul",
          items: [
            "Speed. Templates ship code for every feature the template supports, whether or not you use them, plus the apps you bolt on. You can improve it at the edges; you cannot remove what you do not control.",
            "The ceiling. Everything is easy until you want something the template did not anticipate, and then it is either impossible or an app subscription with its own loading cost.",
            "Sameness. Templates are popular, which means your competitor three postal codes away may be using the same one. For some businesses that does not matter. If you are asking people to trust you with a large job, it does.",
            "Rent. You are paying monthly for the platform and often for each app, forever, and the site stops working if you stop.",
          ],
        },
      ],
    },
    {
      h: "What \"custom\" actually means",
      blocks: [
        {
          t: "p",
          text: "It does not mean a designer picked a nicer template. It means the pages are built in code for your business, which has three practical consequences:",
        },
        {
          t: "ol",
          items: [
            "Nothing loads that your site does not use, which is most of the speed difference.",
            "Anything you can describe can be built — the booking flow your business actually uses, not the nearest one an app offers.",
            "You are not renting the structure. Hosting is yours and the site is yours.",
          ],
        },
        {
          t: "p",
          text: "The trade-off is real: it takes weeks rather than an afternoon, it costs more up front, and changing the structure later means asking someone rather than dragging a block. A good build hands you the parts you will actually want to edit — text, images, posts — and keeps the structure where it belongs.",
        },
      ],
    },
    {
      h: "The questions that actually decide it",
      blocks: [
        {
          t: "ul",
          items: [
            "Does the site need to do something, or only say something? Bookings that land in your calendar, a quote tool, a customer portal — the more it does, the sooner a builder runs out.",
            "How much is one customer worth? If a single job pays for the difference, the difference is not really the question.",
            "Who edits it, and how often? Weekly edits by you is a point for a builder. Twice a year is not.",
            "Are you competing on trust? Law, health, finance, anything involving someone's home. Looking like everyone else is a cost you cannot see on the invoice.",
            "Is speed going to matter? If most of your traffic is phones on mobile data, it already does.",
          ],
        },
      ],
    },
    {
      h: "Moving from one to the other",
      blocks: [
        {
          t: "p",
          text: "If you are already on a builder and outgrowing it, you do not lose what you have built. Your domain, your email, your photos and any copy worth keeping all move. The part that needs care is redirects: every old page needs to point at its new address, or you hand back the search rankings you spent years earning.",
        },
        {
          t: "p",
          text: "Anyone rebuilding your site should raise redirects before you do. If they do not, ask.",
        },
      ],
    },
    {
      h: "The honest summary",
      blocks: [
        {
          t: "ul",
          items: [
            "Early, simple, self-edited, testing the idea: use a builder, and do not feel bad about it.",
            "The site has to do something, or you are competing on trust, or speed is costing you enquiries: a custom build pays for itself and a builder will keep charging you for the gap.",
            "Somewhere in between: start with the builder and revisit when you hit the ceiling. You will know the exact week you hit it.",
          ],
        },
      ],
    },
  ],
};

/**
 * The Web Apps cluster.
 *
 * Both of these exist to unlock /services/web-apps: three case files
 * carry web-app work as the lead service and no guide supported it, so
 * the readiness rule in `tools/keyword-map.test.ts` would not let that
 * page ship. Which is the rule working — a pillar with nothing linking
 * up to it is a leaf.
 *
 * They are the two questions that actually precede hiring someone to
 * build software: whether the thing you need is a site or an app, and
 * the moment a spreadsheet stops being the right tool. Neither is a
 * pitch; both tell a reader when to keep what they have.
 */
const websiteVsWebApp: Guide = {
  slug: "website-vs-web-app",
  title: "Website or web app: which one your business actually needs",
  target: "website vs web app",
  svc: ["webApps"],
  close:
    "If the question at the end of this points you at an app, that's the kind of thing we build — Sift, CadenceStack and CapitalCommand are all on this site. If it points you at a website and a form, say so on the call and we'll scope that instead.",
  dek: "The difference that matters is not technical and nobody asks it plainly: does anyone log in and change something? Here is the line, and the expensive mistake people make on both sides of it.",
  published: "2026-11-19",
  checked: "2026-11-19",
  og: "guide-website-vs-web-app",
  intro: [
    {
      t: "p",
      text: "Most people arrive at this question having been quoted wildly different numbers by different people, which usually means they were quoted for different things. The words are the problem: a website and a web app are built the same way, by the same people, in the same languages. What separates them is what the thing does once it is live.",
    },
  ],
  sections: [
    {
      h: "The difference, in one question",
      blocks: [
        {
          t: "p",
          text: "Does somebody log in and change something that other people then see?",
        },
        {
          t: "p",
          text: "If no, you need a website. It can be beautiful, it can be long, it can have a booking form and a map and a gallery — it is still a website, because it tells people things and the things it tells them change only when you change them.",
        },
        {
          t: "p",
          text: "If yes, you need a web app. The moment there are accounts, and what you see depends on who you are, you have crossed into software. Everything expensive about an app follows from that one fact.",
        },
      ],
    },
    {
      h: "Signs it is a website",
      blocks: [
        {
          t: "ul",
          items: [
            "You want to be found, be credible, and get calls or bookings.",
            "The content changes weekly at most, and only you change it.",
            "Nobody needs an account to get value from it.",
            "The most complex thing it does is take a form and email it to you.",
            "You can describe everything it should do in one paragraph without using the word 'dashboard'.",
          ],
        },
      ],
    },
    {
      h: "Signs it is a web app",
      blocks: [
        {
          t: "ul",
          items: [
            "Different people see different things depending on who they are.",
            "Something has a status that moves — pending, approved, shipped, paid.",
            "Two people might need to work on the same record without overwriting each other.",
            "You care what happened last Tuesday and who did it.",
            "You are currently doing the job in a spreadsheet and the spreadsheet is losing.",
          ],
        },
      ],
    },
    {
      h: "The expensive mistake, in both directions",
      blocks: [
        {
          t: "p",
          text: "Building an app when a site and a form would do is the one people warn you about, and it is real: you pay for accounts, permissions and states that nobody uses, and you end up maintaining software instead of running a business.",
        },
        {
          t: "p",
          text: "The other direction is more common and quieter. A site grows one app-shaped feature, then another, each one added as a plugin or an embed because the site already exists. Two years later the business runs on six tools that do not talk to each other, and the real cost is not the tools — it is the half-hour a day somebody spends copying between them.",
        },
        {
          t: "note",
          label: "The honest middle case",
          text: "Plenty of businesses need a website with exactly one app-like feature — a client portal, a quote builder, a booking system with real availability. That is a website with a small app attached, and it should be scoped as such rather than as either extreme. If someone quotes you a full platform for it, get a second opinion.",
        },
      ],
    },
    {
      h: "What actually changes when it is an app",
      blocks: [
        {
          t: "p",
          text: "This is the part that explains the price difference, and it is worth understanding before anyone quotes you:",
        },
        {
          t: "ol",
          items: [
            "Accounts. Signing up, signing in, forgetting a password, leaving the company. Each one is a path that has to work.",
            "Permissions. Who can see what, and who can change what. This is where most of the thinking goes, and it is invisible in a demo.",
            "State. A thing that can be pending or approved can also be wrongly approved, approved twice, or approved by someone who should not have.",
            "History. Knowing who changed what and when, which you will want the first time something is wrong.",
            "What happens when it breaks. A broken website is embarrassing. A broken app stops people working.",
          ],
        },
        {
          t: "p",
          text: "None of that is visible on a page. All of it is why an app takes longer than a site, and why the honest answer to 'how long' is that it depends on how many of those five you actually need.",
        },
      ],
    },
    {
      h: "How to come to a call ready",
      blocks: [
        {
          t: "p",
          text: "You do not need a spec. You need the answer to three things, and if you have them the scope writes itself:",
        },
        {
          t: "ol",
          items: [
            "Who logs in, and what are they trying to get done in under a minute?",
            "What is the one record the whole thing revolves around — a job, an order, a client, an application?",
            "What are you doing by hand today that you would stop doing?",
          ],
        },
        {
          t: "p",
          text: "If you can answer those, you know which of the two you need, and so will anyone you ask.",
        },
      ],
    },
  ],
};

const spreadsheetToSoftware: Guide = {
  slug: "when-to-replace-a-spreadsheet",
  title: "When to stop running your business on a spreadsheet",
  target: "replace spreadsheet with custom software",
  svc: ["webApps"],
  close:
    "Replacing a spreadsheet that is still working is a waste of money, and we'll tell you if that's what you have. If two of the four signs above are true, that's the conversation worth having — it's most of what we build.",
  dek: "Spreadsheets are better tools than people admit, right up to a specific breaking point. Here are the four signs you have passed it, and what replacing one actually buys you.",
  published: "2026-11-19",
  checked: "2026-11-19",
  og: "guide-replace-spreadsheet",
  intro: [
    {
      t: "p",
      text: "Almost every business we build software for was running the job in a spreadsheet first, and that is the correct order. A spreadsheet is the cheapest way to find out what the work actually is. The question is never whether spreadsheets are good — it is whether yours has stopped being a tool and started being a liability.",
    },
  ],
  sections: [
    {
      h: "What a spreadsheet is genuinely better at",
      blocks: [
        {
          t: "p",
          text: "Before the case against, the case for, because it is strong and it is why you should not call anyone yet if these are true:",
        },
        {
          t: "ul",
          items: [
            "The process is still changing. A spreadsheet changes in seconds; software changes in days.",
            "One person uses it, and that person is you.",
            "You need to see everything at once and do arithmetic on it.",
            "The job is genuinely a table. Not everything is.",
            "You are not sure the process will exist in six months.",
          ],
        },
        {
          t: "p",
          text: "If that is your situation, keep the spreadsheet and spend the money on something that brings in work.",
        },
      ],
    },
    {
      h: "The four signs you have outgrown it",
      blocks: [
        {
          t: "ol",
          items: [
            "Two people need it at the same time, and you have started sending versions by email or keeping a 'master' copy.",
            "You copy and paste between sheets, or between the sheet and something else, as part of the normal week.",
            "There is a tab nobody will touch because they do not know what it will break.",
            "You are the only person who understands how it works, and you have caught yourself explaining it for the third time.",
          ],
        },
        {
          t: "p",
          text: "One of those is normal. Two is a signal. Three or four and the spreadsheet is now the bottleneck rather than the tool, and the cost is already being paid — in the time it takes, and in the mistakes nobody catches.",
        },
        {
          t: "note",
          label: "The sign that is actually a risk",
          text: "The fourth one is different in kind. When one person is the only one who knows how the system works, the business has a single point of failure that no backup covers. That is worth fixing on its own, whether the fix is software or just writing it down.",
        },
      ],
    },
    {
      h: "What you are actually buying, and it is not features",
      blocks: [
        {
          t: "p",
          text: "People expect software to do more than the spreadsheet. The useful version usually does less, and the value is in what it refuses:",
        },
        {
          t: "ul",
          items: [
            "You cannot enter a date that is not a date, or a status that is not one of the real statuses.",
            "Two people can work at once without one of them losing an hour.",
            "Every change is attributable, so 'who moved this' has an answer.",
            "The thing you do forty times a week takes one click instead of a copy, a paste and a check.",
            "Somebody new can be shown how to use it in ten minutes.",
          ],
        },
        {
          t: "p",
          text: "A spreadsheet lets you do anything, which is exactly why it lets you do the wrong thing. Constraints are the product.",
        },
      ],
    },
    {
      h: "The mistake that wastes the money",
      blocks: [
        {
          t: "p",
          text: "The most common failure is rebuilding the spreadsheet as software — same columns, same tabs, same workarounds, now in a browser and harder to change. It feels safe because it is familiar, and it buys almost nothing.",
        },
        {
          t: "p",
          text: "Your spreadsheet is not the process. It is the shape the process took when a grid was the only tool available. Half of its columns exist to work around that grid, and those are the ones that should not survive the move. Anyone who takes your sheet and offers to build exactly that has skipped the part of the job that matters.",
        },
      ],
    },
    {
      h: "A cheap first step, before you hire anyone",
      blocks: [
        {
          t: "p",
          text: "This costs nothing and will save you money whoever you end up working with:",
        },
        {
          t: "ol",
          items: [
            "Write down the five things you do with the spreadsheet in a normal week, in the order you do them.",
            "Next to each, write how long it takes and what goes wrong when it goes wrong.",
            "Circle anything that is you moving data rather than you making a decision.",
          ],
        },
        {
          t: "p",
          text: "What you circled is the scope. Bring that to any conversation and you will get a real quote instead of a guess, because you will have described the work rather than the table.",
        },
      ],
    },
  ],
};

/**
 * Guide 7 — what belongs on a contractor's home page.
 *
 * Written from the two contractor sites this studio has actually
 * shipped — Express Contractors and CG Walls & Floors — which is the
 * only reason it is worth publishing. There is no shortage of
 * "10 things every contractor website needs" content; what almost none
 * of it has is a page someone built, in this market, and can point at.
 *
 * So every section here is a decision made on one of those two builds,
 * and the guide says which. Where a claim is general rather than
 * observed, it is written as reasoning the reader can check against
 * their own business, not as a result.
 *
 * The only figures are Express Contractors' own: the 5.0 from 203
 * Google reviews shown on their site, the eleven services, and Anas's
 * licence and years in the trade. No invented conversion numbers,
 * because the honest answer is that two sites is not a sample.
 *
 * Target is informational — someone planning a page, one or two steps
 * further out than the Wix comparison. "contractor website design
 * toronto" belongs to the CG case file and
 * "appliance installer website design" to Express, so this takes
 * neither; `tools/keyword-map.test.ts` would fail if it did.
 */
const contractorHomePage: Guide = {
  slug: "what-to-put-on-a-contractor-website",
  title: "What to put on a contractor's home page, section by section",
  target: "what to put on a contractor website",
  svc: ["websites"],
  close:
    "If you want this structure applied to your own trade rather than read in the abstract, send us the photos you already have on your phone and the five jobs you most want more of. That is genuinely enough to lay out a first version, and the call to walk through it is thirty minutes.",
  dek: "Eight sections, in the order a homeowner reads them, drawn from two contractor sites we built for the GTA — plus the four things worth leaving off.",
  published: "2026-11-21",
  checked: "2026-11-21",
  og: "guide-contractor-home-page",
  intro: [
    {
      t: "p",
      text: "A homeowner landing on a contractor's site is answering one question: can this person be trusted inside my house, with my money, on a job I cannot inspect myself. Almost everything that belongs on the page is evidence for that question, and almost everything that does not belong is a company talking about itself.",
    },
    {
      t: "p",
      text: "This is the order we have used on two builds for GTA trades. Take the order more seriously than the wording — the sections earn their place by answering the homeowner's next doubt, one after another.",
    },
  ],
  sections: [
    {
      h: "Open with the work, not the company",
      blocks: [
        {
          t: "p",
          text: "The first screen should show the job being done well. Not a stock kitchen, not a van with your logo, and not a sentence about your commitment to quality — the work.",
        },
        {
          t: "p",
          text: "This matters more for trades than for almost any other business, because the homeowner cannot judge your competence from your words. They can judge it from a photograph of a finished edge.",
        },
        {
          t: "note",
          label: "What we did",
          text: "For Express Contractors, the hero draws a gas install as you scroll — from the meter, through the line, to a correct blue flame at the end. A visitor sees a properly executed install before reading a single word. CG Walls & Floors opens on the finished rooms rather than on the company, and the whole page is styled closer to an interior design firm than to a trades site.",
        },
      ],
    },
    {
      h: "Say what you are licensed to do, early",
      blocks: [
        {
          t: "p",
          text: "Licences, registrations and years in the trade are the strongest trust signal a contractor has, and they are usually buried in an About page nobody opens. Put them where the homeowner is already looking.",
        },
        {
          t: "p",
          text: "Be specific and verifiable. A registration number a homeowner can check beats a badge graphic, and naming the body that issued it beats the word \"certified\" on its own.",
        },
        {
          t: "note",
          label: "What we did",
          text: "Express Contractors leads with Anas being a licensed gas fitter, TSSA registered, with more than twenty years in the trade. For gas work that is not a credential, it is the whole permission to be in the room.",
        },
      ],
    },
    {
      h: "One block per service, each with the detail that matters",
      blocks: [
        {
          t: "p",
          text: "A list of service names tells a homeowner nothing. \"Plumbing · Electrical · Renovation\" could describe any of four hundred businesses in the GTA. What converts is a short block per service that says what is included and names the one thing that goes wrong when it is done badly.",
        },
        {
          t: "p",
          text: "That one detail does two jobs at once: it answers a practical question, and it demonstrates you know the job well enough to know where it fails.",
        },
        {
          t: "note",
          label: "What we did",
          text: "Express Contractors lists eleven services — ranges, gas runs, laundry, water heaters and the rest — and each one states what is supplied plus the detail that matters for that specific install. It is the longest part of the page and the part that does the most work.",
        },
      ],
    },
    {
      h: "Show the parts nobody sees",
      blocks: [
        {
          t: "p",
          text: "Every competitor shows the finished result. Almost none show the work behind it, which is exactly where a good contractor is separated from a cheap one — and exactly what the homeowner is most afraid of getting wrong.",
        },
        {
          t: "p",
          text: "Use real job photographs from your own phone, and label where the work is. Unlabelled photos of pipework read as clutter; the same photo with a line of text explaining what you are looking at reads as expertise.",
        },
        {
          t: "note",
          label: "What we did",
          text: "A whole section of the Express Contractors site is given to this, under the heading \"the parts you never see\" — real job photos, labelled at the point where the work actually is. There is also a plainly written standard: vented outside, fed to code, supported every run. Three short phrases that tell a homeowner what they are buying.",
        },
      ],
    },
    {
      h: "Reviews, with the number and where they came from",
      blocks: [
        {
          t: "p",
          text: "Ratings only persuade when they are checkable. A row of stars drawn in the design persuades nobody, because anyone can draw stars. A rating, the count behind it, and the platform it came from is a different claim entirely.",
        },
        {
          t: "ul",
          items: [
            "Give the rating and the number of reviews, not just the rating. \"5.0\" alone is weaker than \"5.0 from 203\".",
            "Name the platform, and make it the place a visitor can go and check.",
            "Quote two or three reviews in full rather than cropping them to the flattering clause.",
            "Use real names and the town the job was in, with permission. \"Sarah M., Oakville\" outperforms \"Happy Customer\".",
          ],
        },
        {
          t: "note",
          label: "What we did",
          text: "Express Contractors has 5.0 from 203 Google reviews, and the site shows the figure, the count and the source, with featured quotes carried in full. CG Walls & Floors had no review history at the time, so we started one properly rather than inventing social proof: a Google Business Profile, seeded with a real review from a real homeowner.",
        },
      ],
    },
    {
      h: "Make the next step one tap, and say what happens after it",
      blocks: [
        {
          t: "p",
          text: "Most of your traffic is a phone. The number should be tappable, visible without scrolling, and repeated at the end of the page — a homeowner who has just finished reading should not have to go hunting.",
        },
        {
          t: "p",
          text: "Then answer the question that actually stops people calling, which is not price. It is not knowing what the call will be like. Lay out the steps from first contact to finished job, so the homeowner knows what they are agreeing to.",
        },
        {
          t: "note",
          label: "What we did",
          text: "Express Contractors has tap-to-call throughout, a short booking form that asks only for the appliance, the town and the timing, and a four-step sequence stated plainly: call, quote, install, and test it together at the end. The last step is there because a homeowner wants to know the job gets checked in front of them.",
        },
      ],
    },
    {
      h: "Name the area you actually cover",
      blocks: [
        {
          t: "p",
          text: "Vagueness here costs real calls in both directions. \"Serving the Greater Toronto Area and surrounding regions\" makes someone in Niagara guess, and guessing usually means closing the tab. It also brings in enquiries from outside your range that you then have to turn down.",
        },
        {
          t: "p",
          text: "Name the towns. This is also the single most useful thing you can do for local search, because the places you serve are the words people are typing.",
        },
        {
          t: "note",
          label: "What we did",
          text: "Express Contractors has a coverage map showing the GTA, the Hamilton base and Niagara — so the answer to \"do you come out to me\" is visible rather than inferred.",
        },
      ],
    },
    {
      h: "What to leave off",
      blocks: [
        {
          t: "p",
          text: "Four things take up room on most contractor sites and earn none of it.",
        },
        {
          t: "ul",
          items: [
            "Stock photography. A homeowner can tell, and the moment they can tell they start wondering why you have no photos of your own work.",
            "A mission statement. Nobody chose a contractor because of one. The licence, the photos and the reviews are doing this job already.",
            "A blog you will not write. Three posts from two years ago reads as a business that stopped paying attention. If you want to publish, publish finished jobs.",
            "A hero slider. Three messages rotating past is three messages nobody reads, and the images usually arrive slowly on mobile data. Pick the strongest one and let it sit still.",
          ],
        },
        {
          t: "p",
          text: "The test for anything you are unsure about: does it help a homeowner decide you can be trusted in their house? If it does, keep it and give it room. If it is there because websites usually have one, it goes.",
        },
      ],
    },
  ],
};

/**
 * Guide 8 — build or buy.
 *
 * The Web Apps counterpart to the Wix comparison, and written on the
 * same terms: this studio sells the build side, so the guide has to
 * say plainly where buying wins, and the summary has to be capable of
 * sending a reader away. A comparison nobody could lose is not a
 * comparison.
 *
 * The argument came out of the case files rather than being imposed on
 * them. All three webApps-led projects — Sift, CadenceStack and
 * CapitalCommand — had mature off-the-shelf tools available in their
 * category and were built anyway, and the stated problem in each is
 * the same shape: the existing tools optimise for something adjacent
 * to what the client needed. Volume rather than precision; typing
 * rather than positioning; one loop where research and execution
 * should be two.
 *
 * That is a real test a reader can apply to their own situation, and
 * it is the only reason to build in here that is given any weight.
 * The commoner reasons — we are unique, it will be cheaper, we want to
 * own it — are argued against, because they are the ones that produce
 * projects nobody should have started.
 *
 * No figures. The case files carry one (Sift's ATS improvement) but it
 * measures an outcome of that product, not anything about the
 * build-or-buy decision, so quoting it here would be borrowing
 * authority from an unrelated number.
 */
const buildVsBuy: Guide = {
  slug: "build-vs-buy-software",
  title: "Build or buy: when custom software is worth it, and when it is not",
  target: "build vs buy software",
  svc: ["webApps"],
  close:
    "If you have run the test in the last section and the answer came out on the build side, the next step is a scoping call rather than a quote — thirty minutes to work out whether the thin layer is really thin. If it came out on the buy side, you have saved yourself a project, and we would rather you spent the money on the tool.",
  dek: "Buying wins most of the time. There is one reason to build that holds up, and three projects we have shipped that met it — plus the common reasons that do not.",
  published: "2026-11-22",
  checked: "2026-11-22",
  og: "guide-build-vs-buy",
  intro: [
    {
      t: "p",
      text: "We build custom software, so read this accordingly. The useful version of this question is not which is better — it is what you have to be able to say about your own situation before building is the rational choice, and most businesses cannot say it.",
    },
  ],
  sections: [
    {
      h: "Buy, almost always",
      blocks: [
        {
          t: "p",
          text: "An established tool in a mature category has had years of other people's problems found and fixed in it. You are not paying for the features you can see on the pricing page; you are paying for the edge cases somebody already hit.",
        },
        {
          t: "ul",
          items: [
            "It works on the day you pay for it, rather than in some number of weeks.",
            "Someone else carries the maintenance, the security patching and the compliance work.",
            "If it turns out to be wrong, you have lost a subscription rather than a project.",
            "Your team may already know it, which is a real cost you only notice when it is absent.",
          ],
        },
        {
          t: "p",
          text: "If a tool does roughly what you need and the gap is irritating rather than structural, buy it and live with the irritation. The irritation is cheaper than it looks and the project is more expensive than it looks.",
        },
      ],
    },
    {
      h: "The reasons to build that do not hold up",
      blocks: [
        {
          t: "p",
          text: "Four arguments come up constantly. None of them is sufficient on its own, and together they are how a business ends up two-thirds of the way through something it did not need.",
        },
        {
          t: "ul",
          items: [
            "\"Our business is unique.\" Almost every business believes this and most are unique in their market rather than in their software. Being unusual in how you sell is not the same as being unusual in how you track what you sold.",
            "\"It will be cheaper than subscriptions eventually.\" Only if nothing changes and nobody maintains it, and both of those are false. Software you own is a thing you keep paying for in attention.",
            "\"We want to own it.\" Ownership is real, but it is a benefit you feel in year three and a cost you feel immediately. It is a tiebreaker, not a reason.",
            "\"The tool is missing one feature we need.\" One missing feature is an argument for asking the vendor, or for a small integration. It is not an argument for rebuilding the other forty features you are currently getting for free.",
          ],
        },
      ],
    },
    {
      h: "The one reason that does hold up",
      blocks: [
        {
          t: "p",
          text: "Building makes sense when every tool in the category is optimising for something adjacent to what you actually need — not missing a feature, but pointed at a slightly different problem. When that is true, buying does not get you most of the way there. It gets you somewhere else, efficiently.",
        },
        {
          t: "p",
          text: "This is narrower than it sounds, and it is the test worth applying honestly, because it is the only one of these arguments that does not dissolve when you look at it closely.",
        },
        {
          t: "note",
          label: "What we did",
          text: "All three of the software products in our work met this test, and each one for the same reason in a different market. For Sift, every job-search tool in reach was built around auto-apply — optimising for volume, where the problem was precision. For CadenceStack, LinkedIn tools solve the typing, where the client's problem was positioning: knowing what to say next. For CapitalCommand, investing apps collapse research and execution into one loop, and the whole point was to put those steps back in order. In each case a tool existed, worked well, and was aimed a few degrees off.",
        },
      ],
    },
    {
      h: "How to tell which situation you are in",
      blocks: [
        {
          t: "p",
          text: "Two questions separate the real version of this from the flattering version.",
        },
        {
          t: "ol",
          items: [
            "Can you name, in one sentence, the thing every tool in the category is optimising for? If you cannot, you have not looked at enough of them to know whether yours is different.",
            "Have you run at least two of them properly — not a trial, actual work — until you hit the wall? The wall is the evidence. Without it you are comparing your idea of a tool against your idea of a build, and your idea of a build is always better behaved than the real one.",
          ],
        },
        {
          t: "p",
          text: "If you have hit the wall in two tools and can describe it in the same sentence both times, that is the signal. If you have not, the next step is to go and hit it, not to start building.",
        },
      ],
    },
    {
      h: "What building actually costs",
      blocks: [
        {
          t: "p",
          text: "The build is the visible part and usually not the expensive part. What you are taking on alongside it:",
        },
        {
          t: "ul",
          items: [
            "Every decision the tool was making for you. Permissions, exports, what happens on a failed payment, what an admin can undo. Each is small and there are hundreds.",
            "Maintenance, which does not stop. Dependencies age, browsers change, and a thing nobody is tending quietly stops working.",
            "The gap before it is useful. A tool is useful the day you buy it. A build is useful at the end, and you are running the business in between.",
            "Being the person who fixes it. Whoever builds it is now the support line, including the version of that where they are on holiday.",
          ],
        },
        {
          t: "p",
          text: "None of this is an argument against building. It is the argument for building the smallest possible thing, which is the next section.",
        },
      ],
    },
    {
      h: "The middle path, which is usually the right one",
      blocks: [
        {
          t: "p",
          text: "Build or buy is rarely the actual choice. The useful version is: buy the commodity, build only the part that is genuinely yours, and connect them.",
        },
        {
          t: "p",
          text: "Payments, email, authentication, storage, calendars, accounting — buy all of it. The thing worth building is the layer where your business does something nobody has a product for, and that layer is usually much thinner than it feels at the start.",
        },
        {
          t: "p",
          text: "A thin custom layer over bought infrastructure gets you the thing you actually need while leaving the hundreds of small decisions with the vendors who already made them. It is also much easier to abandon if you were wrong, which is worth more than it sounds.",
        },
      ],
    },
    {
      h: "What to work out before you talk to anyone",
      blocks: [
        {
          t: "p",
          text: "Whether you end up buying or building, this is the preparation that makes the conversation useful rather than speculative.",
        },
        {
          t: "ol",
          items: [
            "Write down the two tools you have actually used for this and the exact point each one stopped working for you.",
            "Write the sentence describing what every tool in the category optimises for, and the sentence describing what you need optimised instead. If those two sentences are the same, stop here — you are buying.",
            "List the parts of the job that are pure commodity. That is the part nobody should build.",
            "What is left is the scope, and it is usually a quarter of what you expected.",
          ],
        },
        {
          t: "p",
          text: "Bring that to any developer and you will get a real answer instead of an estimate shaped like one, because you will have described the problem rather than the software you imagined solving it.",
        },
      ],
    },
  ],
};

/**
 * Guide 9 — who builds it.
 *
 * The companion to `wixVsCustom`, deliberately on a different axis:
 * that guide is about what you build, this one is about who builds
 * it. The two are easy to blur, so the intro here says which question
 * it is answering and points at the other one rather than quietly
 * overlapping with it. The keyword map keeps them apart; the writing
 * has to as well.
 *
 * Averr is the middle option — one person — and the guide says so in
 * the section where that is a weakness, not in the summary where it
 * would read as a disclaimer after the sale. The ownership checklist
 * it gives (your domain, your hosting account, your repository) is
 * the convention this studio actually follows, written into the
 * playbook on 23 Nov 2026 after a client site was found living in one
 * folder on one laptop. A guide recommending a practice its author
 * does not keep is the kind a reader can smell.
 *
 * No price bands. The site states no prices, and the ranges a guide
 * like this usually quotes are invented; worse, they overlap so much
 * that sorting by them is the mistake the guide is arguing against.
 * The argument runs on structure, accountability and continuity
 * instead, which is both honest and more useful.
 */
const agencyVsFreelancer: Guide = {
  slug: "agency-vs-freelancer-vs-diy",
  title: "Agency, freelancer or yourself: who should build your website",
  target: "web design agency vs freelancer",
  svc: ["websites"],
  dek: "Three ways to get a website made, and the specific thing that goes wrong with each. Written by a one-person studio, which is the middle option and the one you should push hardest on.",
  published: "2026-11-23",
  checked: "2026-11-23",
  og: "guide-agency-vs-freelancer",
  intro: [
    {
      t: "p",
      text: "Most people ask this question in the wrong order. The first half — a site builder or a custom build — has its own guide. This is the second half: who makes it. That is the decision that determines whether you still have a working site in two years, and it gets about a tenth of the thought.",
    },
    {
      t: "p",
      text: "We are one of the three answers here, so read us accordingly. The paragraph on what goes wrong with a one-person studio is the one worth reading twice.",
    },
  ],
  sections: [
    {
      h: "The three options, described plainly",
      blocks: [
        {
          t: "p",
          text: "Sort them by structure rather than by what they charge, because the ranges overlap so heavily that price tells you almost nothing about which one you are dealing with.",
        },
        {
          t: "ul",
          items: [
            "An agency is a team. Someone sells, someone designs, someone builds, and someone manages the account. You are buying capacity, cover when one person is away, and a process that runs whether or not you ask for it.",
            "A freelancer or solo studio is one person who sells, designs and builds. You talk to whoever is doing the work. There is no account layer, which is simultaneously the appeal and the risk.",
            "Doing it yourself is you and a template. No brief, no scheduling, no invoice. You pay in your own hours and in the ceiling you will eventually hit.",
          ],
        },
        {
          t: "p",
          text: "These are structures, not quality tiers. There are careless agencies and there are freelancers who will out-build them. What the structure reliably predicts is not how good the work is but how the project behaves when something goes wrong.",
        },
      ],
    },
    {
      h: "What each one is actually good at",
      blocks: [
        {
          t: "ul",
          items: [
            "Agency: projects with several stakeholders, a deadline that cannot move, or a scope nobody has fully worked out yet. Figuring out what the project should be is a job, and agencies staff for it.",
            "Freelancer or solo studio: projects you can already describe. Nothing is lost in a handoff between a salesperson and a builder, because there is no handoff. Decisions take hours instead of a week.",
            "Yourself: proving the business exists. If you do not yet know whether people want the thing, spending on a built site is the wrong order of operations.",
          ],
        },
      ],
    },
    {
      h: "What goes wrong, in each case",
      blocks: [
        {
          t: "p",
          text: "Every option has one characteristic failure. Knowing which one you are signing up for is most of the decision.",
        },
        {
          t: "p",
          text: "With an agency, the person who sold you the project is usually not the person who builds it, and the work goes to whoever has capacity. That is fine when the brief is airtight and expensive when it is not, because every clarification travels through someone whose job is to relay it. The common symptom is that small changes take a strange amount of time and nobody can tell you why.",
        },
        {
          t: "p",
          text: "With a freelancer or a one-person studio, there is one calendar. If that person gets busy, sick, or takes a contract elsewhere, your project waits, and there is nobody to escalate to. The failure people under-weigh is the slower one: if they stop answering in a year, can you still run your site without them? For a lot of businesses the honest answer is no, and they only find out at the moment it matters.",
        },
        {
          t: "p",
          text: "Doing it yourself costs you the fortnight you spend on it rather than on the business, which is the part everyone discounts and nobody gets back. Then you hit the ceiling of what the template anticipated. Then you discover you are the only person who knows how any of it is wired, which makes handing it to somebody later more expensive than starting clean.",
        },
      ],
    },
    {
      h: "The question that actually separates them",
      blocks: [
        {
          t: "note",
          label: "The sorting question",
          text: "Not what can you afford. It is: how much of this project can you already specify? If you can describe what you need in a page, an agency is largely overhead and a freelancer is the efficient answer. If you cannot — if the real work is deciding what the thing should be — that is the part an agency is structured to do and the part doing it yourself cannot do at all, because you will build whatever the template suggests.",
        },
      ],
    },
    {
      h: "Who answers the phone in month seven",
      blocks: [
        {
          t: "p",
          text: "All three options look fine on launch day. Almost all of a website's life happens afterwards, and that is where the choice actually plays out. Before you hire anyone, get plain answers to these:",
        },
        {
          t: "ul",
          items: [
            "Where does the code live, and whose account is it in?",
            "Who renews the domain, and what happens if that invoice goes unpaid?",
            "When the platform or a dependency updates and something breaks, whose problem is it?",
            "What does a small change cost, and how long does it take?",
            "If you and I stop working together, what exactly do I walk away with?",
          ],
        },
        {
          t: "p",
          text: "You are not testing their technical ability with these. You are testing whether they have thought about the version of this relationship where they are not involved.",
        },
      ],
    },
    {
      h: "Reducing the risk, whichever you pick",
      blocks: [
        {
          t: "p",
          text: "Most of the damage from a bad choice here is preventable, and the prevention is the same in all three cases.",
        },
        {
          t: "ol",
          items: [
            "Register the domain yourself, in an account in your own name. This is the single thing that strands people, and it is the easiest to get right.",
            "Put the hosting account in your name too, and invite whoever builds the site into it rather than the other way round.",
            "The code lives in a private repository you own, and you have access from the first week. Ask at the start of the project, not the end — an awkward question in week one is a stranded site in month twenty.",
            "If you are replacing an existing site, get the redirect plan in writing before anyone starts. Old pages that point nowhere hand back rankings you spent years earning.",
            "Agree what a small change costs and how quickly it happens, while you still have leverage.",
          ],
        },
        {
          t: "p",
          text: "Anyone who hesitates at the first three is telling you something useful, and it costs you nothing to have asked.",
        },
      ],
    },
    {
      h: "The questions that actually decide it",
      blocks: [
        {
          t: "ul",
          items: [
            "Can you describe what you need, or do you need help working out what it should be?",
            "What happens to this project if one person is unavailable for three weeks?",
            "Is there a second phase, or is this the whole thing?",
            "How many people on your side have to agree before anything gets signed off?",
            "Do you want to talk to the person typing, or do you want somebody whose job is to manage them for you?",
          ],
        },
        {
          t: "p",
          text: "The last one is a real preference and not a trick question. Some owners want a single point of contact who handles it; others find the relay maddening. Neither is wrong, but choosing against your own temperament is how projects turn sour.",
        },
      ],
    },
    {
      h: "The honest summary",
      blocks: [
        {
          t: "ul",
          items: [
            "Simple site, a clear idea, some time, and you are still proving the business works: build it yourself, and spend the difference on photography and on getting your Google Business Profile right.",
            "You know what you need, it has to be good, and you would rather talk to whoever is building it: a freelancer or a one-person studio, with the ownership checklist above done properly rather than assumed.",
            "Several stakeholders, a fixed deadline, or a scope that nobody has pinned down yet: an agency, and treat the coordination as part of what you are buying instead of as a surprise on the invoice.",
          ],
        },
      ],
    },
  ],
  close:
    "If the middle option is where you landed, that is us, and the call is with the person who would do the work rather than someone who would pass it on. Ask about the handover before you ask about the design — it is the answer that tells you the most.",
};

export const GUIDES: Guide[] = [
  googleMaps,
  searchConsole,
  siteSpeed,
  wixVsCustom,
  websiteVsWebApp,
  spreadsheetToSoftware,
  contractorHomePage,
  buildVsBuy,
  agencyVsFreelancer,
];

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
