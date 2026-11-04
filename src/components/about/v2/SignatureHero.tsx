import { useCallback, useEffect, useRef } from "react";
import { MARK_PATH_D } from "../../MonogramMark";
import { embedRequested, openModal, warmEmbed } from "../../services/passBooking";
import Portrait from "./Portrait";
import { clamp, easeInOut, isDesktop, prefersReducedMotion } from "./useSectionProgress";

/**
 * The signature hero: a pen writes the PU monogram, the mark fills and
 * is swept with light, then scrolling pans it aside and opens the
 * founder's portrait while the headline lights word by word.
 *
 * The mark's path is `MARK_PATH_D` from MonogramMark — the repo's
 * single source, byte-identical to the reference's own copy, so it is
 * imported rather than duplicated.
 *
 * Every scroll-linked value is written straight onto the stage node as
 * a custom property. The page's one rAF calls `onProgress`; nothing
 * here touches React state while scrolling.
 *
 * Below 900px nothing pins: the stylesheet lays the mark, name,
 * portrait, text and credits out in order and fully shown, and the
 * tick sets `--r: 1` / `--m: 0` so the portrait is simply there.
 */

/**
 * The headline, split exactly as the reference splits it: every
 * non-space run becomes its own lit word, which makes the full stop
 * the ninth and last one. It matters — the lighting is
 * `round(progress × words.length)`, so eight words would light on a
 * different schedule and the sentence would finish a beat early.
 *
 * `gradient` is the phrase set in the studio gradient; `space` is
 * false where the reference's markup has no whitespace before the
 * token, which is only the full stop.
 */
const WORDS: { text: string; gradient?: boolean; space?: boolean }[] = [
  { text: "You" },
  { text: "work", space: true },
  { text: "directly", space: true },
  { text: "with", space: true },
  { text: "the", space: true },
  { text: "person", space: true },
  { text: "who", space: true },
  { text: "builds it", gradient: true, space: true },
  { text: "." },
];

export default function SignatureHero({
  sectionRef,
  progressRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  /** The page's rAF calls whatever this holds. */
  progressRef: React.MutableRefObject<(p: number) => void>;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const strokeRef = useRef<SVGPathElement | null>(null);
  const penRef = useRef<SVGCircleElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const creditRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  /* ── the pen writes the mark ─────────────────────────────────── */
  useEffect(function sign() {
    const path = strokeRef.current;
    const stage = stageRef.current;
    if (!path || !stage) return;

    const L = path.getTotalLength();
    path.style.strokeDasharray = String(L);
    path.style.strokeDashoffset = String(L);

    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      stage.classList.add("signed");
      return;
    }

    let raf = 0;
    const start = window.setTimeout(function begin() {
      const t0 = performance.now();
      (function frame(now: number) {
        const k = Math.min(1, (now - t0) / 2600);
        const e = easeInOut(k);
        path.style.strokeDashoffset = String(L * (1 - e));
        const pen = penRef.current;
        if (pen) {
          const pt = path.getPointAtLength(L * e);
          pen.setAttribute("cx", String(pt.x));
          pen.setAttribute("cy", String(pt.y));
        }
        if (k < 1) raf = requestAnimationFrame(frame);
        else stage.classList.add("signed");
      })(t0);
    }, 350);

    return function stop() {
      window.clearTimeout(start);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── tilt toward the pointer ─────────────────────────────────── */
  useEffect(function tilt() {
    const stage = stageRef.current;
    if (!stage) return;
    if (prefersReducedMotion()) return;

    function move(e: PointerEvent) {
      const mark = markRef.current;
      if (!mark || !isDesktop() || e.pointerType !== "mouse") return;
      const r = mark.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mark.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
      mark.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
    }
    function leave() {
      const mark = markRef.current;
      if (!mark) return;
      mark.style.setProperty("--ry", "0deg");
      mark.style.setProperty("--rx", "0deg");
    }

    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return function stop() {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  /* ── scroll ──────────────────────────────────────────────────── */
  const onProgress = useCallback(function onProgress(p: number) {
    const stage = stageRef.current;
    if (!stage) return;

    if (!isDesktop()) {
      /* unpinned: the portrait is simply present, the mark is clean */
      stage.style.setProperty("--r", "1");
      stage.style.setProperty("--m", "0");
      return;
    }

    /* the mark pans aside and shrinks over the first 35% */
    stage.style.setProperty("--p", easeInOut(clamp(p / 0.35)).toFixed(3));
    /* the text block slides in and fades up behind it */
    stage.style.setProperty("--q", clamp((p - 0.18) / 0.17).toFixed(3));
    /* the photo shows through the mark, then the portrait opens */
    stage.style.setProperty("--m", clamp((p - 0.06) / 0.14).toFixed(3));
    stage.style.setProperty("--r", easeInOut(clamp((p - 0.2) / 0.18)).toFixed(3));

    const lit = Math.round(clamp((p - 0.25) / 0.25) * WORDS.length);
    wordRefs.current.forEach((w, i) => w?.classList.toggle("on", i < lit));
    creditRefs.current.forEach((c, i) => c?.classList.toggle("on", p > 0.5 + i * 0.06));
    ctaRef.current?.classList.toggle("on", p > 0.82);
  }, []);

  /* The page owns the rAF; this just hands it the callback. */
  progressRef.current = onProgress;

  /* ── booking, exactly as /services loads it ──────────────────── */
  const warm = useCallback(function intent() {
    if (!embedRequested()) warmEmbed().catch(() => undefined);
  }, []);
  const book = useCallback(function book() {
    /* no date: this CTA has no picked day, so Cal opens on its own
       next available slot rather than an empty one */
    openModal({ notes: "About page" }).catch(() => undefined);
  }, []);

  return (
    <section className="sig" id="sig" aria-labelledby="ab-h1" ref={sectionRef}>
      <div className="sigstage" ref={stageRef}>
        <div className="sigbg" aria-hidden="true" />

        <div className="markpos">
          <div className="markin" ref={markRef}>
            <svg viewBox="0 0 327 454" role="img" aria-label="Prachets Upadhyay monogram">
              <defs>
                <clipPath id="mclip">
                  <path d={MARK_PATH_D} fillRule="evenodd" />
                </clipPath>
              </defs>
              <path className="mfill" d={MARK_PATH_D} fill="url(#mfillg)" fillRule="evenodd" />
              <g clipPath="url(#mclip)">
                <image
                  className="mphoto"
                  href="/about/portrait.webp"
                  x="-40"
                  y="-10"
                  width="407"
                  height="509"
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>
              <g clipPath="url(#mclip)">
                <rect className="sheen" x="0" y="0" width="140" height="454" fill="url(#sheeng)" />
              </g>
              <path className="mstroke" d={MARK_PATH_D} ref={strokeRef} fillRule="evenodd" />
              <circle className="pen" r="4.5" cx="-20" cy="-20" ref={penRef} />
            </svg>
          </div>
        </div>

        <div className="signame">
          <b>Prachets Upadhyay</b>
          <span className="mono">Founder · Averr Studios · Toronto</span>
        </div>

        <Portrait />

        <div className="cue" aria-hidden="true">
          <i />
          Scroll
        </div>

        <div className="sigtext">
          <span className="eyebrow">About Averr</span>
          <h1 id="ab-h1">
            {WORDS.map(function word(w, i) {
              return (
                <span key={w.text + i}>
                  {w.space ? " " : null}
                  <span
                    className={w.gradient ? "gt w" : "w"}
                    ref={(el) => {
                      wordRefs.current[i] = el;
                    }}
                  >
                    {w.text}
                  </span>
                </span>
              );
            })}
          </h1>
          <p className="sub">
            The studio for founders who care how they show up. A small number of
            projects at a time, each one finished.
          </p>

          <div className="credits">
            {CREDITS.map(function credit(c, i) {
              return (
                <div
                  className="cr"
                  key={c[0]}
                  ref={(el) => {
                    creditRefs.current[i] = el;
                  }}
                >
                  <b>{c[0]}</b>
                  <span>{c[1]}</span>
                </div>
              );
            })}
          </div>

          <div className="sigcta" ref={ctaRef}>
            <button
              className="btn"
              type="button"
              onMouseEnter={warm}
              onFocus={warm}
              onPointerDown={warm}
              onClick={book}
            >
              Book a call →
            </button>
            <a
              className="pill"
              href="https://www.linkedin.com/in/prachetsupadhyay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn, opens in a new tab"
            >
              LinkedIn ↗
            </a>
            <a
              className="pill"
              href="https://prachetsupadhyay.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio, opens in a new tab"
            >
              Portfolio ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const CREDITS: [string, string][] = [
  ["Founder", "Averr Studios"],
  ["Co-founded", "KlaasX Edutech · 15-person team · 150+ institutions"],
  ["Sales", "B2B SaaS for Google"],
  ["Craft", "Design engineering, frontend, AI workflow automation"],
  ["Based", "Toronto"],
];
