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
          <stop offset="0%" stopColor="#2B3650" />
          <stop offset="34%" stopColor="#243047" />
          <stop offset="68%" stopColor="#1A2333" />
          <stop offset="100%" stopColor="#111823" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.64" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#C7B4F0" stopOpacity="0.62" />
          <stop offset="45%" stopColor="#8E7FD6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8E7FD6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-warm`} cx="0.78" cy="0.42" r="0.4">
          <stop offset="0%" stopColor="#F9AF97" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F9AF97" stopOpacity="0" />
        </radialGradient>
        {/* the valley haze that separates each ridge from the next */}
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8EA2C8" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#8EA2C8" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.09" />
          </feComponentTransfer>
        </filter>
        <filter id={`${id}-cloud`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.015" numOctaves="4" seed="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="800" height="500" fill={`url(#${id}-sky)`} />
      <rect width="800" height="500" fill={`url(#${id}-sun)`} />
      <rect width="800" height="500" fill={`url(#${id}-warm)`} />

      {/* a faint field of stars in the upper sky */}
      <g fill="#E9EEFF">
        {STARS.map(function st(s, i) {
          return <circle key={i} cx={s[0]} cy={s[1]} r={s[2]} opacity={s[3]} />;
        })}
      </g>

      {/* low cloud, drifting */}
      <rect className="ds-atmos__cloud" width="1600" height="190" y="120" filter={`url(#${id}-cloud)`} opacity="0.5" />

      {/* FIVE ridges, each with the haze pooling in front of it */}
      <path d="M0 266 L84 240 L158 258 L244 222 L330 252 L420 216 L508 246 L600 214 L692 242 L800 220 L800 500 L0 500Z" fill="#232E44" opacity="0.5" />
      <rect y="250" width="800" height="70" fill={`url(#${id}-haze)`} opacity="0.5" />
      <path d="M0 304 L96 280 L186 300 L286 266 L388 296 L486 262 L592 292 L700 264 L800 286 L800 500 L0 500Z" fill="#1F2939" opacity="0.72" />
      <rect y="288" width="800" height="72" fill={`url(#${id}-haze)`} opacity="0.44" />
      <path d="M0 348 L110 324 L208 346 L318 310 L430 342 L540 308 L652 338 L764 312 L800 324 L800 500 L0 500Z" fill="#1A2231" opacity="0.88" />
      <rect y="332" width="800" height="76" fill={`url(#${id}-haze)`} opacity="0.34" />
      <path d="M0 396 L128 374 L246 394 L372 362 L498 390 L624 360 L742 386 L800 374 L800 500 L0 500Z" fill="#151C28" />
      <path d="M0 448 L140 430 L268 448 L400 422 L532 446 L664 420 L780 442 L800 436 L800 500 L0 500Z" fill="#101620" />

      <rect width="800" height="500" filter={`url(#${id}-grain)`} opacity="0.55" />
    </svg>
  );
}

/** A fixed star field — deterministic, so the sky never reshuffles. */
const STARS: Array<[number, number, number, number]> = (function make() {
  const out: Array<[number, number, number, number]> = [];
  let seed = 7;
  function rnd() {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  }
  for (let i = 0; i < 90; i++) {
    const y = rnd() * 210;
    out.push([rnd() * 800, y, rnd() * 0.9 + 0.3, (1 - y / 240) * (rnd() * 0.5 + 0.22)]);
  }
  return out;
})();

/* ── the four panels ───────────────────────────────────────────────── */

/** A small glass card lifted out of the panel's plane. Each carries
 *  live content from its own step — a source, a status, a metric —
 *  which is what makes the panel read as a working surface rather than
 *  one object on a background. */
function Sub({
  cls,
  label,
  value,
  tone,
}: {
  cls: string;
  label: string;
  value: string;
  tone?: "ok" | "grad";
}) {
  return (
    <span className={`dsub ${cls}`} aria-hidden>
      <span className="dsub__l">{label}</span>
      <span className={tone === "grad" ? "dsub__v dsub__v--grad" : tone === "ok" ? "dsub__v dsub__v--ok" : "dsub__v"}>
        {value}
      </span>
    </span>
  );
}

function PanelFound({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <Sub cls="dsub--a" label="Source" value="Google · local pack" />
      <Sub cls="dsub--b" label="Position" value="#1" tone="grad" />
      <div className="dp-hd">
        <span className="dp-hd__t">Local search</span>
        <span className="dp-hd__s">Oshawa · Whitby · Ajax</span>
      </div>
      <div className="dp-search">
        <span className="dp-search__i" aria-hidden>⌕</span>
        <span className="dp-typed">basement renovation near me</span>
      </div>
      <ul className="dp-results">
        <li className="dp-res dp-res--win">
          <span className="dp-res__rank">1</span>
          <span className="dp-res__col">
            <b>Northgate Renovations</b>
            <i>Basement finishing · Open now</i>
          </span>
          <span className="dp-res__rate">Highly rated</span>
        </li>
        <li className="dp-res">
          <span className="dp-res__rank">2</span>
          <span className="dp-res__col"><b>Lakeshore Interiors</b><i>General contractor</i></span>
        </li>
        <li className="dp-res">
          <span className="dp-res__rank">3</span>
          <span className="dp-res__col"><b>Rideau Build Co.</b><i>Renovations</i></span>
        </li>
      </ul>
      <div className="dp-row2">
        <div className="dp-map" aria-hidden>
          <span className="dp-map__grid" />
          <span className="dp-map__pin" />
          <span className="dp-map__tag">Northgate</span>
        </div>
        <div className="dp-stat">
          <span className="dp-stat__l">Views this week</span>
          <span className="dp-stat__v">Up</span>
          <span className="dp-stat__b" aria-hidden><i /><i /><i /><i /><i /><i /></span>
        </div>
      </div>
    </div>
  );
}

function PanelChosen({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <Sub cls="dsub--e" label="Loads in" value="1.1s" tone="grad" />
      <Sub cls="dsub--f" label="Built with" value="Next.js" />
      <div className="dp-hd">
        <span className="dp-hd__t">The site</span>
        <span className="dp-hd__s">Desktop and mobile, one build</span>
      </div>
      <div className="dp-two">
        <div className="dp-site">
          <div className="dp-site__bar" aria-hidden><i /><i /><i /><u /></div>
          <div className="dp-site__body">
            <span className="dp-site__nav" aria-hidden><i /><i /><i /><b /></span>
            <span className="dp-site__mark">Northgate</span>
            <span className="dp-site__h">
              Rooms that <em>feel finished.</em>
            </span>
            <span className="dp-site__sub" aria-hidden />
            <span className="dp-site__img" aria-hidden><i /><i /><i /></span>
            <span className="dp-site__cta">Get a quote</span>
            <span className="dp-site__cards" aria-hidden><i /><i /><i /></span>
          </div>
        </div>
        <div className="dp-mob">
          <span className="dp-mob__notch" aria-hidden />
          <span className="dp-mob__mark">Northgate</span>
          <span className="dp-mob__h">Rooms that feel finished.</span>
          <span className="dp-mob__img" aria-hidden />
          <span className="dp-mob__cta">Get a quote</span>
          <span className="dp-mob__row" aria-hidden><i /><i /></span>
        </div>
      </div>
    </div>
  );
}

function PanelBooked({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      <Sub cls="dsub--a" label="Status" value="Confirmed" tone="ok" />
      <Sub cls="dsub--b" label="No phone call" value="0 min" tone="grad" />
      <div className="dp-cal">
        <div className="dp-hd">
          <span className="dp-hd__t">Book an estimate</span>
          <span className="dp-hd__s">October</span>
        </div>
        <div className="dp-cal__days" aria-hidden>
          <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
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
        <div className="dp-sms">
          <span className="dp-sms__w">SMS reminder</span>
          <span className="dp-sms__b">
            Northgate: we&apos;re booked for Thursday at 2:00. Reply R to reschedule.
          </span>
        </div>
      </div>
    </div>
  );
}

function PanelRuns({ on }: { on: boolean }) {
  return (
    <div className={on ? "dp dp--on" : "dp"}>
      {/* one sub-panel here: the Approve bar and the waiting toast
          already say the rest, and two more landed on the thread */}
      <Sub cls="dsub--g" label="Drafted in" value="4s" tone="grad" />
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
          <span className="dp-chat__src">3 sources</span>
        </div>
        <p className="dp-chat__msg">
          Hi Priya — thanks for the details on the Ravenscroft basement.{" "}
          <em>I&apos;ve held Thursday at 2:00</em> for the estimate.
        </p>
        <div className="dp-chat__in dp-chat__in--2">
          <span className="dp-chat__inwho">Priya · 8:51 AM</span>
          Thursday works. Do you need the floor plans before you come?
        </div>
        <div className="dp-chat__meta" aria-hidden>
          <span>Thread · Ravenscroft basement</span>
          <span className="dp-chat__toast">3 drafts waiting</span>
        </div>
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
