import type { ReactNode } from "react";

/**
 * The shared chrome for the four principle demos.
 *
 * Every demo is a live thing built out of CSS, SVG and state — there are
 * no images in any of them — so each needs the same two affordances: a
 * surface that reads as a specimen rather than as page furniture, and a
 * small mono label naming what the reader is looking at.
 */

export type DemoProps = {
  /** True while this panel is the one the reader is parked on. */
  active: boolean;
  /** The stacked (mobile / reduced-motion) layout. */
  stacked?: boolean;
  /** The panel sits on --color-dark, so the demo inverts. */
  dark?: boolean;
};

export type DemoInk = {
  ink: string;
  muted: string;
  line: string;
  surface: string;
  skeleton: string;
  /** A barely-there fill, for the untouched template state. */
  wash: string;
  gold: string;
};

export function demoInk(dark?: boolean): DemoInk {
  if (dark) {
    return {
      ink: "var(--color-parch)",
      muted: "var(--color-muted-l)",
      line: "rgba(237,233,226,0.2)",
      surface: "var(--color-dark-alt)",
      skeleton: "rgba(237,233,226,0.14)",
      wash: "rgba(237,233,226,0.05)",
      // 5.64:1 on --color-dark
      gold: "#C89B52",
    };
  }
  return {
    ink: "var(--color-ink)",
    muted: "var(--color-muted)",
    line: "rgba(20,20,18,0.16)",
    surface: "var(--surface-elevated)",
    skeleton: "rgba(20,20,18,0.12)",
    wash: "rgba(20,20,18,0.04)",
    gold: "#B18544",
  };
}

export default function DemoFrame({
  label,
  hint,
  dark,
  children,
}: {
  /** Named in mono at the top of the frame. */
  label: string;
  /** What the reader can do with it, if anything. */
  hint?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  const c = demoInk(dark);
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${c.line}`,
        borderRadius: 14,
        background: c.surface,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          padding: "14px 18px",
          borderBottom: `1px solid ${c.line}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: c.muted,
          }}
        >
          {label}
        </span>
        {hint ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: c.muted,
            }}
          >
            {hint}
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: 22, display: "flex" }}>{children}</div>
    </div>
  );
}
