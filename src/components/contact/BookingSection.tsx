import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CAL_LINK, CAL_FULL_URL } from "./calConfig";

const CalEmbed = lazy(() => import("./CalEmbed"));

/**
 * The booking, framed and loaded only when it is wanted.
 *
 * /contact used to fire 84 cal.com requests before the reader had
 * scrolled a pixel. The embed now mounts when the section is one
 * viewport away — or immediately if the URL carries ?date, because
 * someone arriving from the start pass is here to book.
 *
 * The frame is the site's own window chrome, so the third-party embed
 * reads as part of the page rather than an iframe dropped into it.
 */
export default function BookingSection() {
  const [params] = useSearchParams();
  const wanted = !!params.get("date");
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(wanted);

  useEffect(
    function watch() {
      if (show) return;
      const el = ref.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setShow(true);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            setShow(true);
          }
        },
        { rootMargin: "100% 0px" }
      );
      io.observe(el);
      return function off() {
        io.disconnect();
      };
    },
    [show]
  );

  return (
    <div className="bk" ref={ref}>
      <div className="bk-win">
        <div className="bk-chrome">
          <span className="bk-lights" aria-hidden="true"><i /><i /><i /></span>
          <span className="bk-url">cal.com/{CAL_LINK}</span>
        </div>
        <div className="bk-body">
          {show ? (
            <Suspense fallback={<div className="bk-wait">Loading times…</div>}>
              <CalEmbed />
            </Suspense>
          ) : (
            <div className="bk-wait" aria-hidden="true" />
          )}
        </div>
      </div>

      <p className="bk-fallback">
        Prefer the full page?{" "}
        <a href={CAL_FULL_URL} target="_blank" rel="noopener noreferrer">
          Book on Cal.com ↗
        </a>
      </p>

      <style>{`
        .bk { max-width: var(--container-wide); margin: 0 auto; }
        .bk-win {
          border: 1px solid rgba(20,20,18,0.14);
          border-radius: 14px; overflow: hidden;
          background: var(--color-bg);
          box-shadow: 0 30px 70px -36px rgba(20,20,18,0.36);
        }
        .bk-chrome {
          display: flex; align-items: center; gap: 14px;
          padding: 11px 14px;
          background: var(--color-bg-alt);
          border-bottom: 1px solid rgba(20,20,18,0.12);
        }
        .bk-lights { display: flex; gap: 6px; }
        .bk-lights i { width: 11px; height: 11px; border-radius: 50%; background: rgba(20,20,18,0.18); }
        .bk-url {
          font-family: var(--font-mono); font-size: 13px; color: var(--color-ink);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        /* a real height, so the embed has somewhere to paint and the
           reserve cannot shift anything when it arrives */
        .bk-body { min-height: 640px; background: var(--color-bg); }
        .bk-wait {
          min-height: 640px; display: grid; place-items: center;
          font-family: var(--font-mono); font-size: 13px; color: var(--color-muted);
        }
        .bk-fallback { margin: 16px 0 0; font-size: 14px; color: var(--color-muted); }
                /* an inline link in prose still needs a real tap target: padding
           grows the hit area, the negative margin keeps the line where
           it was */
        .bk-fallback a {
          color: var(--color-ink); text-decoration: underline; text-underline-offset: 3px;
          display: inline-block; padding: 13px 6px; margin: -13px -6px;
        }
        /* Cal's mobile layout stacks the month and the day list and
           settles at ~1433px at 375 — measured. Reserving only 560 let
           the iframe grow 680px after mounting and shove the whole
           brief section up: 0.91 CLS on a fast scroll. The reserve is
           the real height now, so nothing below it can move. */
        @media (max-width: 1023px) {
          .bk-body, .bk-wait { min-height: 1460px; }
        }
      `}</style>
    </div>
  );
}
