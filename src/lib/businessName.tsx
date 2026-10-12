import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * The name the visitor typed into the hero.
 *
 * PRIVACY. This lives in React state at the app root and nowhere else:
 * no localStorage, no sessionStorage, no cookie, no analytics, no network.
 * It dies with the tab. It travels only where the visitor takes it — the
 * `?notes=` parameter on a link they click, exactly as the /services start
 * pass already does — and this context is the fallback for a navigation
 * that carries no parameter.
 */

type BusinessNameValue = {
  /** Trimmed, or "" when the visitor has not typed one. */
  name: string;
  setName: (next: string) => void;
};

const BusinessNameContext = createContext<BusinessNameValue>({
  name: "",
  setName: function noop() {},
});

export function BusinessNameProvider({ children }: { children: ReactNode }) {
  const [name, setNameRaw] = useState("");
  const value = useMemo(
    function build() {
      return {
        name,
        setName: function setName(next: string) {
          setNameRaw(next.slice(0, MAX_NAME).trimStart());
        },
      };
    },
    [name]
  );
  return <BusinessNameContext.Provider value={value}>{children}</BusinessNameContext.Provider>;
}

export function useBusinessName() {
  return useContext(BusinessNameContext);
}

/** The hero field's maxlength, and the cap everything downstream trusts. */
export const MAX_NAME = 32;
