import { motion } from 'framer-motion';
import AgentPanel from './AgentPanel';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function AgentFlow() {
  return (
    <section className="py-24 md:py-28 px-6 md:px-8 overflow-hidden bg-[var(--surface-alt)]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            //_how the agents actually work
          </div>
          <h2 className="font-display font-bold text-[clamp(24px,2.8vw,32px)] tracking-[-0.01em] leading-[1.2] mb-4">
            Signal in. System decides. Action out.
          </h2>
          <p className="text-[var(--text-muted)] max-w-[420px]">
            No human in the loop unless it matters. Every agent scores, drafts, or routes
            &mdash; and hands off the moment judgment is genuinely needed. This is what
            that actually looks like running, right now.
          </p>
        </motion.div>

        <AgentPanel />
      </div>
    </section>
  );
}
