import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export interface StoryStop {
  src: string;
  alt: string;
  caption: string;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function SiftScrollStory({ stops }: { stops: StoryStop[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(stops.length - 1, Math.floor(v * stops.length));
    setActive(i);
  });

  return (
    <div ref={wrapRef} style={{ height: `${stops.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-12 items-center">
          {/* left: narrative that advances with scroll, not a timer */}
          <div>
            <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] mb-4">
              SIFT &mdash; scroll to follow the pipeline
            </div>
            <div className="font-display text-[13px] text-[var(--text-muted)] mb-3">
              {String(active + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
            </div>
            <AnimatePresence mode="wait">
              <motion.h3
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-display font-bold text-[clamp(22px,2.6vw,30px)] leading-[1.25] tracking-[-0.01em] min-h-[110px] md:min-h-[135px]"
              >
                {stops[active].caption}
              </motion.h3>
            </AnimatePresence>

            {/* progress rail — a tick per stop, filling as you scroll through it */}
            <div className="flex gap-1.5 mt-8">
              {stops.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] flex-1 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent)' }}
                    initial={false}
                    animate={{ width: i <= active ? '100%' : '0%' }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* right: the real screenshot for this stop */}
          <div
            className="relative rounded-2xl border border-[var(--border)] overflow-hidden aspect-[16/10]
                       shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.3),0_30px_70px_rgba(0,0,0,0.35)]"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={active}
                src={stops[active].src}
                alt={stops[active].alt}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
