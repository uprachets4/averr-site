import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import type { VaultEntry } from "../../data/workIndex";

type Clone = {
  slug: string;
  src: string;
  tint?: string;
  rect: { top: number; left: number; width: number; height: number };
};

function rgba(hex: string | undefined, a: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(20,20,18,${a})`;
  const h = hex.slice(1);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * Opening a case study from the film.
 *
 * A fixed clone of the screen grows from where it sits to fill the viewport
 * over the study's own colour, and the route changes underneath it — so the
 * case study's hero, which shows the same image, appears to be what you were
 * already looking at.
 *
 * Any reason not to (reduced motion, a missing image, a throw) falls back to
 * ordinary navigation: `open` returns false and the Link does its job.
 */
export function useOpenTransition() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [clone, setClone] = useState<Clone | null>(null);

  const open = useCallback(
    function start(entry: VaultEntry, rect: DOMRect) {
      if (reduce || !entry.preview || !entry.live) return false;
      try {
        if (!rect || rect.width < 1 || rect.height < 1) return false;
        setClone({
          slug: entry.slug,
          src: entry.preview.src,
          tint: entry.tint,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
    [reduce]
  );

  useEffect(
    function navigateWhenGrown() {
      if (!clone) return;
      const t = window.setTimeout(function go() {
        navigate(`/work/${clone.slug}`);
        setClone(null);
      }, duration.base * 1000 + 60);
      return function cleanup() {
        window.clearTimeout(t);
      };
    },
    [clone, navigate]
  );

  const overlay = clone ? <CloneOverlay clone={clone} /> : null;
  return { open, overlay };
}

function CloneOverlay({ clone }: { clone: Clone }) {
  const [vw, setVw] = useState(() => document.documentElement.clientWidth);
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(function measure() {
    function read() {
      setVw(document.documentElement.clientWidth);
      setVh(window.innerHeight);
    }
    read();
    window.addEventListener("resize", read);
    return function cleanup() {
      window.removeEventListener("resize", read);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.base * 0.6, ease: ease.inOut }}
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${rgba(
            clone.tint,
            0.22
          )}, var(--color-dark) 70%)`,
        }}
      />
      {/* measured pixels: the clone has to land on the viewport exactly */}
      <motion.img
        src={clone.src}
        alt=""
        decoding="async"
        initial={{
          top: clone.rect.top,
          left: clone.rect.left,
          width: clone.rect.width,
          height: clone.rect.height,
        }}
        animate={{ top: 0, left: 0, width: vw, height: vh }}
        transition={{ duration: duration.base, ease: ease.inOut }}
        style={{ position: "absolute", objectFit: "contain", display: "block" }}
      />
    </div>
  );
}
