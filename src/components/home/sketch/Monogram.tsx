import type { Preset } from "./presets";

/**
 * A brand mark drawn from the name's initials, in the preset's own style.
 *
 * Seven different marks, not one mark in seven colours: the enclosure, the
 * stroke weight and the lettering all change with the industry. Pure SVG —
 * nothing here is an image file.
 */

const SKIP = new Set(["the", "and", "&", "of", "a", "at", "for", "on", "co", "co.", "inc", "inc.", "ltd"]);

/** Up to two initials, skipping the words nobody abbreviates. */
export function initialsOf(name: string): string {
  const words = name
    .split(/[\s\-–—/]+/)
    .map(function clean(w) {
      return w.replace(/[^\p{L}\p{N}]/gu, "");
    })
    .filter(function keep(w) {
      return w.length > 0 && !SKIP.has(w.toLowerCase());
    });
  if (words.length === 0) return "A";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function Monogram({
  name,
  preset,
  size = 34,
}: {
  name: string;
  preset: Preset;
  size?: number;
}) {
  const t = initialsOf(name);
  const { palette: p, type } = preset;
  const two = t.length > 1;

  /* letter styling shared by every mark */
  const letter = {
    fontFamily: type.display,
    fontWeight: type.displayWeight,
    fontStyle: type.displayItalic ? "italic" : "normal",
    letterSpacing: two ? "0.01em" : "0",
  } as const;

  function Letters({ fill, y = 63, fs = 40 }: { fill: string; y?: number; fs?: number }) {
    return (
      <text
        x="50"
        y={y}
        textAnchor="middle"
        fontSize={two ? fs : fs + 6}
        fill={fill}
        style={letter}
      >
        {t}
      </text>
    );
  }

  const common = { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true } as const;

  switch (preset.id) {
    /* a filled disc — soft, hospitable */
    case "food":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="48" fill={p.accent} />
          <Letters fill={p.onAccent} />
        </svg>
      );

    /* a rounded square with a quiet cross notch */
    case "health":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="96" height="96" rx="26" fill={p.accent} />
          <rect x="46" y="12" width="8" height="18" rx="4" fill={p.onAccent} opacity="0.5" />
          <Letters fill={p.onAccent} y={68} fs={38} />
        </svg>
      );

    /* a shield, cut square at the top */
    case "trades":
      return (
        <svg {...common}>
          <path d="M6 6 H94 V58 L50 96 L6 58 Z" fill={p.ink} />
          <path d="M6 6 H94 V18 H6 Z" fill={p.accent} />
          <Letters fill={p.bg} y={62} fs={34} />
        </svg>
      );

    /* a thin ring — nothing filled, everything spaced */
    case "beauty":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="46" fill="none" stroke={p.accent} strokeWidth="2" />
          <circle cx="50" cy="50" r="39" fill="none" stroke={p.accent} strokeWidth="0.5" opacity="0.6" />
          <text
            x="50"
            y="63"
            textAnchor="middle"
            fontSize={two ? 34 : 40}
            fill={p.accent}
            style={{ ...letter, letterSpacing: "0.1em" }}
          >
            {t}
          </text>
        </svg>
      );

    /* a hard block with a slice taken out of the corner */
    case "fitness":
      return (
        <svg {...common}>
          <path d="M0 0 H100 V72 L72 100 H0 Z" fill={p.accent} />
          <Letters fill={p.onAccent} y={66} fs={40} />
        </svg>
      );

    /* a ruled square — the letterhead mark */
    case "professional":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="94" height="94" fill="none" stroke={p.accent} strokeWidth="3" />
          <Letters fill={p.accent} y={58} fs={36} />
          <rect x="30" y="70" width="40" height="2" fill={p.accent} opacity="0.7" />
        </svg>
      );

    /* a pin */
    default:
      return (
        <svg {...common}>
          <path d="M50 97 C50 97 88 60 88 40 A38 38 0 1 0 12 40 C12 60 50 97 50 97 Z" fill={p.accent} />
          <Letters fill={p.onAccent} y={54} fs={34} />
        </svg>
      );
  }
}
