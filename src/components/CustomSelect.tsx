import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";

type Option = { value: string; label: string };

type Props = {
  id?: string;
  label: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
};

/**
 * Custom-styled select — never falls back to browser default.
 * Matches text-input treatment: 1px ink-at-20% border, cream fill, rounded 8,
 * focus lifts border to 100% + inset ring. Keyboard: ArrowUp/Down/Enter/Escape.
 */
export default function CustomSelect({
  id,
  label,
  placeholder = "Choose one",
  options,
  value,
  onChange,
  required,
}: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel =
    options.find(function pick(o) {
      return o.value === value;
    })?.label ?? "";

  useEffect(
    function closeOnOutside() {
      if (!open) return;
      function onClick(e: MouseEvent) {
        if (
          !triggerRef.current?.contains(e.target as Node) &&
          !panelRef.current?.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", onClick);
      return function cleanup() {
        document.removeEventListener("mousedown", onClick);
      };
    },
    [open]
  );

  function onKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        const firstActive = Math.max(
          0,
          options.findIndex(function find(o) {
            return o.value === value;
          })
        );
        setActiveIdx(firstActive);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(function next(i) {
        return Math.min(options.length - 1, i + 1);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(function prev(i) {
        return Math.max(0, i - 1);
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = options[activeIdx];
      if (picked) {
        onChange(picked.value);
        setOpen(false);
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
      <label
        htmlFor={id}
        className="type-eyebrow"
        style={{ color: "var(--color-ink)" }}
      >
        {label}
        {required ? " *" : ""}
      </label>

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={function toggle() {
          setOpen(function next(o) {
            return !o;
          });
          if (!open) {
            setActiveIdx(
              Math.max(
                0,
                options.findIndex(function find(o) {
                  return o.value === value;
                })
              )
            );
          }
        }}
        onFocus={function f() {
          setFocused(true);
        }}
        onBlur={function b() {
          setFocused(false);
        }}
        onKeyDown={onKey}
        className="type-body"
        style={{
          appearance: "none",
          textAlign: "left",
          background: "var(--color-bg)",
          border: `1px solid ${focused ? "var(--color-ink)" : "rgba(20,20,18,0.2)"}`,
          borderRadius: 8,
          padding: "16px 20px",
          color: value ? "var(--color-ink)" : "rgba(20,20,18,0.6)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: focused ? "inset 0 0 0 1px var(--color-ink)" : "none",
          transition: `border-color ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
        }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedLabel || placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: `transform ${duration.fast * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
          }}
        >
          <path
            d="M3 5.5 L8 10.5 L13 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <motion.div
          ref={panelRef}
          role="listbox"
          initial={{
            opacity: reduce ? 1 : 0,
            y: reduce ? 0 : -4,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : duration.fast, ease: ease.outQuart }}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "var(--color-bg)",
            border: "1px solid rgba(20,20,18,0.2)",
            borderRadius: 8,
            boxShadow: "0 12px 32px rgba(20,20,18,0.10)",
            padding: 6,
            zIndex: 20,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {options.map(function drawOpt(opt, i) {
            const active = i === activeIdx;
            const selected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={selected}
                onMouseEnter={function h() {
                  setActiveIdx(i);
                }}
                onClick={function pick() {
                  onChange(opt.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="type-body"
                style={{
                  padding: "12px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: active ? "var(--color-bg-alt)" : "transparent",
                  color: "var(--color-ink)",
                  fontWeight: selected ? 600 : 400,
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </motion.div>
      ) : null}
    </div>
  );
}
