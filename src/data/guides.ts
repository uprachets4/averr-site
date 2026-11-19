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

export const GUIDES: Guide[] = [googleMaps, searchConsole, siteSpeed, wixVsCustom];

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
