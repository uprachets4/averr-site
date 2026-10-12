import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { MAX_NAME } from "../../lib/businessName";

/**
 * The signature slab, now a text field.
 *
 * It is PillHl's slab box — the same surface, radius and parch — with an
 * `<input>` living inside it. Three things make that work at display size:
 *
 * 1. THE WIDTH IS MEASURED. A hidden ruler lays out whatever is currently
 *    shown, at the unscaled font size, and the surface behind the text is
 *    a layer whose scaleX is driven to that width. The input itself stays
 *    the full width of the column, so nothing reflows as the visitor
 *    types and the hit area is generous.
 * 2. IT NEVER WRAPS AND NEVER OVERFLOWS. When the measured line is wider
 *    than the column, the font steps down by exactly the ratio that makes
 *    it fit. The ruler is pinned to the UNSCALED size so the measurement
 *    cannot chase its own tail.
 * 3. THE FIRST FRAME IS PAINTED. The placeholder "your business" is in
 *    the markup at first render, in INK on cream, so it is legible before
 *    anything animates; the surface then fades in under it and the text
 *    crosses to parch. Same idea as the Session 21 reveal, done with a
 *    colour crossfade because an input's glyphs cannot be clipped.
 *
 * PRIVACY: the value is lifted to a React context at the app root and
 * goes nowhere else — no storage, no analytics, no network.
 */

const PLACEHOLDER = "your business";

/** Names the placeholder tries on, with the placeholder between each. */
const EXAMPLES = [
  "Harbour Dental",
  "Maple & Pine Café",
  "Northgate Renovations",
  "Bloor St. Barbers",
  "Lakeview Physio",
  "Summit Law",
];

const CYCLE_MS = 2600;
const TYPE_MS = 46;
const DELETE_MS = 24;

export default function NameField({
  value,
  onChange,
  onTouched,
  onExample,
  /** Seconds from mount before the surface arrives — the hero's film. */
  delay = 0,
  skip = false,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Fired the first time the visitor focuses or types — the hint lives
   *  outside this component, under the h1, so it is told rather than
   *  rendered here. */
  onTouched?: () => void;
  /** Fired with each example once it has finished typing itself in, so the
   *  sketch can build that business while the visitor is still reading.
   *  Not fired per keystroke — the sketch would thrash. */
  onExample?: (word: string) => void;
  delay?: number;
  skip?: boolean;
}) {
  const reduce = !!useReducedMotion();
  const instant = reduce || skip;
  const id = useId();

  const hostRef = useRef<HTMLSpanElement | null>(null);
  const rulerRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** The animated placeholder. Static until the cycle starts. */
  const [ghost, setGhost] = useState(PLACEHOLDER);
  const [focused, setFocused] = useState(false);
  /** True once the visitor has focused or typed — the cycle never returns
   *  mid-session once they have taken the field, except on an empty blur. */
  const [touched, setTouched] = useState(false);
  const [lit, setLit] = useState(instant);

  /** What the ruler has to measure: the value if there is one, else the ghost. */
  const shown = value || (focused ? "" : ghost);

  const [fit, setFit] = useState(1);
  const [ratio, setRatio] = useState(1);
  const [caretX, setCaretX] = useState(0);

  /* ── the surface arrives, the text crosses to parch ── */
  useEffect(
    function light() {
      if (instant) {
        setLit(true);
        return;
      }
      const t = window.setTimeout(function on() {
        setLit(true);
      }, delay * 1000);
      return function off() {
        window.clearTimeout(t);
      };
    },
    [delay, instant]
  );

  /* ── measure ── */
  useLayoutEffect(
    function measure() {
      function run() {
        const host = hostRef.current;
        const ruler = rulerRef.current;
        if (!host || !ruler) return;
        const cs = getComputedStyle(host);
        const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const box = host.getBoundingClientRect().width;
        if (!box) return;
        const text = ruler.getBoundingClientRect().width;
        const full = text + pad;
        // step the type down only when the line would leave the column
        const f = full > box ? box / full : 1;
        setFit(f);
        setRatio(Math.min(1, (full * f) / box));
        setCaretX(pad / 2 + text * f);
      }
      run();
      document.fonts?.ready.then(run).catch(function ignore() {});
      window.addEventListener("resize", run);
      return function off() {
        window.removeEventListener("resize", run);
      };
    },
    [shown]
  );

  /** The cycle reads these through refs, so its own keystrokes do not
   *  restart it. */
  const ghostRef = useRef(ghost);
  ghostRef.current = ghost;
  const onExampleRef = useRef(onExample);
  onExampleRef.current = onExample;

  /* ── the placeholder tries names on, until the visitor takes over ── */
  useEffect(
    function cycle() {
      if (reduce || touched || focused || value) return;
      let alive = true;
      let timer = 0;
      let i = 0;

      function wait(ms: number) {
        return new Promise<void>(function hold(done) {
          timer = window.setTimeout(done, ms);
        });
      }
      async function type(word: string) {
        for (let n = 1; n <= word.length && alive; n++) {
          setGhost(word.slice(0, n));
          await wait(TYPE_MS);
        }
      }
      async function erase(word: string) {
        for (let n = word.length - 1; n >= 0 && alive; n--) {
          setGhost(word.slice(0, n));
          await wait(DELETE_MS);
        }
      }
      (async function run() {
        await wait(1600); // let the first frame stand
        while (alive) {
          const word = i % 2 === 0 ? EXAMPLES[(i / 2) % EXAMPLES.length] : PLACEHOLDER;
          await erase(ghostRef.current);
          if (!alive) return;
          await type(word);
          if (!alive) return;
          onExampleRef.current?.(word === PLACEHOLDER ? "" : word);
          const spent = (ghostRef.current.length + word.length) * TYPE_MS;
          await wait(Math.max(700, CYCLE_MS - spent));
          i++;
        }
      })();

      return function stop() {
        alive = false;
        window.clearTimeout(timer);
      };
    },
    // `ghost` deliberately absent: the loop reads it through the ref, so a
    // keystroke of its own does not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduce, touched, focused, value]
  );

  function take() {
    setFocused(true);
    setTouched(true);
    onTouched?.();
  }
  function release() {
    setFocused(false);
    if (!value) {
      setGhost(PLACEHOLDER);
      setTouched(false); // empty again → the examples come back
    }
  }

  return (
    <span className="nf-wrap">
      <label className="sr-only" htmlFor={id}>
        Your business name
      </label>

      <span
        ref={hostRef}
        className={lit ? "pill-hl pill-hl--bare nf nf--lit" : "pill-hl pill-hl--bare nf"}
        onClick={function focusIt() {
          inputRef.current?.focus();
        }}
      >
        {/* the ruler: the same type, pinned to the UNSCALED size */}
        <span className="nf-ruler" ref={rulerRef} aria-hidden="true">
          {shown || " "}
        </span>

        <span
          className="pill-hl__slab nf-slab"
          aria-hidden="true"
          style={{ transform: `scaleX(${ratio})` }}
        />

        <input
          ref={inputRef}
          id={id}
          className="nf-input"
          type="text"
          value={value}
          placeholder={focused ? "" : ghost}
          onChange={function change(e) {
            setTouched(true);
            onTouched?.();
            onChange(e.target.value);
          }}
          onFocus={take}
          onBlur={release}
          maxLength={MAX_NAME}
          autoComplete="organization"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="done"
          style={{ fontSize: `calc(var(--type-hero-size) * ${fit})` }}
        />

        {/* a caret before the field is focused, so it reads as typeable */}
        {!focused ? (
          <span className="nf-caret" aria-hidden="true" style={{ left: caretX }} />
        ) : null}
      </span>

    </span>
  );
}
