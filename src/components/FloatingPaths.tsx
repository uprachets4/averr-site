import { useMemo } from 'react';
import { motion } from 'framer-motion';

function generatePaths(count: number, seedOffset: number) {
  return Array.from({ length: count }, (_, i) => {
    const y = 60 + i * 9 + seedOffset;
    return {
      id: i,
      d: `M-200 ${y}C${140} ${y - 60 - i * 3},${340} ${y + 100 + i * 2},${760} ${y - 20}S${1240} ${y + 80},${1600} ${y}`,
      width: 0.5 + i * 0.025,
    };
  });
}

export default function FloatingPaths() {
  const paths = useMemo(() => generatePaths(28, 0), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1400 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-3)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        {paths.map((p) => (
          <motion.path
            key={p.id}
            d={p.d}
            stroke="url(#pathGradient)"
            strokeWidth={p.width}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 0.35, 0.1],
            }}
            transition={{
              duration: 14 + (p.id % 6),
              repeat: Infinity,
              ease: 'linear',
              delay: p.id * 0.15,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
