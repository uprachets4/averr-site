import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import LazyOnVisible from './LazyOnVisible';
import ServiceMetric from './ServiceMetric';
import ServiceIcon from './ServiceIcon';

const EASE = [0.25, 0.1, 0.25, 1] as const;

function TiltCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 4, y: px * 4 });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 px-6 md:px-8 bg-[var(--surface-alt)]">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-[640px] mb-16"
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            Services
          </div>
          <h2 className="font-display font-bold text-[clamp(28px,3.4vw,38px)] tracking-[-0.01em] leading-[1.15]">
            Three ways to work together.
          </h2>
          <p className="text-[var(--text-muted)] mt-4">
            Pick one, or stack all three &mdash; most projects end up needing at least two.
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-2 opacity-80">
            Figures below are averaged across 50+ projects shipped, not a single case.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-6">
          <TiltCard
            delay={0}
            className="rounded-2xl p-8 relative overflow-hidden border"
          >
            <div
              className="absolute inset-0 -z-0"
              style={{
                background: 'linear-gradient(160deg, var(--surface-elevated), var(--surface-alt))',
                borderRadius: 16,
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                border: '1px solid rgba(124,92,252,0.5)',
                boxShadow: '0 0 0 1px rgba(124,92,252,0.15), 0 20px 50px rgba(124,92,252,0.12)',
              }}
            />
            <div className="absolute -right-10 -top-10 w-56 h-56 opacity-70 pointer-events-none">
              <LazyOnVisible factory={() => import('./ServiceScenePipeline')} />
            </div>
            <div className="relative z-[1]">
              <ServiceIcon variant="agents" />
              <div className="font-display text-xs text-[var(--accent)] uppercase tracking-[0.08em] mt-4 mb-2">
                Lead Offering
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">AI Automation &amp; Agents</h3>
              <p className="text-[var(--text-muted)] text-[15px] mb-4 max-w-[280px]">
                Agentic workflows that do the repetitive work your team shouldn't have to
                &mdash; lead scanning, outreach drafting, data analysis, follow-ups.
              </p>
              <div className="flex gap-6 mb-5">
                <ServiceMetric value={85} label="Automation coverage" color="var(--accent)" />
                <ServiceMetric value={70} label="Hours saved weekly" color="var(--accent-2)" />
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  'Custom AI agents for outreach & lead-gen',
                  'Workflow automation across your existing tools',
                  'Data analysis pipelines, built and monitored',
                ].map((item) => (
                  <li key={item} className="text-sm text-[var(--text-muted)] pl-4 relative">
                    <span className="absolute left-0 text-[var(--accent)]">&mdash;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>

          <TiltCard
            delay={0.1}
            className="rounded-2xl p-8 border border-[var(--border)] bg-[var(--surface-elevated)] relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-48 h-48 opacity-60 pointer-events-none">
              <LazyOnVisible factory={() => import('./ServiceSceneLayers')} />
            </div>
            <div className="relative z-[1]">
              <ServiceIcon variant="web" />
              <h3 className="font-display font-bold text-2xl mt-4 mb-3">Web &amp; Brand</h3>
              <p className="text-[var(--text-muted)] text-[15px] mb-4 max-w-[280px]">
                Premium, portfolio-grade websites &mdash; the kind that make the price feel
                like a steal.
              </p>
              <div className="flex gap-6 mb-5">
                <ServiceMetric value={92} label="Design distinctiveness" color="var(--accent)" />
                <ServiceMetric value={96} label="Performance score" color="var(--accent-2)" />
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  'Full design direction, not a template',
                  'Motion & interaction system included',
                  'Built for Framer or your stack of choice',
                ].map((item) => (
                  <li key={item} className="text-sm text-[var(--text-muted)] pl-4 relative">
                    <span className="absolute left-0 text-[var(--accent)]">&mdash;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>

          <TiltCard
            delay={0.2}
            className="rounded-2xl p-8 border border-[var(--border)] bg-[var(--surface-elevated)] relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-48 h-48 opacity-60 pointer-events-none">
              <LazyOnVisible factory={() => import('./ServiceSceneBlocks')} />
            </div>
            <div className="relative z-[1]">
              <ServiceIcon variant="saas" />
              <h3 className="font-display font-bold text-2xl mt-4 mb-3">SaaS &amp; Product Build</h3>
              <p className="text-[var(--text-muted)] text-[15px] mb-4 max-w-[280px]">
                Full products shipped fast &mdash; from idea to a working platform your
                users can log into.
              </p>
              <div className="flex gap-6 mb-5">
                <ServiceMetric value={88} label="Launch readiness" color="var(--accent)" />
                <ServiceMetric value={90} label="AI-native features" color="var(--accent-2)" />
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  'Rapid build via Lovable + modern stack',
                  'AI-native by default, not bolted on',
                  'Built to launch, not just to demo',
                ].map((item) => (
                  <li key={item} className="text-sm text-[var(--text-muted)] pl-4 relative">
                    <span className="absolute left-0 text-[var(--accent)]">&mdash;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
