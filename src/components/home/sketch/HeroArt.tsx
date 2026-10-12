import type { Preset } from "./presets";

/**
 * The hero image of the generated site — drawn, never photographed.
 *
 * Seven abstract compositions, each built from the preset's own palette
 * and suited to the industry: warm arcs and a cup for food, soft overlaps
 * and a pulse for a clinic, roof pitches for trades, and so on. They are
 * decorative; the window that holds them is already aria-hidden.
 */
export default function HeroArt({ preset }: { preset: Preset }) {
  const p = preset.palette;
  const box = { width: "100%", height: "100%", display: "block" } as const;

  switch (preset.id) {
    /* warm concentric arcs behind a cup */
    case "food":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.accent} opacity="0.1" />
          {[150, 118, 86, 54].map(function arc(r, i) {
            return (
              <circle
                key={r}
                cx="300"
                cy="250"
                r={r}
                fill="none"
                stroke={p.accent}
                strokeWidth={i === 1 ? 10 : 2}
                opacity={0.18 + i * 0.12}
              />
            );
          })}
          <g transform="translate(96 108)">
            <path d="M0 20 H96 V62 A36 36 0 0 1 60 98 H36 A36 36 0 0 1 0 62 Z" fill={p.accent} />
            <path d="M96 34 H112 A20 20 0 0 1 112 74 H96" fill="none" stroke={p.accent} strokeWidth="9" />
            <rect x="-14" y="104" width="124" height="7" rx="3.5" fill={p.ink} opacity="0.5" />
            {[18, 44, 70].map(function steam(x) {
              return (
                <path
                  key={x}
                  d={`M${x} 10 c6 -10 -6 -16 0 -26`}
                  fill="none"
                  stroke={p.ink}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.3"
                />
              );
            })}
          </g>
        </svg>
      );

    /* overlapping calm circles with a single pulse line */
    case "health":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.accent} opacity="0.07" />
          <circle cx="140" cy="130" r="96" fill={p.accent} opacity="0.16" />
          <circle cx="248" cy="166" r="76" fill={p.accent} opacity="0.22" />
          <circle cx="206" cy="104" r="48" fill={p.surface} opacity="0.8" />
          <path
            d="M20 214 H132 l14 -40 18 76 20 -98 16 62 h26 l12 -22 h142"
            fill="none"
            stroke={p.accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="196" y="88" width="20" height="60" rx="10" fill={p.accent} opacity="0.5" />
          <rect x="176" y="108" width="60" height="20" rx="10" fill={p.accent} opacity="0.5" />
        </svg>
      );

    /* roof pitches and a level line */
    case "trades":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.ink} />
          <path d="M0 300 L120 120 L240 300 Z" fill={p.accent} opacity="0.9" />
          <path d="M160 300 L280 150 L400 300 Z" fill={p.bg} opacity="0.92" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function stripe(i) {
            return (
              <rect
                key={i}
                x={-60 + i * 56}
                y="0"
                width="18"
                height="300"
                fill={p.accent}
                opacity="0.09"
                transform="skewX(-18)"
              />
            );
          })}
          <rect x="24" y="58" width="150" height="8" rx="2" fill={p.bg} opacity="0.55" />
          <rect x="24" y="58" width="150" height="8" rx="2" fill="none" stroke={p.accent} strokeWidth="1.5" />
          <circle cx="99" cy="62" r="7" fill={p.accent} />
        </svg>
      );

    /* a soft blob and two thin arcs */
    case "beauty":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <defs>
            <radialGradient id="bty" cx="38%" cy="36%">
              <stop offset="0%" stopColor={p.accent} stopOpacity="0.5" />
              <stop offset="100%" stopColor={p.accent} stopOpacity="0.06" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill={p.bg} />
          <path
            d="M74 46 C186 6 322 42 350 126 C378 210 290 282 196 280 C102 278 28 230 30 160 C32 104 42 58 74 46 Z"
            fill="url(#bty)"
          />
          <circle cx="200" cy="150" r="118" fill="none" stroke={p.accent} strokeWidth="0.75" opacity="0.55" />
          <circle cx="200" cy="150" r="86" fill="none" stroke={p.accent} strokeWidth="0.75" opacity="0.4" />
          <path d="M120 206 C168 150 232 150 280 94" fill="none" stroke={p.accent} strokeWidth="1.5" opacity="0.75" />
        </svg>
      );

    /* bold diagonals and a ring */
    case "fitness":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.surface} />
          {[0, 1, 2, 3, 4].map(function bar(i) {
            return (
              <rect
                key={i}
                x={-120 + i * 96}
                y="-40"
                width="40"
                height="400"
                fill={p.accent}
                opacity={i % 2 ? 0.14 : 0.28}
                transform="skewX(-22)"
              />
            );
          })}
          <circle cx="286" cy="128" r="74" fill="none" stroke={p.accent} strokeWidth="14" />
          <circle cx="286" cy="128" r="74" fill="none" stroke={p.surface} strokeWidth="14" strokeDasharray="120 400" />
          <rect x="36" y="222" width="190" height="12" rx="6" fill={p.accent} />
          <rect x="36" y="248" width="116" height="12" rx="6" fill={p.ink} opacity="0.35" />
        </svg>
      );

    /* ruled columns — a letterhead, not a picture */
    case "professional":
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.accent} opacity="0.06" />
          {[0, 1, 2, 3].map(function col(i) {
            return (
              <g key={i} transform={`translate(${88 + i * 62} 60)`}>
                <rect x="0" y="0" width="30" height="168" fill={p.accent} opacity={0.14 + i * 0.07} />
                <rect x="-6" y="-10" width="42" height="10" fill={p.accent} opacity="0.5" />
                <rect x="-6" y="168" width="42" height="10" fill={p.accent} opacity="0.5" />
              </g>
            );
          })}
          <rect x="40" y="246" width="320" height="2" fill={p.accent} opacity="0.55" />
          <rect x="40" y="256" width="188" height="2" fill={p.accent} opacity="0.3" />
        </svg>
      );

    /* a street grid and a pin */
    default:
      return (
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={box} aria-hidden>
          <rect width="400" height="300" fill={p.accent} opacity="0.08" />
          {[0, 1, 2, 3, 4, 5].map(function h(i) {
            return <rect key={`h${i}`} x="0" y={24 + i * 50} width="400" height="1.5" fill={p.accent} opacity="0.28" />;
          })}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function v(i) {
            return <rect key={`v${i}`} x={22 + i * 52} y="0" width="1.5" height="300" fill={p.accent} opacity="0.28" />;
          })}
          <rect x="74" y="124" width="104" height="52" fill={p.accent} opacity="0.22" />
          <rect x="230" y="74" width="80" height="100" fill={p.accent} opacity="0.16" />
          <g transform="translate(252 110)">
            <path d="M24 86 C24 86 48 50 48 32 A24 24 0 1 0 0 32 C0 50 24 86 24 86 Z" fill={p.accent} />
            <circle cx="24" cy="31" r="9" fill={p.bg} />
          </g>
        </svg>
      );
  }
}
