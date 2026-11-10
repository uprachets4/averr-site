import { useCallback, useEffect, useRef } from "react";
import {
  CAMERA_X,
  DETAIL_DONE,
  LINE_D,
  PROCESS,
  STEP_X,
} from "../../../data/aboutProcess";
import LineScenes, { LineDefs } from "./LineScenes";
import StepCard from "./StepCard";
import { clamp, prefersReducedMotion } from "./useSectionProgress";

/**
 * "How we work" — one continuous pen line draws five scenes, with a
 * camera that follows the pen and a step card for each stage.
 *
 * Like `Principles`, this renders ONCE and holds no React state. The
 * rail's fills, the step card classes, the scene `on` classes, the
 * dash offset, the pen position and the camera transform are all
 * written straight onto the nodes from the page's single rAF. A
 * re-render would reconcile `className` back to the JSX and wipe the
 * classes the scroll loop sets — the bug step 3 hit.
 */

/** The SVG's own coordinate height; the drawing is scaled from it. */
const VIEW_H = 600;
const VIEW_W = 5000;

export default function OneLine({
  sectionRef,
  progressRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  progressRef: React.MutableRefObject<(p: number) => void>;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowRef = useRef<SVGPathElement | null>(null);
  const ghostRef = useRef<SVGPathElement | null>(null);
  const penRef = useRef<SVGCircleElement | null>(null);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const detRefs = useRef<SVGGElement[]>([]);

  /** Total path length, measured once the path is in the document. */
  const len = useRef(0);
  /**
   * Where each step begins, as a fraction of the path.
   *
   * Found by walking the path and noting where it first crosses each
   * panel's x — the line's own geometry decides how much scroll a step
   * gets, rather than five equal slices.
   */
  const cuts = useRef<number[]>([0, 0.2, 0.4, 0.6, 0.8, 1]);
  const active = useRef(-1);

  useEffect(function measure() {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    len.current = L;
    [pathRef.current, glowRef.current].forEach((p) => {
      if (p) p.style.strokeDasharray = String(L);
    });

    const found: number[] = [0];
    let k = 1;
    for (let s = 0; s <= 600 && k < 5; s++) {
      const pt = path.getPointAtLength((L * s) / 600);
      if (pt.x >= STEP_X[k]) {
        found.push(s / 600);
        k++;
      }
    }
    while (found.length < 5) found.push(found[found.length - 1]);
    found.push(1);
    cuts.current = found;

    /* LineScenes is plain markup, so the groups are collected here
       rather than threaded back through it as five more refs. */
    detRefs.current = [
      ...(svgRef.current?.querySelectorAll<SVGGElement>(".det") ?? []),
    ];
  }, []);

  const setStep = useCallback(function setStep(i: number) {
    if (i === active.current) return;
    active.current = i;
    const stage = stageRef.current;
    if (stage) stage.dataset.s = String(i);
    railRefs.current.forEach(function mark(b, k) {
      if (!b) return;
      b.classList.toggle("on", k === i);
      b.classList.toggle("done", k < i);
      if (k === i) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    cardRefs.current.forEach(function show(c, k) {
      if (!c) return;
      c.classList.toggle("on", k === i);
      c.setAttribute("aria-hidden", k === i ? "false" : "true");
    });
  }, []);

  const onProgress = useCallback(
    function onProgress(p: number) {
      const path = pathRef.current;
      const svg = svgRef.current;
      const draw = drawRef.current;
      const L = len.current;
      if (!path || !svg || !draw || !L) return;

      /* The line starts a hair drawn, so it is never a bare dot. */
      const q = clamp(0.006 + p * 0.99);

      /* The SVG is laid out at the drawing's own aspect, so one unit
         of the viewBox is the same length however tall the band is. */
      const h = draw.clientHeight;
      const sc = h / VIEW_H;
      const wide = draw.clientWidth;
      svg.style.width = `${VIEW_W * sc}px`;

      const drawn = L * q;
      [path, glowRef.current].forEach((el) => {
        if (el) el.style.strokeDashoffset = String(L - drawn);
      });
      const pt = path.getPointAtLength(drawn);
      penRef.current?.setAttribute("cx", String(pt.x));
      penRef.current?.setAttribute("cy", String(pt.y));

      let s = 0;
      for (let k = 1; k < 5; k++) if (q >= cuts.current[k]) s = k;
      setStep(s);

      /* A scene lights once the pen has drawn it — or once the step is
         behind us. Ship has no x of its own; it lights at the end. */
      detRefs.current.forEach(function light(d, k) {
        if (!d) return;
        const on =
          pt.x >= DETAIL_DONE[k] || k < s || (k === 4 && q > 0.985);
        d.classList.toggle("on", on);
      });

      /* The camera holds at the step's centre until the pen outruns it,
         then follows, keeping the pen off the right edge. */
      const half = wide / 2 / sc;
      const cam = Math.max(CAMERA_X[s], pt.x - half * (wide <= 900 ? 0.94 : 0.78));
      svg.style.transform = `translate3d(${(wide / 2 - cam * sc).toFixed(1)}px,0,0)`;

      railRefs.current.forEach(function fill(b, k) {
        const i = b?.querySelector("i") as HTMLElement | null;
        if (!i) return;
        const f =
          k < s
            ? 1
            : k === s
              ? Math.max(
                  0.06,
                  clamp((q - cuts.current[k]) / (cuts.current[k + 1] - cuts.current[k]))
                )
              : 0;
        i.style.setProperty("--f", String(f));
      });
    },
    [setStep]
  );

  progressRef.current = onProgress;

  /** The rail jumps 60% into the step it names. */
  const jump = useCallback(
    function jump(i: number) {
      const sec = sectionRef.current;
      if (!sec) return;
      const c = cuts.current;
      const frac = c[i] + (c[i + 1] - c[i]) * 0.6;
      const top = window.scrollY + sec.getBoundingClientRect().top;
      window.scrollTo({
        top: top + (sec.offsetHeight - window.innerHeight) * frac,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [sectionRef]
  );

  return (
    <section className="ln" id="ln" aria-labelledby="ab-lnh" ref={sectionRef}>
      <div className="lnstage" data-s="0" ref={stageRef}>
        <div className="wrap gut lnhead">
          <div>
            <span className="eyebrow">How we work</span>
            <h2 id="ab-lnh">One line, from the first call to launch.</h2>
          </div>
          <p>
            Five steps. One person holding the pen the whole way, and you
            always know what comes next.
          </p>
        </div>

        <div className="wrap gut">
          <div className="rail" aria-label="Project stages">
            {PROCESS.map(function railButton(st, i) {
              return (
                <button
                  type="button"
                  key={st.name}
                  aria-label={`Step ${i + 1} of ${PROCESS.length}: ${st.name}`}
                  onClick={() => jump(i)}
                  ref={(el) => {
                    railRefs.current[i] = el;
                  }}
                >
                  <i />
                  <span className="mono">Step {i + 1}</span>
                  <b>{st.name}</b>
                </button>
              );
            })}
          </div>
        </div>

        <div className="wrap gut lnbody">
          {/* The drawing says nothing a reader can use; the cards do. */}
          <div className="draw" aria-hidden="true" ref={drawRef}>
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} ref={svgRef}>
              <LineDefs />
              <LineScenes />
              <path className="lghost" d={LINE_D} ref={ghostRef} />
              <path className="lglow" d={LINE_D} ref={glowRef} />
              <path className="lpath" d={LINE_D} ref={pathRef} />
              <circle className="lpen" r="8" ref={penRef} />
            </svg>
          </div>

          <div className="steps" aria-live="polite">
            {PROCESS.map(function card(st, i) {
              return (
                <StepCard
                  key={st.name}
                  step={st}
                  index={i}
                  total={PROCESS.length}
                  cardRef={(el) => {
                    cardRefs.current[i] = el;
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
