import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";

type Variant = "primary" | "ghost" | "text";
type Size = "sm" | "md" | "lg";

export interface MagneticCTAProps {
  to?: string;
  onClick?: (e?: React.MouseEvent | React.FormEvent) => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}

const MAGNET_RADIUS = 60;
const MAGNET_STRENGTH = 0.13; // 60 * 0.13 ≈ 8px max displacement

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "8px 16px" },
  md: { padding: "12px 24px" },
  lg: { padding: "16px 32px" },
};

const sizeClass: Record<Size, string> = {
  sm: "type-small",
  md: "type-body",
  lg: "type-body-lg",
};

function isExternal(to?: string): boolean {
  if (!to) return false;
  return /^(https?:)?\/\//.test(to) || to.startsWith("mailto:");
}

export default function MagneticCTA(props: MagneticCTAProps) {
  const {
    to,
    onClick,
    variant = "primary",
    size = "md",
    icon,
    children,
    className,
    ariaLabel,
    type,
  } = props;

  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring.soft);
  const springY = useSpring(y, spring.soft);
  const [hovered, setHovered] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > MAGNET_RADIUS) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * MAGNET_STRENGTH);
    y.set(dy * MAGNET_STRENGTH);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 999,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    transitionProperty: "background-color, border-color, color, box-shadow",
    transitionDuration: `${duration.base * 1000}ms`,
    transitionTimingFunction: `cubic-bezier(${ease.outQuart.join(",")})`,
    ...sizeStyles[size],
  };

  const primary: React.CSSProperties = {
    ...base,
    backgroundColor: "var(--color-dark)",
    color: "var(--color-bg)",
    border: "1px solid var(--color-dark)",
    boxShadow: "0 0 0 rgba(20,20,18,0)",
  };

  const ghost: React.CSSProperties = {
    ...base,
    backgroundColor: "transparent",
    color: "var(--color-ink)",
    border: "1px solid rgba(20,20,18,0.18)",
  };

  const text: React.CSSProperties = {
    ...base,
    background: "transparent",
    color: "var(--color-ink)",
    border: "1px solid transparent",
    padding:
      size === "sm" ? "4px 8px" : size === "md" ? "6px 10px" : "8px 12px",
  };

  const finalStyle =
    variant === "primary" ? primary : variant === "ghost" ? ghost : text;

  function onEnter(e: React.MouseEvent<HTMLElement>) {
    setHovered(true);
    const el = e.currentTarget;
    if (variant === "primary") {
      el.style.backgroundColor = "var(--color-dark-alt)";
      el.style.boxShadow = "0 8px 24px rgba(20,20,18,0.15)";
    } else if (variant === "ghost") {
      el.style.backgroundColor = "rgba(20,20,18,0.04)";
      el.style.borderColor = "rgba(20,20,18,0.32)";
    } else {
      // text: reveal underline
      const underline = el.querySelector<HTMLElement>(".mcta-underline");
      if (underline) underline.style.transform = "scaleX(1)";
    }
  }

  function onLeaveStyles(e: React.MouseEvent<HTMLElement>) {
    setHovered(false);
    const el = e.currentTarget;
    if (variant === "primary") {
      el.style.backgroundColor = "var(--color-dark)";
      el.style.boxShadow = "0 0 0 rgba(20,20,18,0)";
    } else if (variant === "ghost") {
      el.style.backgroundColor = "transparent";
      el.style.borderColor = "rgba(20,20,18,0.18)";
    } else {
      const underline = el.querySelector<HTMLElement>(".mcta-underline");
      if (underline) underline.style.transform = "scaleX(0)";
    }
    handleLeave();
  }

  const content = (
    <>
      <span className={sizeClass[size]} style={{ position: "relative" }}>
        {children}
        {variant === "text" ? (
          <span
            className="mcta-underline"
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -4,
              height: 1,
              background: "currentColor",
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: `transform ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
              pointerEvents: "none",
            }}
          />
        ) : null}
      </span>
      {icon !== null ? (
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            transform: hovered && !reduce ? "translateX(4px)" : "translateX(0)",
            transition: `transform ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
          }}
        >
          {icon ?? "→"}
        </span>
      ) : null}
    </>
  );

  const motionStyle = { x: springX, y: springY, ...finalStyle };

  if (type === "submit" || type === "button" || (onClick && !to)) {
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        onClick={
          onClick ? (e) => onClick(e as React.MouseEvent) : undefined
        }
        onMouseMove={handleMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeaveStyles}
        style={motionStyle}
        className={className}
        aria-label={ariaLabel}
      >
        {content}
      </motion.button>
    );
  }

  if (to && isExternal(to)) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={to}
        target={to.startsWith("mailto:") ? undefined : "_blank"}
        rel={to.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        onMouseMove={handleMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeaveStyles}
        onClick={onClick ? (e) => onClick(e as React.MouseEvent) : undefined}
        style={motionStyle}
        className={className}
        aria-label={ariaLabel}
      >
        {content}
      </motion.a>
    );
  }

  // Internal link (or missing to — treat as home)
  const target = to || "/";
  return (
    <motion.span
      ref={ref as React.Ref<HTMLSpanElement>}
      onMouseMove={handleMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeaveStyles}
      style={motionStyle}
      className={className}
    >
      <Link
        to={target}
        onClick={onClick ? (e) => onClick(e as React.MouseEvent) : undefined}
        aria-label={ariaLabel}
        style={{
          all: "unset",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
          color: "inherit",
        }}
      >
        {content}
      </Link>
    </motion.span>
  );
}
