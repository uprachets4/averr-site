import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const NODES = [
  { x: 90, label: 'Signal in', sub: 'A lead, a listing, a resume' },
  { x: 370, label: 'Agent reasoning', sub: 'Scores it against the target' },
  { x: 650, label: 'Decision', sub: 'Route, escalate, or draft' },
  { x: 930, label: 'Action taken', sub: 'Outreach sent, no human needed' },
];

const PATHS = [
  'M 90 130 C 190 130, 270 130, 370 130',
  'M 370 130 C 470 130, 550 130, 650 130',
  'M 650 130 C 750 130, 830 130, 930 130',
];

export default function AgentFlow() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section className="light-section py-24 md:py-28 px-6 md:px-8 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[640px] mb-14"
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            //_how the agents actually work
          </div>
          <h2 className="font-display font-bold text-[clamp(24px,2.8vw,32px)] tracking-[-0.01em] leading-[1.2]">
            Signal in. System decides. Action out. No human in the loop unless it matters.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full overflow-x-auto"
        >
          <svg
            viewBox="0 0 1020 260"
            className="w-full min-w-[720px] h-auto"
            aria-hidden="true"
          >
            {PATHS.map((d, i) => (
              <path
                key={i}
                id={`flow-path-${i}`}
                d={d}
                fill="none"
                stroke="rgba(124,92,252,0.35)"
                strokeWidth="2"
              />
            ))}

            {!reduced &&
              PATHS.map((_, i) => (
                <circle key={`pulse-${i}`} r="5" fill={i % 2 === 0 ? '#7C5CFC' : '#6E8CF0'}>
                  <animateMotion
                    dur="2.4s"
                    begin={`${i * 0.5}s`}
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#flow-path-${i}`} />
                  </animateMotion>
                </circle>
              ))}

            {NODES.map((node, i) => (
              <g key={i}>
                <circle
                  cx={node.x}
                  cy={130}
                  r={34}
                  fill="var(--surface-elevated)"
                  stroke={i === 0 || i === 2 ? '#7C5CFC' : '#6E8CF0'}
                  strokeWidth="1.5"
                />
                <circle cx={node.x} cy={130} r={7} fill={i === 0 || i === 2 ? '#7C5CFC' : '#6E8CF0'} opacity="0.9" />
                <text
                  x={node.x}
                  y={190}
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize="16"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={214}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="12.5"
                  fontFamily="Inter, sans-serif"
                >
                  {node.sub}
                </text>
                <text
                  x={node.x}
                  y={64}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="1"
                >
                  {`//_0${i + 1}`}
                </text>
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
