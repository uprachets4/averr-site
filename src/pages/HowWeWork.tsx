import { useEffect } from "react";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
/* Shares the prose-page styling with /privacy rather than growing a
   second copy of it. Both are the same object: a dark page, a lede, a
   contents rail and numbered sections. If a third one appears the
   styles are worth lifting out of `privacy.css` under a neutral name;
   two is not enough to justify the move. */
import "../components/privacy/privacy.css";

/**
 * /how-we-work — the page a cautious buyer looks for before booking.
 *
 * Every promise here is one the studio already makes somewhere else,
 * not a new one invented for the page:
 *
 *   - "Replies within 24 hours" is already in the footer, on /contact
 *     and on /about, and the footer comment records that an earlier
 *     "same-day" was corrected to match.
 *   - Thirty days of support after launch is the figure in the owner's
 *     own SEO checklist, where this page was specified.
 *   - Ownership of the domain, the hosting account and the code is the
 *     convention written into the studio playbook on 23 Nov 2026, and
 *     the same promise the agency-versus-freelancer guide tells readers
 *     to demand of anyone they hire. A studio that recommends a
 *     practice it does not publish is one a reader can check.
 *   - WCAG 2.1 AA and the axe-core pass are the quality gates the build
 *     actually runs, not an aspiration.
 *
 * The accessibility section deliberately states what we build to and
 * stops short of saying who AODA legally obliges. That is a question
 * about the client's own organisation, and getting it wrong in either
 * direction on a public page would be worse than not answering it.
 */

const SECTIONS: { id: string; nav: string; h2: string }[] = [
  { id: "shape", nav: "How a project runs", h2: "How a project runs" },
  { id: "get", nav: "What you end up with", h2: "What you end up with" },
  { id: "promise", nav: "What we promise", h2: "What we promise" },
  { id: "need", nav: "What we need from you", h2: "What we need from you" },
  { id: "access", nav: "Accessibility", h2: "Accessibility" },
  { id: "after", nav: "After launch", h2: "After launch" },
];

export default function HowWeWork() {
  useDocumentMeta(META.howWeWork.title, META.howWeWork.description);
  useDeclarePageEndTone("dark");

  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
      };
    },
    [setNavDark]
  );

  return (
    <div className="pv">
      <div className="pvsky" aria-hidden="true" />

      <div className="pvwrap">
        <header className="pvhead">
          <span className="pveyebrow">How we work</span>
          <h1>What you are actually buying.</h1>
          <p className="pvlede">
            Most studio sites tell you what they make and not how it goes. This
            page is the other half: the order a project runs in, what we commit
            to, what we need from you, and what you own at the end.
          </p>
        </header>

        <nav className="pvnav" aria-label="On this page">
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.nav}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="pvbody">
          <section className="pvsec" id="shape" aria-labelledby="h-shape">
            <h2 id="h-shape">{SECTIONS[0].h2}</h2>
            <p>Four stages, in this order, every time.</p>
            <ul>
              <li>
                <b>A call.</b> Thirty minutes. We ask what the business does,
                who you are trying to reach and what has to be true for this to
                have been worth it. If what you need is not what we build, we
                say so on that call rather than later.
              </li>
              <li>
                <b>Direction.</b> Before any code: the colour palette, the type
                pairing, the one element that will make the site recognisably
                yours, and how it behaves as you scroll. You see this as a
                single checkpoint and can redirect all of it. Changing direction
                here costs a conversation; changing it after the build costs the
                build.
              </li>
              <li>
                <b>The build.</b> Section by section, in the order a visitor
                reads them, so what you are reviewing is the real cumulative
                experience rather than a folder of pieces. You see it on a live
                link throughout.
              </li>
              <li>
                <b>Polish.</b> Spacing, motion, the four screen sizes,
                accessibility, performance, and every word of copy. This is a
                stage rather than an afterthought, and it is most of what
                separates a site that works from one that is finished.
              </li>
            </ul>
          </section>

          <section className="pvsec" id="get" aria-labelledby="h-get">
            <h2 id="h-get">{SECTIONS[1].h2}</h2>
            <p>
              A site built in code for your business, not a theme with your logo
              on it. Specifically, and without being asked:
            </p>
            <ul>
              <li>
                Every page written out as real text a search engine can read,
                rather than an empty shell that fills in once a script runs.
              </li>
              <li>
                A title and description per page, written for the search that
                page should win.
              </li>
              <li>
                Structured data describing your business, a sitemap, a robots
                file and a share image for every page, so a link to you looks
                like something when it is pasted anywhere.
              </li>
              <li>Copy, if you do not have it. We write it; you correct it.</li>
              <li>
                A look at your Google Business Profile, because for most local
                businesses that moves more than the website does, and saying so
                is more useful than selling you a page.
              </li>
            </ul>
          </section>

          <section className="pvsec" id="promise" aria-labelledby="h-promise">
            <h2 id="h-promise">{SECTIONS[2].h2}</h2>
            <ul>
              <li>
                <b>A reply within 24 hours</b>, on any working day, to anything
                you send.
              </li>
              <li>
                <b>Thirty days of support after launch.</b> Anything broken, or
                wrong against what we agreed, is fixed in that window at no
                cost. It is not a retainer and you are not asked to buy one.
              </li>
              <li>
                <b>You own it.</b> The domain, the hosting account and the code
                are in your name from the first week, not handed over at the
                end. If you stop working with us you lose nothing but us.
              </li>
              <li>
                <b>No monthly fee to keep it online</b> beyond hosting, which is
                yours and which for a site this size is usually free.
              </li>
              <li>
                <b>We will tell you when you do not need us.</b> If a site
                builder is the right answer for where your business is, that is
                what we will say on the call.
              </li>
            </ul>
          </section>

          <section className="pvsec" id="need" aria-labelledby="h-need">
            <h2 id="h-need">{SECTIONS[3].h2}</h2>
            <p>
              Short list, and the projects that run late are almost always late
              here rather than in the build.
            </p>
            <ul>
              <li>
                <b>Photographs of real work.</b> The single biggest difference
                between a convincing site and a generic one, and the thing we
                cannot make for you.
              </li>
              <li>
                <b>One person who decides.</b> Feedback from four people with no
                one resolving it is the most expensive thing that can happen to
                a project.
              </li>
              <li>
                <b>Answers to the questions in the brief.</b> What you do that
                the competition does not, who you want to hear from, what a good
                enquiry looks like.
              </li>
              <li>
                <b>Feedback in one pass.</b> All of it together, not over a
                fortnight in pieces.
              </li>
            </ul>
          </section>

          <section className="pvsec" id="access" aria-labelledby="h-access">
            <h2 id="h-access">{SECTIONS[4].h2}</h2>
            <p>
              Every site is built to WCAG 2.1 Level AA and checked with
              axe-core before it goes live. In practice that means semantic
              HTML, everything reachable and operable from a keyboard with a
              visible focus ring, text that meets contrast against what is
              behind it, alt text on every image that carries meaning, and
              motion that stops for anyone whose device asks it to.
            </p>
            <p>
              Accessibility is checked as part of the build rather than audited
              afterwards, which is both cheaper and the only way it actually
              holds. If your organisation has accessibility reporting
              obligations of its own, say so in the brief and we will document
              the conformance claim alongside the build.
            </p>
          </section>

          <section className="pvsec" id="after" aria-labelledby="h-after">
            <h2 id="h-after">{SECTIONS[5].h2}</h2>
            <p>
              After the thirty days, changes are quoted as work. There is no
              package, no tier and no minimum. Small things are small; you will
              know what something costs before it starts.
            </p>
            <p>
              What we do not do is hold the site hostage. It is on your hosting,
              in your repository, under your domain, and any competent developer
              can pick it up. That is deliberate: a client who stays because
              leaving is painful is not a reference.
            </p>
            <p>
              What happens to anything you send us is set out separately on the{" "}
              <a href="/privacy">privacy page</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
