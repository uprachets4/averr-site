import { useCallback, useEffect, useRef } from "react";
import {
  PRINCIPLES,
  TREND_STYLES,
  TREND_TAG,
  type TrendStyle,
} from "../../../data/aboutPrinciples";
import KineticWord from "./KineticWord";
import ProofCraft from "./ProofCraft";
import ProofDirection from "./ProofDirection";
import ProofMotion, { type MotionDemoHandle } from "./ProofMotion";
import ProofTimeless from "./ProofTimeless";
import { clamp, prefersReducedMotion } from "./useSectionProgress";

/**
 * "How we think" — four giant words, each acting out its meaning as
 * you scroll, with a proof panel that rises once the word lands.
 *
 * The section is `4 × 90vh + 100vh` (owner's ruling; the spec's 110vh
 * was an error), and `4 × 95svh + 100svh` below 900px. Its progress
 * splits into four equal segments, so word `i` owns `p` in
 * `[i/4, (i+1)/4)` and `t` is that word's own 0–1 within it.
 *
 * This section renders ONCE and holds no React state at all. Letter
 * transforms, word classes, the trend chips, the counter, the
 * principle lines and the dot fills are all written straight onto the
 * nodes.
 *
 * That is not only about cost. The word classes (`on`, `done`,
 * `proofon`, `chaos`, `calm`) are managed imperatively, and ANY
 * re-render would reconcile `className` back to what the JSX says and
 * silently wipe them — which is exactly what happened when the trend
 * index was briefly held in state: TIMELESS lost its `on` class on
 * every flip. Keep this component stateless.
 */

/** The reference's easeInOutCubic — NOT the hero's quad. */
const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/**
 * mulberry32, seeded 7, exactly as the reference seeds it.
 *
 * The offsets below are drawn in one unbroken sequence — CRAFT's five
 * letters (4 draws each), then DIRECTION's nine (3 each), then
 * MOTION's six (6 each). The ORDER is part of the design: re-order
 * these loops and every letter lands somewhere else.
 */
function makeRandom(seed: number) {
  let s = seed;
  return function rnd() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type CraftOffset = { x: number; y: number; r: number; s: number };
type DirOffset = { a: number; v: number };
type MotOffset = {
  bx: string;
  by: string;
  br: string;
  bs: string;
  bd: string;
  dl: string;
};

function buildOffsets(lens: number[]) {
  const rnd = makeRandom(7);
  const R = (a: number, b: number) => a + (b - a) * rnd();

  const craft: CraftOffset[] = Array.from({ length: lens[0] }, (_, i) => ({
    x: R(-0.2, 0.2) * (i === 0 || i === lens[0] - 1 ? 0.4 : 1),
    y: R(-0.3, 0.3),
    r: R(-24, 24),
    s: R(0.74, 1.22),
  }));

  const dir: DirOffset[] = Array.from({ length: lens[1] }, () => ({
    a: R(0, 360),
    v: R(90, 260) * (rnd() < 0.5 ? -1 : 1),
  }));

  const mot: MotOffset[] = Array.from({ length: lens[2] }, () => ({
    bx: R(-0.25, 0.25).toFixed(2) + "em",
    by: R(-0.4, 0.4).toFixed(2) + "em",
    br: R(-24, 24).toFixed(0) + "deg",
    bs: R(0.8, 1.25).toFixed(2),
    /* `--bd` is the bounce DURATION. The reference renamed it from
       `--d` after colliding with a registered percentage; never reuse
       a name another property might register (spec 33, step 2 note). */
    bd: R(0.35, 0.8).toFixed(2) + "s",
    dl: R(-0.8, 0).toFixed(2) + "s",
  }));

  return { craft, dir, mot };
}

export default function Principles({
  sectionRef,
  progressRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  progressRef: React.MutableRefObject<(p: number) => void>;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wdRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterRefs = useRef<HTMLSpanElement[][]>([[], [], [], []]);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const demo = useRef<MotionDemoHandle | null>(null);
  const chipRefs = useRef<HTMLSpanElement[]>([]);

  const offsets = useRef(
    buildOffsets(PRINCIPLES.map((p) => [...p.word].length))
  ).current;

  /* Live, non-React state for the scroll loop. */
  const active = useRef(-1);
  const motState = useRef("");
  const trendStyle = useRef<TrendStyle | "">("");
  const spinRaf = useRef(0);
  const dirT = useRef(0);
  const settleTimer = useRef(0);

  /* ── per-word behaviours ─────────────────────────────────────── */

  const craft = useCallback(
    function craft(t: number) {
      const ls = letterRefs.current[0];
      let all = true;
      ls.forEach(function place(l, i) {
        const e = ease(clamp((t - 0.02 - i * 0.05) / 0.32));
        if (e < 1) all = false;
        const c = offsets.craft[i];
        const k = 1 - e;
        l.style.transform =
          `translate(${(c.x * k).toFixed(3)}em,${(c.y * k).toFixed(3)}em) ` +
          `rotate(${(c.r * k).toFixed(1)}deg) ` +
          `scale(${(1 + (c.s - 1) * k).toFixed(3)})`;
      });
      const el = wordRefs.current[0];
      el?.classList.toggle("done", all);
      el?.classList.toggle("proofon", all);
      const tag = tagRefs.current[0];
      if (tag)
        tag.textContent = all
          ? PRINCIPLES[0].tagAfter
          : PRINCIPLES[0].tagBefore;
    },
    [offsets]
  );

  const direction = useCallback(
    function direction(t: number, time: number) {
      const ls = letterRefs.current[1];
      const reduce = prefersReducedMotion();
      let all = true;
      ls.forEach(function spinLetter(l, i) {
        const d = offsets.dir[i];
        const e = ease(clamp((t - 0.04 - i * 0.04) / 0.2));
        if (e < 1) all = false;
        const a = (((d.a + (reduce ? 0 : time * d.v)) % 360) + 540) % 360 - 180;
        l.style.transform = `rotate(${(a * (1 - e)).toFixed(1)}deg)`;
        l.classList.toggle("lk", e >= 1);
      });
      const el = wordRefs.current[1];
      el?.classList.toggle("done", all);
      el?.classList.toggle("proofon", all);
      const tag = tagRefs.current[1];
      if (tag)
        tag.textContent = all
          ? PRINCIPLES[1].tagAfter
          : PRINCIPLES[1].tagBefore;
    },
    [offsets]
  );

  /* DIRECTION spins on its own rAF, ONLY while it is the active word,
     and is cancelled the moment it isn't. */
  const spin = useCallback(
    function spin() {
      cancelAnimationFrame(spinRaf.current);
      const frame = (now: number) => {
        direction(dirT.current, now / 1000);
        spinRaf.current = requestAnimationFrame(frame);
      };
      spinRaf.current = requestAnimationFrame(frame);
    },
    [direction]
  );

  const motion = useCallback(function motion(t: number) {
    const s = t < 0.36 ? "chaos" : "calm";
    if (s === motState.current) return;
    motState.current = s;
    const el = wordRefs.current[2];
    if (!el) return;
    window.clearTimeout(settleTimer.current);
    el.classList.remove("chaos", "calm", "settled");
    void el.offsetWidth;
    el.classList.add(s);
    const tag = tagRefs.current[2];
    if (tag)
      tag.textContent =
        s === "calm" ? PRINCIPLES[2].tagAfter : PRINCIPLES[2].tagBefore;
    el.classList.toggle("done", s === "calm");
    el.classList.toggle("proofon", s === "calm");
    if (s === "calm") {
      settleTimer.current = window.setTimeout(function settle() {
        el.classList.add("settled");
      }, 1400);
      demo.current?.play();
    } else {
      demo.current?.stop();
    }
  }, []);

  const timeless = useCallback(function timeless(t: number) {
    const k = Math.min(4, Math.floor(t / 0.16));
    const s = TREND_STYLES[k];
    if (s === trendStyle.current) return;
    trendStyle.current = s;
    const el = wordRefs.current[3];
    if (!el) return;
    el.dataset.style = s;
    el.classList.remove("flick");
    void el.offsetWidth;
    if (!prefersReducedMotion()) el.classList.add("flick");
    fit(3);
    const tag = tagRefs.current[3];
    if (tag) tag.textContent = TREND_TAG[s];
    el.classList.toggle("done", s === "clean");
    chipRefs.current.forEach(function mark(c, j) {
      c.classList.toggle("past", j < k);
      c.classList.toggle("cur", j === k);
    });
  }, []);

  /* ── fit each word to the screen ─────────────────────────────── */

  const fitCache = useRef<Record<string, number>>({});
  function fit(k: number) {
    const wd = wdRefs.current[k];
    const word = wordRefs.current[k];
    if (!wd || !word) return;
    const st = word.dataset.style || "";
    const key = `${k}${st}${window.innerWidth}x${window.innerHeight}`;
    if (!fitCache.current[key]) {
      wd.style.setProperty("--fs", "100px");
      /* Measure the LETTERS, not the furniture.
         CRAFT's two `.guide` rules live inside `.wd` and overhang it
         by 4% a side, so they land in `scrollWidth` — and they are
         `scaleX(0)` until CRAFT settles, which made the measured
         width, and therefore the cached size, depend on whether the
         word happened to be settled when the cache first filled.
         Same word, same viewport, two different sizes. Taking them
         out of the measurement makes it depend only on the type. */
      const guides = [...wd.querySelectorAll<HTMLElement>(".guide")];
      for (const g of guides) g.style.display = "none";
      const width = wd.scrollWidth;
      for (const g of guides) g.style.removeProperty("display");
      if (!width) return;
      const narrow = window.innerWidth <= 900;
      const byW = ((window.innerWidth * (narrow ? 0.9 : 0.84)) / width) * 100;
      const byH = (window.innerHeight * (narrow ? 0.16 : 0.2)) / 0.72;
      fitCache.current[key] = Math.min(byW, byH);
    }
    wd.style.setProperty("--fs", fitCache.current[key].toFixed(1) + "px");
  }

  /* ── the word that is showing ────────────────────────────────── */

  const setActive = useCallback(
    function setActive(i: number) {
      if (i === active.current) return;
      active.current = i;
      wordRefs.current.forEach((w, k) => w?.classList.toggle("on", k === i));
      lineRefs.current.forEach((p, k) => p?.classList.toggle("on", k === i));
      stageRef.current?.style.setProperty("--kc", PRINCIPLES[i].color);
      if (countRef.current) countRef.current.textContent = `${i + 1} / 4`;
      fit(i);
      cancelAnimationFrame(spinRaf.current);
      if (i === 1) spin();
      if (i !== 2) demo.current?.stop();
    },
    [spin]
  );

  /* ── scroll ──────────────────────────────────────────────────── */

  const onProgress = useCallback(
    function onProgress(p: number) {
      const seg = p * 4;
      const i = Math.min(3, Math.floor(seg));
      const t = i === 3 ? clamp(seg - 3) : clamp(seg - i);

      setActive(i);

      /* CRAFT holds its settled state once you are past it. */
      craft(i === 0 ? t : 1);

      if (i === 1) dirT.current = t;
      else direction(i > 1 ? 1 : 0, 0);

      if (i === 2) motion(t);
      else if (i < 2) {
        motState.current = "";
        wordRefs.current[2]?.classList.remove("chaos", "calm", "settled");
      }

      timeless(i === 3 ? t : 0);

      dotRefs.current.forEach((d, k) =>
        d?.style.setProperty("--f", String(k < i ? 1 : k === i ? t : 0))
      );
    },
    [craft, direction, motion, setActive, timeless]
  );

  progressRef.current = onProgress;

  /* ── fit on mount and on resize ──────────────────────────────── */

  useEffect(
    function fitAll() {
      function refitAll() {
        fitCache.current = {};
        PRINCIPLES.forEach((_, k) => fit(k));
      }

      fit(active.current < 0 ? 0 : active.current);

      /* The first fit can land before Geist has loaded, and then the
         cache holds a size measured in the fallback face — at 390 that
         was 112.9px against the 119.4px the real type wants, cached
         for the rest of the page's life. Re-measure once the fonts
         are in. This is the other half of making the fit depend only
         on the type: the guides are out of the measurement, and now
         the measurement waits for the face it is measuring. */
      let alive = true;
      document.fonts?.ready.then(function refit() {
        if (alive) refitAll();
      });

      window.addEventListener("resize", refitAll, { passive: true });
      return function stop() {
        alive = false;
        window.removeEventListener("resize", refitAll);
      };
    },
    []
  );

  /* MOTION's bounce is per letter: each one gets its own offsets,
     scale, duration (`--bd`) and negative delay, so the chaos reads as
     six independent objects rather than one synchronised wobble.
     Written once, straight onto the nodes. Child effects run before
     the parent's, so the letters are registered by the time this
     runs. */
  useEffect(
    function applyBounce() {
      letterRefs.current[2]?.forEach(function set(l, i) {
        const m = offsets.mot[i];
        if (!l || !m) return;
        l.style.setProperty("--bx", m.bx);
        l.style.setProperty("--by", m.by);
        l.style.setProperty("--br", m.br);
        l.style.setProperty("--bs", m.bs);
        l.style.setProperty("--bd", m.bd);
        l.style.setProperty("--dl", m.dl);
      });
    },
    [offsets]
  );

  useEffect(function stopRaf() {
    return function cancel() {
      cancelAnimationFrame(spinRaf.current);
      window.clearTimeout(settleTimer.current);
    };
  }, []);

  /* ── MOTION's letters lift toward the cursor, once settled ───── */

  useEffect(function lift() {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    function move(e: PointerEvent) {
      if (
        active.current !== 2 ||
        !wordRefs.current[2]?.classList.contains("settled") ||
        e.pointerType !== "mouse"
      )
        return;
      letterRefs.current[2].forEach(function pull(l) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(
          e.clientX - (r.left + r.width / 2),
          e.clientY - (r.top + r.height / 2)
        );
        l.style.setProperty(
          "--lift",
          (-Math.max(0, 1 - d / 260) * 0.14).toFixed(3) + "em"
        );
      });
    }
    function leave() {
      letterRefs.current[2].forEach((l) => l.style.setProperty("--lift", "0em"));
    }
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    return function stop() {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  /* ── the dots jump to (i + .06)/4 of the section ─────────────── */

  const jump = useCallback(
    function jump(i: number) {
      const sec = sectionRef.current;
      if (!sec) return;
      const top = window.scrollY + sec.getBoundingClientRect().top;
      const frac = (i + 0.06) / 4;
      window.scrollTo({
        top: top + (sec.offsetHeight - window.innerHeight) * frac,
        /* Reduced motion jumps rather than scrolls. */
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [sectionRef]
  );

  const proofs = [
    <ProofCraft key="craft" />,
    <ProofDirection key="dir" />,
    <ProofMotion key="mot" handleRef={demo} />,
    <ProofTimeless
      key="tim"
      chipsRef={(els) => {
        chipRefs.current = els;
      }}
    />,
  ];

  return (
    <section className="kw" id="kw" aria-label="How we think" ref={sectionRef}>
      <div className="kwstage" ref={stageRef}>
        <div className="kwbg" aria-hidden="true" />

        <div className="kwtop wrap gut">
          <span className="eyebrow">How we think</span>
          <span className="kwcount mono" ref={countRef}>
            1 / 4
          </span>
        </div>

        <div className="words">
          {PRINCIPLES.map(function word(pr, i) {
            return (
              <KineticWord
                key={pr.id}
                principle={pr}
                index={i}
                wordRef={(el) => {
                  wordRefs.current[i] = el;
                }}
                wdRef={(el) => {
                  wdRefs.current[i] = el;
                }}
                tagRef={(el) => {
                  tagRefs.current[i] = el;
                }}
                lettersRef={(els) => {
                  letterRefs.current[i] = els;
                }}
              >
                {proofs[i]}
              </KineticWord>
            );
          })}
        </div>

        <div className="kwbot wrap gut">
          {/* The words are aria-hidden; these lines carry their meaning. */}
          <div className="lines" aria-live="polite">
            {PRINCIPLES.map(function line(pr, i) {
              return (
                <p
                  className={`kl${i === 0 ? " on" : ""}`}
                  key={pr.id}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                >
                  <b>
                    Principle {i + 1} of 4 · {pr.name}
                  </b>
                  {pr.line}
                </p>
              );
            })}
          </div>

          <div className="kdots">
            {PRINCIPLES.map(function dot(pr, i) {
              return (
                <button
                  type="button"
                  key={pr.id}
                  aria-label={`Principle ${i + 1}: ${pr.name}`}
                  onClick={() => jump(i)}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
