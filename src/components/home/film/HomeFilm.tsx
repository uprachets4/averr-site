import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { holdLayout, type HoldLayout } from "./hold";
import { Link } from "react-router-dom";
import { CLIENTS, LEAD_STAT, OUTCOMES, PARTNERS, PROJECTS, SERVICES, STATS } from "./content";
import type { FilmHandle } from "./engine";
import "./film.css";

/**
 * The home film — spec 30.
 *
 * One pinned 1500vh stage running five acts: partners, the four
 * services, a screening room of real recordings, the signature word with
 * work playing inside it, and the visitor's own business name in
 * particles. The hero's takeover opens straight into this stage's
 * background, so there is no seam between them.
 *
 * This file is the DOM only. Everything that moves is in `engine.ts`,
 * which is a lazy chunk fetched by an IntersectionObserver when the film
 * is within one viewport — the hero's LCP must not change.
 *
 * Accessibility: one `h2` per act, all copy is real DOM text, both
 * canvases are aria-hidden, the partner logos carry the company name as
 * `alt`, the decorative service rail is aria-hidden (the names are
 * already headings in the beats), and the name field has a real label.
 */

type FilmProps = {
  /** The business name, shared with the start pass below the film. */
  name: string;
  onName: (v: string) => void;
  /** The start pass, scrolled over the pinned stage between Signature
      and the Finale (see hold.ts). */
  pass?: ReactNode;
};

export default function HomeFilm({ name, onName, pass }: FilmProps) {
  const passRef = useRef<HTMLDivElement | null>(null);
  const holdRef = useRef<HoldLayout | null>(null);

  /* Lay the track out: the film grows by the pass plus one viewport, and
     the pass sits where Signature holds. Recomputed when the pass changes
     height or the width changes; small height-only changes (a phone's
     URL bar) are ignored so the page doesn't jump under a thumb. */
  useLayoutEffect(function layoutHold() {
    const film = filmRef.current;
    const el = passRef.current;
    if (!film || !el) return;
    let lastW = -1;
    let lastH = -1;
    const apply = (force: boolean) => {
      const w = innerWidth;
      const ih = innerHeight;
      if (!force && w === lastW && Math.abs(ih - lastH) < 140) return;
      lastW = w;
      lastH = ih;
      const L = holdLayout(ih, Math.max(el.offsetHeight, ih));
      holdRef.current = L;
      film.style.height = `${Math.round(L.filmH)}px`;
      el.style.top = `${Math.round(L.passTop)}px`;
    };
    apply(true);
    const onResize = () => apply(false);
    const ro = new ResizeObserver(() => apply(true));
    ro.observe(el);
    addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      removeEventListener("resize", onResize);
    };
  }, []);

  const filmRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const partnersRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const workRef = useRef<HTMLElement | null>(null);
  const signatureRef = useRef<HTMLElement | null>(null);
  const finaleRef = useRef<HTMLElement | null>(null);
  const vIntroRef = useRef<HTMLDivElement | null>(null);
  const beatsRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const wTopRef = useRef<HTMLDivElement | null>(null);
  const creditsRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const screenLinkRef = useRef<HTMLAnchorElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigSvgRef = useRef<SVGSVGElement | null>(null);
  const sigWordRef = useRef<SVGTextElement | null>(null);
  const outsRef = useRef<HTMLDivElement | null>(null);
  const fTopRef = useRef<HTMLDivElement | null>(null);
  const fBotRef = useRef<HTMLDivElement | null>(null);
  const tsRef = useRef<HTMLParagraphElement | null>(null);
  const marksRef = useRef<HTMLDivElement | null>(null);

  /* The stat row. `statsIn` is React state because the entrance is a
     className and this component re-renders on every keystroke in the
     finale's field — an imperatively added class would be reconciled
     away. The COUNT itself never goes through state: it writes
     textContent on these refs from a rAF loop, so ninety frames of
     counting cost no renders. */
  const statNumRefs = useRef<Array<HTMLElement | null>>([]);
  const leadNumRef = useRef<HTMLElement | null>(null);
  const countedRef = useRef(false);
  const [statsIn, setStatsIn] = useState(false);

  /* The typed name lives in the page's React state (shared with the start
     pass) and nowhere else: nothing is sent until the visitor books. */
  const nameRef = useRef("");
  nameRef.current = name;

  /* The name rebuilds 420ms after typing stops, as in the reference. */
  useEffect(
    function rebuildName() {
      if (!handleRef.current) return;
      const t = window.setTimeout(() => handleRef.current?.setName(), 420);
      return () => window.clearTimeout(t);
    },
    [name],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleRef.current?.setName();
    (document.activeElement as HTMLElement | null)?.blur();
  }

  /* Once there's a name, the CTA books for that business. */
  const biz = name.trim();
  const ctaLabel =
    biz && biz.length <= 18
      ? `Book ${biz}${/s$/i.test(biz) ? "\u2019" : "\u2019s"} call \u2191`
      : "Book a discovery call \u2191";
  const handleRef = useRef<FilmHandle | null>(null);

  useEffect(function startEngine() {
    const film = filmRef.current;
    const stage = stageRef.current;
    if (!film || !stage) return;
    let cancelled = false;

    /* Within one viewport of the film, fetch the chunk. */
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || cancelled) return;
        io.disconnect();
        import("./engine")
          .then((mod) => {
            if (cancelled || !filmRef.current) return;
            handleRef.current = mod.mount(stage, {
              film,
              light: lightRef.current!,
              layers: {
                partners: partnersRef.current!,
                services: servicesRef.current!,
                work: workRef.current!,
                signature: signatureRef.current!,
                finale: finaleRef.current!,
              },
              marks: Array.from(marksRef.current!.querySelectorAll<HTMLElement>(".hf-mark")),
              vIntro: vIntroRef.current!,
              beats: Array.from(beatsRef.current!.children) as HTMLElement[],
              rail: Array.from(railRef.current!.children) as HTMLElement[],
              wTop: wTopRef.current!,
              credits: Array.from(creditsRef.current!.children) as HTMLElement[],
              counter: counterRef.current!,
              screenLink: screenLinkRef.current ?? undefined,
              sigCanvas: sigCanvasRef.current!,
              sigSvg: sigSvgRef.current!,
              sigWord: sigWordRef.current!,
              outs: Array.from(outsRef.current!.children) as HTMLElement[],
              outsWrap: outsRef.current!,
              fTop: fTopRef.current!,
              fBot: fBotRef.current!,
              ts: tsRef.current!,
              getName: () => nameRef.current,
              getHold: () => holdRef.current,
              /* The stats ride the partners act's own progress, the same
                 value that fades the marks in — not a second observer
                 that would fight the pin. */
              onPartnersIn: () => setStatsIn(true),
            });
          })
          .catch((err) => {
            /* No WebGL, a blocked chunk, a throw: every line of copy
               still reads on the stage's own gradient, in order. */
            if (import.meta.env.DEV) console.warn("home film: engine unavailable", err);
            /* No engine means no progress callback, so the figures would
               sit at 0 forever. The act still reads on the gradient. */
            setStatsIn(true);
          });
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(film);

    return function stop() {
      cancelled = true;
      io.disconnect();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  /* 0 -> n over 700ms, ease-out, 80ms apart, once. Starts the
     moment the row reveals, not after its entrance. */
  useEffect(
    function countUp() {
      if (!statsIn || countedRef.current) return;
      countedRef.current = true;
      const els = statNumRefs.current;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        STATS.forEach((s, i) => {
          const el = els[i];
          if (el) el.textContent = String(s.n);
        });
        if (leadNumRef.current) leadNumRef.current.textContent = String(LEAD_STAT.n);
        return;
      }
      let raf = 0;
      const t0 = performance.now();
      const DUR = 700;
      const STEP = 80;
      (function frame(now: number) {
        let running = false;
        /* easeOutCubic — fast off the mark, settles onto the figure */
        const ease = (k: number) => 1 - Math.pow(1 - k, 3);
        /* the lead runs with the first of the four, no stagger */
        const lead = leadNumRef.current;
        if (lead) {
          const k = Math.max(0, Math.min(1, (now - t0) / DUR));
          lead.textContent = String(Math.round(LEAD_STAT.n * ease(k)));
          if (k < 1) running = true;
        }
        STATS.forEach((s, i) => {
          const el = els[i];
          if (!el) return;
          const k = Math.max(0, Math.min(1, (now - t0 - i * STEP) / DUR));
          el.textContent = String(Math.round(s.n * ease(k)));
          if (k < 1) running = true;
        });
        if (running) raf = requestAnimationFrame(frame);
      })(t0);
      return function stop() {
        if (raf) cancelAnimationFrame(raf);
      };
    },
    [statsIn]
  );

  /* The finale's CTA drops straight down to the start pass. */
  function toStart(e: MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById("start");
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="hf-film" ref={filmRef}>
      <div className="hf-stage" ref={stageRef}>
        <div className="hf-light" ref={lightRef} aria-hidden="true" />
        <canvas data-layer="film" aria-hidden="true" />
        <div className="hf-grain" aria-hidden="true" />

        <div className="hf-ov">
          {/* ── 1 · partners ─────────────────────────────────────── */}
          <section className="hf-layer" ref={partnersRef} aria-label="Partners and clients">
            <div className="hf-center">
              <span className="hf-eyebrow">Partners and clients</span>
              {/* The min came down from 40px so the act clears the nav on a
                  390px phone once the figures are under it; 6vw still
                  governs from ~500px up, so nothing wider changes. */}
              <h2 className="hf-xl hf-glow" style={{ fontSize: "clamp(25px,4.92vw,89px)" }}>
                In good company.
              </h2>
              <div className="hf-marks" ref={marksRef}>
                <div className="hf-row hf-row--p">
                  {PARTNERS.map((p) => (
                    <div className="hf-mark" key={p.name}>
                      <span className="hf-plate">
                        <img src={p.logo} alt={p.name} />
                      </span>
                      <small>Partner</small>
                    </div>
                  ))}
                </div>
                <div className="hf-row hf-row--c">
                  {CLIENTS.map((c) => (
                    <div className="hf-mark" key={c}>
                      <b>{c}</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* The figures. Deliberately NOT inside `.hf-marks`: the
                  engine drives every `.hf-mark` in there by the act's
                  own progress, and these have their own entrance. */}

              {/* The lead figure. "$" and "M" are text nodes in the same
                  span as the number, so one `background-clip: text` ramp
                  runs across all of "$90M" — and they are not <i>, which
                  would render them italic. */}
              <div className={`hf-lead${statsIn ? " in" : ""}`}>
                <span className="hf-leadn" aria-hidden="true">
                  {LEAD_STAT.prefix}
                  <b ref={leadNumRef}>{countedRef.current ? LEAD_STAT.n : 0}</b>
                  {LEAD_STAT.suffix}
                </span>
                <span className="hf-leadl" aria-hidden="true">{LEAD_STAT.label}</span>
                <span className="hf-sr">
                  {`${LEAD_STAT.prefix}${LEAD_STAT.n}${LEAD_STAT.suffix} in ${LEAD_STAT.label}`}
                </span>
              </div>

              <ul className={`hf-stats${statsIn ? " in" : ""}`}>
                {STATS.map((s, i) => (
                  <li
                    className="hf-stat"
                    key={s.label}
                    style={{ "--c": s.color, "--i": i } as CSSProperties}
                  >
                    {/* The counting number is decorative: it is mid-count
                        for most of its life and would read as noise. The
                        real figure is the hf-sr line below. */}
                    <span className="hf-statn" aria-hidden="true">
                      <b ref={(el) => void (statNumRefs.current[i] = el)}>
                        {countedRef.current ? s.n : 0}
                      </b>
                      <i>{s.suffix}</i>
                    </span>
                    <span className="hf-statl" aria-hidden="true">
                      {s.label}
                    </span>
                    <span className="hf-sr">{`${s.n}${s.suffix} ${s.label}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── 2 · services ─────────────────────────────────────── */}
          <section className="hf-layer" ref={servicesRef} aria-label="Services">
            <div className="hf-center hf-glow" ref={vIntroRef}>
              <span className="hf-eyebrow">What we do</span>
              <h2 className="hf-xl">
                Four services.
                <br />
                One team.
              </h2>
            </div>
            <div ref={beatsRef}>
              {SERVICES.map((s, i) => (
                <article
                  className="hf-beat hf-glow"
                  key={s.name}
                  style={{ "--c": s.color } as CSSProperties}
                >
                  <div className="hf-k">
                    <i />
                    {`0${i + 1} / 04 · What we do`}
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.line}</p>
                  <div className="hf-inc">
                    {s.inc.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {/* decorative: every name is already a heading above */}
            <div className="hf-rail" ref={railRef} aria-hidden="true">
              {SERVICES.map((s) => (
                <span key={s.name} style={{ "--c": s.color } as CSSProperties}>
                  {s.name}
                  <i />
                </span>
              ))}
            </div>
          </section>

          {/* ── 3 · work ─────────────────────────────────────────── */}
          <section className="hf-layer" ref={workRef} aria-label="Our work">
            <div className="hf-wtop hf-glow" ref={wTopRef}>
              <span className="hf-eyebrow">The work</span>
              <h2 className="hf-xl" style={{ fontSize: "clamp(33px,4.92vw,89px)" }}>
                Here's what that looks like.
              </h2>
            </div>
            <div ref={creditsRef}>
              {PROJECTS.map((p, i) => (
                <div
                  className="hf-credit hf-glow"
                  key={p.name}
                  style={{ display: i === 0 ? undefined : "none", opacity: 0 }}
                >
                  <div className="hf-chips">
                    {p.chips.map(([n, c]) => (
                      <span className="hf-chip" key={n} style={{ "--c": c } as CSSProperties}>
                        <i />
                        {n}
                      </span>
                    ))}
                  </div>
                  <h3>
                    <Link to="/work" className="hf-namelink">{p.name}</Link>
                  </h3>
                  <p>{p.line}</p>
                  {/* Into the Work index, not the single case study: visitors
                      land where they can see every project, not just this one. */}
                  <Link to="/work" style={{ "--c": p.color } as CSSProperties}>
                    See all our work →
                  </Link>
                </div>
              ))}
            </div>
            {/* Sits exactly over the front screen; the engine places it each frame. */}
            <Link to="/work" className="hf-screenlink" ref={screenLinkRef} aria-label="See all our work" />
            <div className="hf-counter" ref={counterRef} aria-hidden="true">
              <b>01</b> / 03
            </div>
          </section>

          {/* ── 4 · signature ────────────────────────────────────── */}
          <section className="hf-layer hf-layer--sig" ref={signatureRef} aria-label="Signature">
            <canvas ref={sigCanvasRef} aria-hidden="true" />
            <svg ref={sigSvgRef} aria-hidden="true">
              <defs>
                <mask id="hf-sig-mask">
                  <rect width="100%" height="100%" fill="#fff" />
                  <text
                    ref={sigWordRef}
                    x="50%"
                    y="52%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
                    fontWeight="600"
                    letterSpacing="-0.05em"
                    fill="#000"
                  >
                    signature
                  </text>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#080A0A" mask="url(#hf-sig-mask)" />
            </svg>
            {/* Owner ruling: the act's h2 is the whole sentence, laid out
                exactly as the reference drew it — the eyebrow above the
                line — so nothing changes visually. */}
            <h2 className="hf-cap hf-cap--t">
              <span className="hf-eyebrow">Every site we build</span>
              <span className="hf-sigline">gets one thing nobody else has.</span>
            </h2>
            <div className="hf-cap hf-cap--b">
              <p>A signature moment, designed from your world.</p>
              <span className="hf-hint">Move your cursor through the letters</span>
            </div>
          </section>

          {/* ── 5 · yours next ───────────────────────────────────── */}
          <section className="hf-layer" ref={finaleRef} aria-label="Yours next">
            <div className="hf-ftop hf-glow" ref={fTopRef}>
              <span className="hf-eyebrow">Yours next</span>
              <h2>What would it look like for you?</h2>
              <form className="hf-field" autoComplete="off" onSubmit={onSubmit}>
                <label className="hf-sr" htmlFor="hf-biz">
                  Your business name
                </label>
                <input
                  id="hf-biz"
                  maxLength={28}
                  placeholder="Type your business name"
                  value={name}
                  onChange={(e) => onName(e.target.value)}
                />
                <button type="submit">Build it</button>
              </form>
              <span className="hf-hint">Watch it build · nothing is sent until you book</span>
            </div>
            <div ref={outsRef}>
              {OUTCOMES.map(([n, c, txt]) => (
                <div className="hf-out" key={n} style={{ "--c": c } as CSSProperties}>
                  <i />
                  <div>
                    <small>{n}</small>
                    {txt}
                  </div>
                </div>
              ))}
            </div>
            <div className="hf-fbot hf-glow" ref={fBotRef}>
              <p className="hf-ts" ref={tsRef}>
                Taken seriously.
              </p>
              {/* back up to the start pass, already filled in */}
              <a className="hf-cta" href="#start" onClick={toStart}>
                {ctaLabel}
              </a>
              <span className="hf-prev">Preview · what your business could look like with us</span>
            </div>
          </section>
        </div>
      </div>
      {pass && (
        <div className="hf-pass" ref={passRef}>
          {pass}
        </div>
      )}
    </div>
  );
}
