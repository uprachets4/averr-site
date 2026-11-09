import { useCallback, useMemo, useState } from "react";
import {
  BRIEF_SERVICES,
  EMAIL_ADDR,
  LETTER,
  joinList,
  validEmail,
} from "../../../data/contactBrief";

/**
 * The brief, in one place.
 *
 * The letter, the "Still needed" hint, the Send button's enabled
 * state, the Talk section's carry-over note and the payload all read
 * from this one object, so none of them can disagree with another.
 *
 * It is ordinary React state, updated per keystroke — not per frame.
 * The animations never touch it; see `useFoldFlight`.
 */

export type BriefState = {
  name: string;
  business: string;
  email: string;
  gist: string;
  link: string;
  /** Service keys, in the data file's order. */
  services: string[];
  /** Picked sub-options per service key. */
  subs: Record<string, string[]>;
  unsure: boolean;
  /** The timing value the letter says, not the button label. */
  when: string;
};

const EMPTY: BriefState = {
  name: "",
  business: "",
  email: "",
  gist: "",
  link: "",
  services: [],
  subs: {},
  unsure: false,
  when: "",
};

export type MissingKey = "need" | "name" | "email" | "gist";

export function useBrief() {
  const [state, setState] = useState<BriefState>(EMPTY);
  /** Which field changed last, so the letter can flash just that one. */
  const [changed, setChanged] = useState<string>("");

  const set = useCallback(function set<K extends keyof BriefState>(
    key: K,
    value: BriefState[K]
  ) {
    setChanged(String(key));
    setState((s) => ({ ...s, [key]: value }));
  }, []);

  const toggleService = useCallback(function toggleService(key: string) {
    setChanged("services");
    setState(function next(s) {
      const on = s.services.includes(key);
      return {
        ...s,
        services: on ? s.services.filter((k) => k !== key) : [...s.services, key],
        /* Picking a service un-picks "Not sure yet", as in the
           reference: they are two answers to the same question. */
        unsure: on ? s.unsure : false,
      };
    });
  }, []);

  const toggleSub = useCallback(function toggleSub(key: string, sub: string) {
    setChanged("services");
    setState(function next(s) {
      const cur = s.subs[key] ?? [];
      const has = cur.includes(sub);
      return {
        ...s,
        subs: { ...s.subs, [key]: has ? cur.filter((x) => x !== sub) : [...cur, sub] },
      };
    });
  }, []);

  const toggleUnsure = useCallback(function toggleUnsure() {
    setChanged("services");
    setState(function next(s) {
      const on = !s.unsure;
      /* Ticking it clears the tiles, as in the reference. */
      return on ? { ...s, unsure: true, services: [], subs: {} } : { ...s, unsure: false };
    });
  }, []);

  const toggleWhen = useCallback(function toggleWhen(value: string) {
    setChanged("when");
    setState((s) => ({ ...s, when: s.when === value ? "" : value }));
  }, []);

  /** Back to blank, for "Write another". */
  const reset = useCallback(function reset(keep: Partial<BriefState> = {}) {
    setChanged("");
    setState((s) => ({ ...EMPTY, ...keep, name: s.name, email: s.email, business: s.business }));
  }, []);

  /** What is still missing, in the order the hint lists it. */
  const missing = useMemo<{ key: MissingKey; label: string }[]>(
    function missing() {
      const out: { key: MissingKey; label: string }[] = [];
      if (!state.services.length && !state.unsure)
        out.push({ key: "need", label: LETTER.blanks.need });
      if (!state.name.trim()) out.push({ key: "name", label: "your name" });
      if (!validEmail(state.email.trim()))
        out.push({ key: "email", label: state.email ? "a full email" : "your email" });
      if (state.gist.trim().length < 3)
        out.push({ key: "gist", label: "a line about the project" });
      return out;
    },
    [state]
  );

  const ready = missing.length === 0;

  /** Name and email good enough for the booking carry-over. */
  const carryReady = !!state.name.trim() && validEmail(state.email.trim());

  return {
    state,
    changed,
    set,
    toggleService,
    toggleSub,
    toggleUnsure,
    toggleWhen,
    reset,
    missing,
    ready,
    carryReady,
  };
}

/* ── turning the brief into what gets sent ───────────────────────── */

/** "Websites (a new website and online booking)" — plain text. */
function needPhrase(state: BriefState): string {
  if (state.unsure) return LETTER.unsure;
  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));
  if (!chosen.length) return `${LETTER.needPrefix}${LETTER.blanks.need}.`;
  const parts = chosen.map(function part(s) {
    const subs = (state.subs[s.key] ?? []).map(lowerFirst);
    return subs.length ? `${s.name} (${joinList(subs)})` : s.name;
  });
  return `${LETTER.needPrefix}${joinList(parts)}.`;
}

/**
 * A sub-option dropped into the middle of the letter's sentence, so
 * it reads as prose: "help with Websites (a new website)".
 *
 * DEVIATION from the reference, at the owner's instruction. Its test
 * is `/^[A-Z][a-z]/`, which needs a lowercase letter immediately
 * after the capital — so it misses any first word of a single
 * letter, and "A new website" stayed capitalised mid-sentence. The
 * rule here is: lowercase the first letter unless the first word is
 * an all-caps initialism of two letters or more. "AI agents" keeps
 * its capitals, "A new website" and "Online booking" do not.
 */
export function lowerFirst(x: string): string {
  if (/^[A-Z]{2,}(\b|$)/.test(x)) return x;
  return x.charAt(0).toLowerCase() + x.slice(1);
}

/**
 * The letter as plain text, then the structured block beneath it.
 * This is the `message` the endpoint stores and emails.
 */
export function composeMessage(state: BriefState): string {
  const name = state.name.trim();
  const biz = state.business.trim();
  const email = state.email.trim();
  const gist = state.gist.trim();
  const link = state.link.trim();

  const from = biz ? `, from ${biz}` : "";
  const when = state.when ? ` We'd like to get going ${state.when}.` : "";

  const letter = [
    LETTER.greeting,
    "",
    `I'm ${name}${from}. ${needPhrase(state)}${when}`,
    "",
    gist,
    link ? `\n${LETTER.linkPrefix}${link}.` : "",
    "",
    `${LETTER.reachPrefix}${email}.`,
    "",
    LETTER.signOff,
    name,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));
  const block = [
    "— — —",
    state.unsure
      ? "Services: not sure yet"
      : `Services: ${chosen.map((s) => s.name).join(", ") || "—"}`,
    ...chosen
      .filter((s) => (state.subs[s.key] ?? []).length)
      .map((s) => `  ${s.name}: ${(state.subs[s.key] ?? []).join(", ")}`),
    `Timing: ${state.when || "—"}`,
    `Business: ${biz || "—"}`,
    `Link: ${link || "—"}`,
  ].join("\n");

  return `${letter}\n\n${block}`;
}

/** The `mailto:` the failure notice falls back to. */
export function failureMailto(state: BriefState): string {
  const subject = `Project brief${state.business.trim() ? ` — ${state.business.trim()}` : ""}`;
  return `mailto:${EMAIL_ADDR}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    composeMessage(state)
  )}`;
}

/** The payload. Extra fields ride along; the endpoint ignores them. */
export function briefPayload(state: BriefState) {
  const chosen = BRIEF_SERVICES.filter((s) => state.services.includes(s.key));
  return {
    name: state.name.trim(),
    email: state.email.trim(),
    message: composeMessage(state),
    projectType: state.unsure ? "not sure yet" : chosen.map((s) => s.name).join(", "),
    services: chosen.flatMap((s) => state.subs[s.key] ?? []),
    business: state.business.trim(),
    timeline: state.when,
  };
}
