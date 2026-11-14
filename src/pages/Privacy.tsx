import { useEffect } from "react";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import { EMAIL_ADDR } from "../data/contactBrief";
import "../components/privacy/privacy.css";

/**
 * /privacy — spec 35 part B.
 *
 * Every claim on this page was checked against the code before it was
 * written, and the page says only what that check found:
 *
 *   - the brief POSTs to `api/contact.ts`, which sends one email
 *     through Resend to the owner's inbox with `reply_to` set to the
 *     sender; nothing is stored server-side;
 *   - `@calcom/embed-react` is the only third-party embed, on this
 *     route's Talk section and behind the "Book a call" buttons on
 *     /services and the 404;
 *   - Google Analytics 4 loads with Google Consent Mode v2
 *     (src/lib/analytics.ts): analytics is always on outside Quebec, the
 *     EU/EEA, the UK and Switzerland; advertising cookies only after
 *     "Accept all"; in those strict regions everything waits for "Accept
 *     all"; the region comes from /api/geo; fonts are self-hosted;
 *   - the site's own browser storage is the consent choice
 *     (`averr-consent-v2`, localStorage) and one `sessionStorage` key on
 *     /work, `averr:work-scroll`, which remembers where you were;
 *   - Vercel's own request logs are the rest of the hosting story.
 *
 * If any of that changes, this page changes with it.
 */

const UPDATED = "14 November 2026";

const SECTIONS: { id: string; nav: string; h2: string }[] = [
  { id: "collect", nav: "What we collect", h2: "What we collect" },
  { id: "use", nav: "How we use it", h2: "How we use it" },
  { id: "processors", nav: "Who processes it", h2: "Who processes it" },
  { id: "cookies", nav: "Cookies and tracking", h2: "Cookies and tracking" },
  { id: "keep", nav: "How long we keep it", h2: "How long we keep it" },
  { id: "rights", nav: "Your rights", h2: "Your rights" },
  { id: "contact", nav: "Contact", h2: "Contact" },
];

export default function Privacy() {
  useDocumentMeta(META.privacy.title, META.privacy.description);
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
          <span className="pveyebrow">Privacy</span>
          <h1>What happens to what you send us.</h1>
          <p className="pvlede">
            Averr Studios is a small studio in Toronto. We ask for
            what we need to answer you and build your project, and nothing else.
            This page says exactly what that is, in plain English.
          </p>
          <p className="pvstamp">Last updated · {UPDATED}</p>
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
          <section className="pvsec" id="collect" aria-labelledby="h-collect">
            <h2 id="h-collect">{SECTIONS[0].h2}</h2>
            <p>
              Only what you type into the contact form, and only when you send
              it. That is:
            </p>
            <ul>
              <li>
                <b>Your name</b>, and your business name if you add one.
              </li>
              <li>
                <b>Your email address</b>, so we can reply.
              </li>
              <li>
                <b>The services you pick</b> — Websites, Web Apps, AI Automation,
                Marketing — and any of the options under them.
              </li>
              <li>
                <b>When you would like to start</b>, if you choose a timeline.
              </li>
              <li>
                <b>What you write about the project</b>, and a link to your
                current site if you add one.
              </li>
            </ul>
            <p>
              If you book a call instead, the booking runs on Cal.com and Cal.com
              asks you for your name, email and anything else on its own form. If
              you have already filled in the brief, we pass your name, email and
              the services you picked to that form so you do not type them twice.
            </p>
            <p>
              Nothing else on this site collects anything. The business name you
              can type into the home page is only ever used to draw the animation
              in front of you — it never leaves your browser and it is gone when
              you close the tab.
            </p>
          </section>

          <section className="pvsec" id="use" aria-labelledby="h-use">
            <h2 id="h-use">{SECTIONS[1].h2}</h2>
            <p>
              To reply to you, and then to scope and build the project if we work
              together. That is the whole list.
            </p>
            <p>
              We do not sell it, rent it, or hand it to anyone for their own use.
              There is no mailing list to be added to and no advertising of any
              kind. Sending the form does not subscribe you to anything.
            </p>
          </section>

          <section className="pvsec" id="processors" aria-labelledby="h-proc">
            <h2 id="h-proc">{SECTIONS[2].h2}</h2>
            <p>Three services touch it, each for one job:</p>
            <ul>
              <li>
                <b>Resend</b> turns the form into an email and delivers it to our
                inbox. The message is not stored anywhere else on this site —
                there is no database behind the form.
              </li>
              <li>
                <b>Cal.com</b> runs the booking, if you book a call. What you
                enter there is held by Cal.com under its own{" "}
                <a href="https://cal.com/privacy" target="_blank" rel="noreferrer noopener">
                  privacy policy
                </a>
                .
              </li>
              <li>
                <b>Vercel</b> hosts the site and keeps the ordinary server logs
                any host keeps — the page requested, the time, an IP address —
                under its own{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  privacy policy
                </a>
                . We do not read those logs to build a picture of you.
              </li>
            </ul>
          </section>

          <section className="pvsec" id="cookies" aria-labelledby="h-cookies">
            <h2 id="h-cookies">{SECTIONS[3].h2}</h2>
            <p>
              This site uses <b>Google Analytics</b> to understand how people use it:
              which pages they visit, how they arrived, how far they scroll, what
              they click (such as booking buttons, service cards and the steps of
              the booking pass), and the device, browser and approximate location
              they use. We never record what you type into the site&rsquo;s
              fields.
            </p>
            <p>
              <b>In Ontario, the rest of Canada outside Quebec, and the United
              States,</b> analytics cookies (<code>_ga</code> and{" "}
              <code>_ga_&hellip;</code>, kept for up to two years) are always on, and
              the banner tells you so when you first arrive. <b>Advertising</b>{" "}
              cookies, which let Google measure our ads, are set only if you choose{" "}
              <b>Accept all</b>; <b>Essential only</b> leaves them off.
            </p>
            <p>
              <b>In Quebec, the European Union, the United Kingdom and
              Switzerland,</b> analytics and advertising cookies are off until you
              choose <b>Accept all</b>. With <b>Reject all</b>, no analytics or
              advertising cookies are set, and Google receives only anonymous,
              cookieless signals that a page was viewed.
            </p>
            <p>
              We work out which rules apply from your approximate region, which our
              host provides with each page request; we don&rsquo;t keep it. You can
              change your choice at any time with <b>Cookie settings</b> at the
              bottom of every page. Google processes this data, including in the
              United States, under{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer noopener">
                its privacy policy
              </a>
              .
            </p>
            <p>
              The site itself keeps two small notes in your browser: your cookie
              choice, so we don&rsquo;t ask again, and where you had scrolled to on
              the work page, so coming back from a case study puts you where you
              were. Neither is sent anywhere. The fonts are served from this site,
              not a font network.
            </p>
            <p>
              Opening the booking embed loads Cal.com into the page, and at that
              point Cal.com can set its own cookies under its policy above. It
              only loads if you scroll to it or ask for it.
            </p>
          </section>

          <section className="pvsec" id="keep" aria-labelledby="h-keep">
            <h2 id="h-keep">{SECTIONS[4].h2}</h2>
            <p>
              Your message lives in our email inbox for as long as we need it to
              work with you, and after that for as long as we would keep any
              ordinary correspondence. Ask us to delete it and we will.
            </p>
          </section>

          <section className="pvsec" id="rights" aria-labelledby="h-rights">
            <h2 id="h-rights">{SECTIONS[5].h2}</h2>
            <p>
              You can ask what we hold about you, ask us to correct it, or ask us
              to delete it. Email{" "}
              <a href={`mailto:${EMAIL_ADDR}`}>{EMAIL_ADDR}</a> and we will answer.
            </p>
            <p>
              We follow Canada&rsquo;s Personal Information Protection and
              Electronic Documents Act (PIPEDA). If you are not satisfied with how
              we have handled a request, you can take it to the Office of the
              Privacy Commissioner of Canada.
            </p>
          </section>

          <section className="pvsec" id="contact" aria-labelledby="h-contact">
            <h2 id="h-contact">{SECTIONS[6].h2}</h2>
            <p>
              Averr Studios
              <br />
              Toronto, Ontario, Canada
              <br />
              <a href={`mailto:${EMAIL_ADDR}`}>{EMAIL_ADDR}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
