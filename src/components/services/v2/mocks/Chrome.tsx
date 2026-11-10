import type { ReactNode } from "react";

/**
 * The window bar every browser-shaped mock wears: three dots, a URL
 * pill with a coloured favicon, and an optional Live tag.
 *
 * Ported from the reference's `chrome()` helper. The default favicon
 * colour is its `rgba(245,244,249,.3)`.
 */
export default function Chrome({
  url,
  tint,
  live,
}: {
  url: ReactNode;
  tint?: string;
  live?: boolean;
}) {
  return (
    <div className="chrome">
      <i />
      <i />
      <i />
      <span className="url">
        <em style={{ "--uc": tint || "rgba(245,244,249,.3)" } as React.CSSProperties} />
        <span>{url}</span>
      </span>
      {live ? <span className="live">Live</span> : null}
    </div>
  );
}

/** The ten-bar sparkline on the dashboard's figures. */
export function Spark({ heights, color }: { heights: number[]; color: string }) {
  return (
    <div className="spark" style={{ "--kc": color } as React.CSSProperties}>
      {heights.map(function bar(h, i) {
        return (
          <i
            key={i}
            style={{ "--h": `${h}%`, transitionDelay: `${i * 0.04}s` } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
