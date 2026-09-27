import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Tone } from "../components/Chapter";

/**
 * The Footer is global but its boundary is per-page: on /about and /contact it
 * follows a dark closing band, everywhere else it follows cream. Pages declare
 * the tone of their final section here and the Footer reveals over it. Routes
 * that declare nothing are cream → cream, which Chapter renders flat.
 */

type PageToneValue = {
  endTone: Tone;
  setEndTone: (tone: Tone) => void;
};

const PageToneContext = createContext<PageToneValue>({
  endTone: "cream",
  setEndTone: function noop() {},
});

export function PageToneProvider({ children }: { children: ReactNode }) {
  const [endTone, setEndTone] = useState<Tone>("cream");
  const value = useMemo(
    function memo() {
      return { endTone, setEndTone };
    },
    [endTone]
  );
  return (
    <PageToneContext.Provider value={value}>{children}</PageToneContext.Provider>
  );
}

export function usePageEndTone(): Tone {
  return useContext(PageToneContext).endTone;
}

/** Declare the tone of this page's final section. Resets to cream on unmount so
 *  the next route never inherits it. */
export function useDeclarePageEndTone(tone: Tone) {
  const { setEndTone } = useContext(PageToneContext);
  useEffect(
    function declare() {
      setEndTone(tone);
      return function reset() {
        setEndTone("cream");
      };
    },
    [tone, setEndTone]
  );
}
