import { motion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import EvolvingPage from "./EvolvingPage";

/**
 * The browser window the site is built inside.
 *
 * The chrome is the constant: the same window from the first sketch to
 * the green URL bar, so the thing changing is always the site and never
 * the frame around it. Only the URL bar's state changes, at Ship.
 */
export default function SiteWindow({
  stage,
  within,
  reduce,
}: {
  stage: number;
  within: number;
  reduce: boolean;
}) {
  const shipped = stage >= 4;
  const t = { duration: reduce ? 0 : duration.slow, ease: ease.outQuart };

  return (
    <div className="sw">
      <div className="sw-chrome">
        <span className="sw-lights" aria-hidden="true">
          <i /><i /><i />
        </span>
        <motion.div
          className="sw-url"
          animate={{
            backgroundColor: shipped ? "rgba(47,125,79,0.12)" : "rgba(20,20,18,0.05)",
            borderColor: shipped ? "rgba(47,125,79,0.55)" : "rgba(20,20,18,0.12)",
          }}
          transition={t}
        >
          <motion.span
            className="sw-lock"
            aria-hidden="true"
            animate={{ color: shipped ? "#2F7D4F" : "var(--color-muted-2)" }}
            transition={t}
          >
            ●
          </motion.span>
          <span className="sw-host">
            {shipped ? "harbourviewbakehouse.ca" : "localhost:3000"}
          </span>
          <motion.span
            className="sw-live"
            animate={{ opacity: shipped ? 1 : 0, scale: shipped ? 1 : 0.9 }}
            transition={t}
          >
            Live
          </motion.span>
        </motion.div>
      </div>

      <div className="sw-viewport">
        <EvolvingPage stage={stage} within={within} reduce={reduce} />
      </div>

      <style>{`
        .sw {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          background: var(--color-bg-alt);
          border: 1px solid rgba(20,20,18,0.14);
          box-shadow: 0 30px 70px -34px rgba(20,20,18,0.42);
        }
        .sw-chrome {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 14px;
          background: #E6E1D6;
          border-bottom: 1px solid rgba(20,20,18,0.12);
        }
        .sw-lights { display: flex; gap: 6px; flex: 0 0 auto; }
        .sw-lights i {
          width: 11px; height: 11px; border-radius: 50%;
          background: rgba(20,20,18,0.18);
        }
        .sw-url {
          flex: 1; min-width: 0;
          display: flex; align-items: center; gap: 9px;
          height: 30px; padding: 0 12px;
          border-radius: 999px; border: 1px solid rgba(20,20,18,0.12);
        }
        .sw-lock { font-size: 13px; line-height: 1; }
        .sw-host {
          font-family: var(--font-mono); font-size: 13px;
          color: var(--color-ink); white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .sw-live {
          margin-left: auto; flex: 0 0 auto;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #1F5A38; background: rgba(47,125,79,0.18);
          border-radius: 4px; padding: 2px 8px;
        }
        .sw-viewport { position: relative; height: min(58vh, 520px); }
        @media (max-width: 900px) {
          .sw-chrome { padding: 9px 11px; gap: 10px; }
          .sw-viewport { height: 340px; }
        }
      `}</style>
    </div>
  );
}
