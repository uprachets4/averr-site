import type { CSSProperties, ReactNode } from "react";
import { SERVICE_COLOR, SERVICE_NAMES, type ServiceId } from "../../../data/serviceColors";

/**
 * The small pieces the index and the case file both draw: service dots,
 * service chips, the thesis with its gradient phrase, and the
 * service-coloured underline inside a sentence.
 *
 * These live together because five components in two routes render
 * them, and the reference builds all four from the same three helpers
 * (`dots`, `chipsOf`, `pillT`, `hl`).
 *
 * `Phrase` and `ThesisPill` keep the reference's exact fallback: the
 * highlight is applied only when the phrase really is a substring, and
 * otherwise the sentence renders plain. CadenceStack's first and third
 * approach steps are written with a lower-case "a" where the sentence
 * opens with a capital, so they fall through to plain in the reference
 * and they fall through to plain here. That is the approved rendering;
 * changing the casing would change the page.
 */

export function Dots({ svc }: { svc: ServiceId[] }) {
  return (
    <>
      {svc.map(function dot(id) {
        return (
          <i
            key={id}
            className="bb-dot"
            style={{ "--c": SERVICE_COLOR[id] } as CSSProperties}
          />
        );
      })}
    </>
  );
}

export function Chips({ svc }: { svc: ServiceId[] }) {
  return (
    <>
      {svc.map(function chip(id) {
        return (
          <span
            className="bb-chip"
            key={id}
            style={{ "--c": SERVICE_COLOR[id] } as CSSProperties}
          >
            <i />
            {SERVICE_NAMES[id]}
          </span>
        );
      })}
    </>
  );
}

/**
 * Splits `text` once on `phrase` and wraps the middle.
 *
 * Exact first, then case-insensitively. Two of CadenceStack's approach
 * phrases are written with a lower-case "a" where the sentence they
 * belong to opens with a capital, so an exact match misses and the
 * reference silently drops the highlight. Matching loosely renders
 * them; trying exact first means every phrase that already matched
 * still matches in the same place.
 *
 * The slice comes from `text`, never from `phrase`, so the highlighted
 * run keeps the sentence's own casing rather than the phrase's.
 */
function split(text: string, phrase: string, wrap: (s: string) => ReactNode) {
  if (!phrase) return text;
  let at = text.indexOf(phrase);
  if (at < 0) at = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      {wrap(text.slice(at, at + phrase.length))}
      {text.slice(at + phrase.length)}
    </>
  );
}

/** The thesis, with its pill phrase in the studio gradient. */
export function ThesisPill({ thesis, pill }: { thesis: string; pill: string }) {
  return (
    <>
      {split(thesis, pill, function gradient(s) {
        return <span className="bb-gt">{s}</span>;
      })}
    </>
  );
}

/** A sentence with one phrase underlined in the service colour. */
export function Phrase({ text, emphasis }: { text: string; emphasis: string }) {
  return (
    <>
      {split(text, emphasis, function underline(s) {
        return <span className="bb-hl">{s}</span>;
      })}
    </>
  );
}
