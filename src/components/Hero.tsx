import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { animate } from 'animejs';
import WaveGrid from './WaveGrid';
import FloatingPaths from './FloatingPaths';

const HeroScene = lazy(() => import('./HeroScene'));

const EASE = [0.25, 0.1, 0.25, 1] as const;

const PROOF = ['SIFT', 'CG WALLS & FLOORS', 'CADENCESTACK', 'CAPITAL COMMAND'];

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: 'transform 0.15s ease-out' }}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }

  useEffect(() => {
    if (!badgeRef.current) return;
    // AnimeJS: continuous shimmering gradient shift on the "systems" badge
    animate(badgeRef.current, {
      backgroundPosition: ['0% 50%', '100% 50%'],
      loop: true,
      alternate: true,
      duration: 2800,
      ease: 'inOutSine',
    });
  }, []);

  return (
    <header
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlow((g) => ({ ...g, visible: false }))}
      className="relative min-h-screen flex items-center px-6 md:px-8 pt-32 pb-24 overflow-hidden"
    >
      <WaveGrid />
      <FloatingPaths />
      {/* cursor-following glow, desktop only */}
      <div
        className="absolute w-[460px] h-[460px] rounded-full pointer-events-none z-[1] hidden md:block transition-opacity duration-300"
        style={{
          left: glow.x,
          top: glow.y,
          transform: 'translate(-50%, -50%)',
          opacity: glow.visible ? 1 : 0,
          background: 'radial-gradient(circle, rgba(124,92,252,0.22) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-[2] max-w-[1240px] mx-auto w-full grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)' }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: 'var(--accent)', animation: 'agentPulse 2s cubic-bezier(0,0,0.2,1) infinite' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
            </span>
            <span className="font-display text-[12.5px] tracking-[0.04em] text-[var(--text)]">
              Available &mdash; taking on 2 new projects this quarter
            </span>
          </motion.div>

          <h1 className="font-display font-bold leading-[1.04] tracking-[-0.03em] text-[clamp(38px,5.4vw,76px)] mb-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                className="inline-flex items-baseline gap-3"
              >
                I build the
                <span
                  ref={badgeRef}
                  className="inline-block px-3 rounded-2xl text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2), #A78BFA)',
                    backgroundSize: '200% 200%',
                  }}
                >
                  systems
                </span>
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
                className="inline-block"
              >
                your business hasn&rsquo;t automated yet.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
            className="text-lg text-[var(--text-muted)] max-w-[520px] mb-8"
          >
            Premium websites, AI agents, and full SaaS products &mdash; built by one operator
            who ships product, not just decks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <MagneticLink
              href="#work"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium
                         bg-[var(--accent)] text-white
                         shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_20px_rgba(124,92,252,0.35),0_12px_40px_rgba(124,92,252,0.15)]
                         hover:shadow-[0_4px_24px_rgba(124,92,252,0.5)] transition-shadow duration-200"
            >
              See the Work
            </MagneticLink>
            <MagneticLink
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium
                         border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-white/[0.03] transition-colors duration-200"
            >
              Start a Project
            </MagneticLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
          >
            <div className="text-[11px] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-3">
              Real products, shipped &mdash; not mockups
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {PROOF.map((name) => (
                <span key={name} className="font-display text-[13px] tracking-[0.03em] text-[var(--text-muted)] opacity-80">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="relative"
        >
          <div
            className="rounded-2xl border border-[var(--border)] overflow-hidden aspect-square md:aspect-[4/5]
                       bg-[var(--surface-elevated)]
                       shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.4),0_30px_80px_rgba(124,92,252,0.08)]"
          >
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="text-[10.5px] tracking-[0.08em] uppercase text-[var(--text-muted)] opacity-60">
              4 products &mdash; one operator
            </span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-50px,70px) scale(1.1); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes driftReverse {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-50px) scale(1.15); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes agentPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </header>
  );
}
