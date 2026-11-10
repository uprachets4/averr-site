import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * The hero takeover's dark layer is full-frame from the start — only its
 * clip-path makes it look like the pill — so an IntersectionObserver would
 * read it as dark immediately. The hero therefore publishes its own state,
 * driven by the same scroll progress that drives the clip-path.
 */

type NavToneValue = {
  darkOverride: boolean;
  setDarkOverride: (dark: boolean) => void;
};

const NavToneContext = createContext<NavToneValue>({
  darkOverride: false,
  setDarkOverride: function noop() {},
});

export function NavToneProvider({ children }: { children: ReactNode }) {
  const [darkOverride, setDarkOverride] = useState(false);
  const value = useMemo(
    function memo() {
      return { darkOverride, setDarkOverride };
    },
    [darkOverride]
  );
  return (
    <NavToneContext.Provider value={value}>{children}</NavToneContext.Provider>
  );
}

/** Read by the nav. */
export function useNavDarkOverride() {
  return useContext(NavToneContext).darkOverride;
}

/** Written by the hero takeover. */
export function useSetNavDarkOverride() {
  return useContext(NavToneContext).setDarkOverride;
}
