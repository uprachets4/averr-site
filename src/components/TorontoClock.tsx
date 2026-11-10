import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function readToronto() {
  // "10:42 p.m." → "10:42 PM"
  return FORMAT.format(new Date()).replace(/\./g, "").toUpperCase();
}

/** Live Toronto time. Tabular numerals + a fixed min-width so the minute
 *  rolling over cannot shift the row. */
export default function TorontoClock({ style }: { style?: React.CSSProperties }) {
  const [time, setTime] = useState(readToronto);

  useEffect(function tickEachMinute() {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    function update() {
      setTime(readToronto());
    }

    // align to the next minute boundary, then tick once a minute
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    timeout = setTimeout(function startTicking() {
      update();
      interval = setInterval(update, 60_000);
    }, msToNextMinute);

    return function cleanup() {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="type-eyebrow tnum"
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-muted)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {/* The name used to sit in an `aria-label` on this div, which axe
          reports as a serious `aria-prohibited-attr`: a div has no role
          that permits naming, so the label was silently doing nothing.
          A visually-hidden sentence carries it instead, with the visible
          pieces hidden from the tree as before. */}
      <span className="sr-only">{`Local time in Toronto, ${time}`}</span>
      <span aria-hidden>TORONTO · </span>
      <span aria-hidden style={{ display: "inline-block", minWidth: "7.5ch" }}>
        {time}
      </span>
    </div>
  );
}
