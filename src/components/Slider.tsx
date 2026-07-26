import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

export default function Slider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  function go(next: number) {
    setDirection(next > index ? 1 : -1);
    setIndex((next + slides.length) % slides.length);
  }

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative rounded-2xl border border-[var(--border)] overflow-hidden
                       shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.3),0_30px_70px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-[16/9] bg-[var(--surface-alt)]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={index}
              src={slides[index].src}
              alt={slides[index].alt}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </AnimatePresence>

          {/* auto-advance progress bar, resets each slide */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/20">
            <motion.div
              key={`progress-${index}-${paused}`}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
              initial={{ width: '0%' }}
              animate={{ width: paused ? '0%' : '100%' }}
              transition={{ duration: paused ? 0 : 3.5, ease: 'linear' }}
            />
          </div>
        </div>

        <button
          onClick={() => go(index - 1)}
          aria-label="Previous screenshot"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                     bg-[rgba(11,13,18,0.65)] backdrop-blur-md border border-[var(--border)]
                     flex items-center justify-center hover:bg-[var(--accent)] hover:scale-105
                     transition-all duration-200 z-10"
        >
          ←
        </button>
        <button
          onClick={() => go(index + 1)}
          aria-label="Next screenshot"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                     bg-[rgba(11,13,18,0.65)] backdrop-blur-md border border-[var(--border)]
                     flex items-center justify-center hover:bg-[var(--accent)] hover:scale-105
                     transition-all duration-200 z-10"
        >
          →
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-[var(--accent)]' : 'w-2 bg-[var(--border)]'
            }`}
          />
        ))}
      </div>

      <p className="text-center mt-3 text-sm font-display text-[var(--text-muted)]">
        {slides[index].caption}
      </p>
    </div>
  );
}
