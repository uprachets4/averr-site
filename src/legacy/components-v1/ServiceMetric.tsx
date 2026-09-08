import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { animate } from 'animejs';
import AnimatedNumber from './AnimatedNumber';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function ServiceMetric({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, amount: 0.4 });

  function handleHover() {
    if (!shimmerRef.current) return;
    // AnimeJS: a light sweeps across the filled bar on hover
    animate(shimmerRef.current, {
      translateX: ['-120%', '260%'],
      duration: 650,
      ease: 'outCubic',
    });
  }

  return (
    <div ref={wrapRef} className="flex-1 min-w-[110px]" onMouseEnter={handleHover}>
      <div className="font-display text-2xl font-bold gradient-text-stat mb-1.5 leading-none">
        <AnimatedNumber value={`${value}%`} />
      </div>

      <div className="relative h-[5px] rounded-full overflow-hidden mb-2" style={{ background: 'var(--border)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: '0%' }}
          animate={{ width: isInView ? `${value}%` : '0%' }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
        />
        <div
          ref={shimmerRef}
          className="absolute inset-y-0 w-10 pointer-events-none"
          style={{
            transform: 'translateX(-120%)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
          }}
        />
      </div>

      <span className="text-[11px] text-[var(--text-muted)] leading-tight block max-w-[150px]">
        {label}
      </span>
    </div>
  );
}
