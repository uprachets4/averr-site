import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const FEED = [
  { label: 'New lead scanned', sub: 'Realtor listing, 4br detached — Etobicoke', status: 'Scoring', tone: 'accent' as const },
  { label: 'Resume tailored', sub: 'ATS score 61 \u2192 89 for Senior PM role', status: 'Done', tone: 'done' as const },
  { label: 'Outreach drafted', sub: 'Personalized note, VP Eng at target company', status: 'Awaiting review', tone: 'wait' as const },
  { label: 'Post scored', sub: 'Voice 8/10, Strength 9/10', status: 'Scheduled', tone: 'accent' as const },
];

const toneStyles: Record<string, { bg: string; text: string }> = {
  accent: { bg: 'var(--accent-dim)', text: 'var(--accent)' },
  done: { bg: 'rgba(80,200,140,0.14)', text: '#4ADE80' },
  wait: { bg: 'rgba(255,180,80,0.14)', text: '#FBBF24' },
};

export default function AgentPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 md:p-8 max-w-[560px] mx-auto md:mx-0"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: 'var(--accent)', animation: 'agentPulse 2s cubic-bezier(0,0,0.2,1) infinite' }}
            />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: 'var(--accent)' }} />
          </span>
          <span className="text-sm font-medium">Agent running</span>
        </div>
        <span className="text-[11px] tracking-[0.06em] uppercase px-2.5 py-1 rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
          Live
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="font-display text-xl font-bold gradient-text-stat"><AnimatedNumber value="14" /></div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Actions today</div>
        </div>
        <div>
          <div className="font-display text-xl font-bold gradient-text-stat"><AnimatedNumber value="3" /></div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Awaiting review</div>
        </div>
        <div>
          <div className="font-display text-xl font-bold gradient-text-stat"><AnimatedNumber value="0" /></div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Errors</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {FEED.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            className="flex items-start justify-between gap-3"
          >
            <div>
              <div className="text-[14px] font-medium">{item.label}</div>
              <div className="text-[12.5px] text-[var(--text-muted)] mt-0.5">{item.sub}</div>
            </div>
            <span
              className="flex-shrink-0 text-[11px] px-2 py-1 rounded-full whitespace-nowrap"
              style={{ background: toneStyles[item.tone].bg, color: toneStyles[item.tone].text }}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>

      <style>{`
        @keyframes agentPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
