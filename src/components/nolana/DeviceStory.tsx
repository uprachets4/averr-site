import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Chip, TwoTone } from "./Bits";

/**
 * The story: Found → Chosen → Booked → Runs itself.
 *
 * A pinned device holding live glass UI, one scroll value driving both
 * the step and the panel inside it. Nothing here is a screenshot and
 * nothing is reused from /services — the panels are new compositions in
 * this palette.
 *
 * WHAT WE KEEP FROM NOLANA: the material language of frame 09 — a dark
 * device over a misty procedural atmosphere, glass panels with a
 * low-alpha fill and a hairline light border, a glowing ring.
 *
 * WHAT OURS DOES BETTER: Nolana's device is a still image inside a
 * card. Ours is the subject — it tilts toward the cursor, its glow
 * spills onto the page in that step's colour, the panel inside is live
 * at every step rather than a blurred screenshot, and the step list is
 * a real control, not a caption.
 */

type Step = {
  n: string;
  title: string;
  line: string;
  href: string;
  /** the colour the device spills onto the page on this step */
  glow: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Found",
    line: "Customers search. You show up first.",
    href: "/services#local-search",
    glow: "166,179,235",
  },
  {
    n: "02",
    title: "Chosen",
    line: "Your site makes the decision easy.",
    href: "/services#marketing-websites",
    glow: "249,175,151",
  },
  {
    n: "03",
    title: "Booked",
    line: "They book without picking up the phone.",
    href: "/services#ai-agents",
    glow: "112,141,248",
  },
  {
    n: "04",
    title: "Runs itself",
    line: "AI handles the follow-up. You approve.",
    href: "/services#outreach-campaigns",
    glow: "152,116,232",
  },
];

/** The misty atmosphere every dark surface in this system sits on.
 *  Procedural: gradients, a noise turbulence and three ridge paths. */
export function Atmosphere({ id }: { id: string }) {
  return (
    <svg className="ds-atmos" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#273246" />
          <stop offset="52%" stopColor="#1B2433" />
          <stop offset="100%" stopColor="#121A24" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.62" cy="0.26" r="0.45">
          <stop offset="0%" stopColor="#AF9EE0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#AF9EE0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-mist`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.13" intercept="0" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      <rect width="800" height="500" fill={`url(#${id}-sun)`} />
      {/* three ridges, far to near */}
      <path d="M0 318 L96 286 L186 306 L286 262 L388 298 L486 258 L592 292 L700 262 L800 288 L800 500 L0 500Z"
        fill="#1C2535" opacity="0.72" />
      <path d="M0 362 L110 334 L208 356 L318 318 L430 352 L540 316 L652 346 L764 318 L800 332 L800 500 L0 500Z"
        fill="#182030" opacity="0.85" />
      <path d="M0 410 L128 388 L246 408 L372 376 L498 404 L624 374 L742 400 L800 388 L800 500 L0 500Z"
        fill="#131A26" />
      <rect width="800" height="500" filter={`url(#${id}-mist)`} opacity="0.5" />
    </svg>
  );
}

/* ── the four panels ───────────────────────────────────────────────── */

function PanelFound({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <div className="dp-search">
        <span className="dp-search__i" aria-hidden>⌕</span>
        <span className="dp-typed">basement renovation near me</span>
      </div>
      <ul className="dp-results">
        <li className="dp-res dp-res--win">
          <span className="dp-res__rank">1</span>
          <span className="dp-res__name">Northgate Renovations</span>
          <span className="dp-res__stars" aria-hidden>★★★★★</span>
        </li>
        <li className="dp-res"><span className="dp-res__rank">2</span><span className="dp-res__bar" /></li>
        <li className="dp-res"><span className="dp-res__rank">3</span><span className="dp-res__bar" /></li>
      </ul>
      <div className="dp-map" aria-hidden>
        <span className="dp-map__grid" />
        <span className="dp-map__pin" />
      </div>
    </div>
  );
}

function PanelChosen({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <div className="dp-site">
        <div className="dp-site__bar" aria-hidden><i /><i /><i /></div>
        <div className="dp-site__body">
          <span className="dp-site__mark">Northgate</span>
          <span className="dp-site__h">
            Rooms that <em>feel finished.</em>
          </span>
          <span className="dp-site__img" aria-hidden />
          <span className="dp-site__cta">Get a quote</span>
        </div>
      </div>
    </div>
  );
}

function PanelBooked({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <div className="dp-cal">
        <div className="dp-cal__head">
          <span>October</span>
          <span className="dp-cal__dots" aria-hidden><i /><i /></span>
        </div>
        <div className="dp-cal__grid" aria-hidden>
          {Array.from({ length: 21 }).map(function d(_, k) {
            return <i key={k} className={k === 10 ? "is-sel" : undefined} />;
          })}
        </div>
        <div className="dp-slots">
          <span className="dp-slot">1:00</span>
          <span className="dp-slot dp-slot--on">2:00</span>
          <span className="dp-slot">3:30</span>
          <span className="dp-ghost" aria-hidden />
        </div>
        <div className="dp-confirm">
          <span className="dp-confirm__tick" aria-hidden>✓</span> Confirmed — Thu 2:00 PM
        </div>
      </div>
    </div>
  );
}

function PanelRuns({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <div className="dp-chat">
        {/* the customer's message, so the panel reads as a conversation
            rather than one floating reply in a large empty pane */}
        <div className="dp-chat__in">
          <span className="dp-chat__inwho">Priya · 8:42 AM</span>
          Hi — we&apos;re finishing the basement at Ravenscroft. Can someone come out this week to quote it?
        </div>
        <div className="dp-chat__who">
          <span className="dp-chat__orb" aria-hidden />
          Averr agent
        </div>
        <p className="dp-chat__msg">
          Hi Priya — thanks for the details on the Ravenscroft basement.{" "}
          <em>I&apos;ve held Thursday at 2:00</em> for the estimate.
        </p>
        <div className="dp-chat__row">
          <span className="dp-chat__btn">Approve &amp; send</span>
          <span className="dp-ghost dp-ghost--btn" aria-hidden />
        </div>
      </div>
    </div>
  );
}

const PANELS = [PanelFound, PanelChosen, PanelBooked, PanelRuns];

export default function DeviceStory() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(false);

  /* one scroll value drives the step — no timers */
  useEffect(
    function drive() {
      const wrap = wrapRef.current;
      if (!wrap || reduce || picked) return;
      let raf = 0;
      function read() {
        raf = 0;
        const r = wrap!.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        if (span <= 0) return;
        const t = Math.max(0, Math.min(0.999, -r.top / span));
        setStep(Math.min(STEPS.length - 1, Math.floor(t * STEPS.length)));
      }
      function on() {
        if (!raf) raf = requestAnimationFrame(read);
      }
      read();
      window.addEventListener("scroll", on, { passive: true });
      window.addEventListener("resize", on);
      return function off() {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", on);
        window.removeEventListener("resize", on);
      };
    },
    [reduce, picked]
  );

  /* BEYOND NOLANA: the device leans toward the cursor, ±4° */
  useEffect(
    function tilt() {
      const d = deviceRef.current;
      if (!d || reduce) return;
      function move(e: PointerEvent) {
        const r = d!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const cx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const cy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        d!.style.setProperty("--ry", `${Math.max(-4, Math.min(4, cx * 4)).toFixed(2)}deg`);
        d!.style.setProperty("--rx", `${Math.max(-4, Math.min(4, -cy * 4)).toFixed(2)}deg`);
      }
      window.addEventListener("pointermove", move, { passive: true });
      return function off() {
        window.removeEventListener("pointermove", move);
      };
    },
    [reduce]
  );

  const active = STEPS[step];

  return (
    <section className="ds" aria-label="How it works">
      <div ref={wrapRef} className="ds-wrap">
        <div className="ds-stage">
          <div className="ds-head">
            <Chip>How it works</Chip>
            <TwoTone
              className="ds-h2"
              lead="Here's what we build,"
              rest="in the order your customers meet it."
            />
          </div>

          <div
            ref={deviceRef}
            className="ds-device"
            style={{ "--glow": active.glow } as React.CSSProperties}
          >
            <span className="ds-spill" aria-hidden />
            <Atmosphere id="ds" />
            <div className="ds-screen">
              <ol className="ds-steps">
                {STEPS.map(function s(x, i) {
                  return (
                    <li key={x.n}>
                      <button
                        type="button"
                        className={i === step ? "ds-step ds-step--on" : "ds-step"}
                        aria-current={i === step ? "step" : undefined}
                        onClick={function pick() {
                          setPicked(true);
                          setStep(i);
                        }}
                      >
                        <span className="ds-step__n">{x.n}</span>
                        <span className="ds-step__t">{x.title}</span>
                        <span className="ds-step__l">{x.line}</span>
                      </button>
                      {i === step ? (
                        <Link className="ds-step__more" to={x.href}>
                          Learn more <span aria-hidden>→</span>
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              <div className="ds-panel">
                {PANELS.map(function P(C, i) {
                  return <C key={i} on={i === step} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
