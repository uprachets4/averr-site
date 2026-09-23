import type { ComponentType, CSSProperties } from "react";

/**
 * Icon wrapper — one interface, one color chain, one motion baseline.
 * Consumers hand it a Phosphor icon component; this wrapper keeps size,
 * weight, color, and hover transition consistent across the app.
 *
 * Weights: "regular" is the default across the site. Reserve "bold" for
 * CTAs where the extra visual weight balances the button copy.
 */

type IconSize = "sm" | "md" | "lg" | "xl";
type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

type PhosphorProps = {
  size?: number | string;
  weight?: IconWeight;
  color?: string;
  mirrored?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
};

type Props = {
  glyph: ComponentType<PhosphorProps>;
  size?: IconSize | number;
  weight?: IconWeight;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const SIZE_VAR: Record<IconSize, string> = {
  sm: "var(--icon-sm)",
  md: "var(--icon-md)",
  lg: "var(--icon-lg)",
  xl: "var(--icon-xl)",
};

export default function Icon({
  glyph: Glyph,
  size = "md",
  weight = "regular",
  label,
  className,
  style,
}: Props) {
  const sizeValue = typeof size === "number" ? size : SIZE_VAR[size];
  const decorative = !label;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "currentColor",
        width: sizeValue,
        height: sizeValue,
        transition: "color 200ms ease",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
    >
      <Glyph
        weight={weight}
        color="currentColor"
        size={sizeValue}
        style={{ display: "block" }}
      />
    </span>
  );
}
