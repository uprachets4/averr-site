import type { ReactNode } from "react";
import { ILLUSTRATIVE_LABEL } from "../../../data/servicePillars";

/**
 * The product window the whole chapter plays inside.
 *
 * 17c-1's frame read as a toy: a small pastel box with a hairline border.
 * This is the same idea at the size and fidelity of a real application
 * window — traffic lights, a proper title bar, a layered tinted shadow
 * and a screen reflection.
 *
 * Crispness rules:
 *   - nothing here is a raster, so there is nothing to scale badly;
 *   - hairlines are drawn with a `box-shadow` inset of exactly one
 *     device pixel rather than a 1px border, so they stay hairlines on a
 *     2x display instead of thickening to a visible 2px line;
 *   - the chrome never scales. The camera (see camera.ts) transforms the
 *     CONTENT only, so the window edges stay pin-sharp at every push-in.
 */

export type ChromeTone = "light" | "dark";

const TONES: Record<
  ChromeTone,
  {
    bar: string;
    barBorder: string;
    body: string;
    title: string;
    pill: string;
    pillBorder: string;
    edge: string;
  }
> = {
  light: {
    bar: "linear-gradient(180deg, #FAF8F3, #EFEBE1)",
    barBorder: "rgba(20,20,18,0.10)",
    body: "var(--color-bg)",
    title: "rgba(20,20,18,0.52)",
    pill: "rgba(255,255,255,0.72)",
    pillBorder: "rgba(20,20,18,0.10)",
    edge: "rgba(20,20,18,0.16)",
  },
  dark: {
    bar: "linear-gradient(180deg, #23262B, #191B1F)",
    barBorder: "rgba(255,255,255,0.08)",
    body: "#101215",
    title: "rgba(237,231,218,0.55)",
    pill: "rgba(255,255,255,0.06)",
    pillBorder: "rgba(255,255,255,0.10)",
    edge: "rgba(0,0,0,0.55)",
  },
};

const LIGHTS = ["#F05C4B", "#F5B93B", "#54C04A"];

export default function WindowChrome({
  children,
  tone = "light",
  title,
  url,
  showIllustrative = true,
}: {
  children: ReactNode;
  tone?: ChromeTone;
  /** Shown instead of a URL pill, for app windows rather than browsers. */
  title?: string;
  url?: string;
  showIllustrative?: boolean;
}) {
  const t = TONES[tone];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {showIllustrative ? (
        <div
          className="type-eyebrow"
          style={{
            position: "absolute",
            top: -28,
            right: 2,
            fontFamily: "var(--font-mono)",
            color: "var(--color-muted-2)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          {ILLUSTRATIVE_LABEL}
        </div>
      ) : null}

      <div
        className="bw-frame"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 14,
          overflow: "hidden",
          background: t.body,
          display: "flex",
          flexDirection: "column",
          // layered, tinted — a single flat shadow is what made the old
          // frame look pasted on
          boxShadow: [
            "0 1px 2px rgba(20,20,18,0.06)",
            "0 8px 18px rgba(20,20,18,0.08)",
            "0 28px 60px rgba(20,20,18,0.14)",
            "0 60px 120px rgba(31,26,20,0.10)",
          ].join(", "),
        }}
      >
        {/* title bar */}
        <div
          style={{
            flex: "0 0 38px",
            height: 38,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 14px",
            background: t.bar,
            boxShadow: `inset 0 -1px 0 ${t.barBorder}`,
            position: "relative",
            zIndex: 2,
          }}
        >
          <span style={{ display: "flex", gap: 7 }}>
            {LIGHTS.map((c) => (
              <span
                key={c}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: c,
                  boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.16)",
                }}
              />
            ))}
          </span>

          {url ? (
            <span
              style={{
                flex: "0 1 auto",
                margin: "0 auto",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: t.title,
                background: t.pill,
                boxShadow: `inset 0 0 0 1px ${t.pillBorder}`,
                borderRadius: 999,
                padding: "4px 18px",
              }}
            >
              {url}
            </span>
          ) : (
            <span
              style={{
                margin: "0 auto",
                fontSize: 12,
                fontWeight: 500,
                color: t.title,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </span>
          )}
          <span style={{ width: 40 }} />
        </div>

        {/* the screen */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            background: t.body,
          }}
        >
          {children}

          {/* reflection — a soft diagonal sheen across the glass */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                tone === "dark"
                  ? "linear-gradient(112deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 26%, rgba(255,255,255,0) 52%)"
                  : "linear-gradient(112deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.14) 24%, rgba(255,255,255,0) 50%)",
              mixBlendMode: tone === "dark" ? "screen" : "soft-light",
              zIndex: 5,
            }}
          />
        </div>

        {/* one-device-pixel edge, drawn as an inset shadow so it does not
            thicken on a 2x display the way a 1px border does */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            pointerEvents: "none",
            boxShadow: `inset 0 0 0 1px ${t.edge}`,
            zIndex: 6,
          }}
        />
      </div>

      <style>{`
        @media (min-resolution: 2dppx) {
          .bw-frame > div[aria-hidden]:last-child { box-shadow: inset 0 0 0 0.5px ${t.edge}; }
        }
      `}</style>
    </div>
  );
}
