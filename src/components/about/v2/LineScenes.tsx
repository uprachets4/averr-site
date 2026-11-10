/**
 * The five scenes the pen draws through, as SVG details.
 *
 * Each `<g class="det dN">` holds one scene's furniture and is faded
 * in by `OneLine` once the pen has finished drawing that scene. The
 * whole SVG is `aria-hidden`; the step cards carry the content.
 *
 * Pure markup — no state, no effects. `OneLine` owns every animated
 * value and writes it straight onto these nodes.
 */

/**
 * The compass face: 36 ticks every 10°, the four cardinal ones longer.
 * Generated rather than written out, as the spec requires.
 */
function ticks() {
  return Array.from({ length: 36 }, function tick(_, k) {
    const a = (k * 10 * Math.PI) / 180;
    const r1 = k % 9 === 0 ? 172 : 180;
    const r2 = 192;
    return (
      <line
        key={k}
        x1={(500 + Math.sin(a) * r1).toFixed(1)}
        y1={(300 - Math.cos(a) * r1).toFixed(1)}
        x2={(500 + Math.sin(a) * r2).toFixed(1)}
        y2={(300 - Math.cos(a) * r2).toFixed(1)}
      />
    );
  });
}

export default function LineScenes() {
  return (
    <>
      {/* 1 · Direction — a compass that swings and settles */}
      <g className="det d0">
        <circle cx="500" cy="300" r="205" className="ring" />
        <g>{ticks()}</g>
        <text x="500" y="72" className="cl">N</text>
        <text x="736" y="308" className="cl">E</text>
        <text x="500" y="548" className="cl">S</text>
        <text x="264" y="308" className="cl">W</text>
        <g className="needle">
          <polygon points="500,158 520,300 500,442 480,300" fill="url(#ndl)" />
          <circle cx="500" cy="300" r="9" fill="#F5F4F9" />
        </g>
      </g>

      {/* 2 · Design — a page coming together on a grid */}
      <g className="det d1">
        <path
          className="cols"
          d="M1393 120V480M1446 120V480M1500 120V480M1553 120V480M1606 120V480"
        />
        <rect x="1350" y="168" width="285" height="34" rx="6" className="blk b1" />
        <rect x="1350" y="232" width="282" height="12" rx="4" className="blk b2" />
        <rect x="1350" y="266" width="200" height="12" rx="4" className="blk b3" />
        <rect x="1388" y="328" width="264" height="114" rx="8" className="blk b4" />
        <g className="cursor">
          <path d="M0 0L0 34L10 25L17 40L23 37L16 23L29 23Z" />
        </g>
        <text x="1720" y="180" className="tag">96</text>
        <path className="dimv" d="M1712 110V202" />
      </g>

      {/* 3 · Build — the components, typed out */}
      <g className="det d2">
        <text x="2300" y="500" className="code c1">{"<Hero signature />"}</text>
        <text x="2300" y="532" className="code c2">{"<Proof figures={real} />"}</text>
        <text x="2300" y="564" className="code c3">{'<Book call="30 min" />'}</text>
      </g>

      {/* 4 · Refine — a magnifier over the checklist */}
      <g className="det d3">
        <circle cx="3480" cy="270" r="128" fill="url(#lens)" />
        <path className="shine" d="M3400 190A110 110 0 0 1 3500 155" />
        <g className="checks">
          <text x="3680" y="160" className="ck">✓ Contrast</text>
          <text x="3680" y="200" className="ck">✓ Phones</text>
          <text x="3680" y="240" className="ck">✓ Keyboard</text>
          <text x="3680" y="280" className="ck">✓ Reduced motion</text>
        </g>
      </g>

      {/* 5 · Ship — the paper plane's wake, and the live pill */}
      <g className="det d4">
        <path
          className="speed"
          d="M4420 250H4530M4450 285H4545M4470 215H4560"
        />
        <g className="stars">
          <circle cx="4880" cy="70" r="5" />
          <circle cx="4930" cy="160" r="4" />
          <circle cx="4760" cy="60" r="3.5" />
          <circle cx="4960" cy="80" r="3" />
        </g>
        <g className="livepill">
          <rect x="4600" y="300" width="292" height="48" rx="24" />
          <circle cx="4628" cy="324" r="8" />
          <text x="4646" y="331">Live · 30-day window</text>
        </g>
      </g>
    </>
  );
}

/** The gradients and the needle fill the scenes and the line paint with. */
export function LineDefs() {
  return (
    <defs>
      <linearGradient
        id="lg"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="5000"
        y2="0"
      >
        <stop offset="0" stopColor="#F9AF97" />
        <stop offset=".25" stopColor="#D5818C" />
        <stop offset=".5" stopColor="#9874E8" />
        <stop offset=".75" stopColor="#708DF8" />
        <stop offset="1" stopColor="#569AFA" />
      </linearGradient>
      <radialGradient id="lens" cx=".4" cy=".35" r=".7">
        <stop offset="0" stopColor="#9DB8FF" stopOpacity=".22" />
        <stop offset="1" stopColor="#708DF8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ndl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F9AF97" />
        <stop offset=".5" stopColor="#F9AF97" />
        <stop offset=".5" stopColor="#3a4252" />
        <stop offset="1" stopColor="#3a4252" />
      </linearGradient>
    </defs>
  );
}
