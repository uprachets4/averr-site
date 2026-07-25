import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function HowIWork() {
  return (
    <section id="how" className="py-24 md:py-32 px-6 md:px-8 bg-[var(--surface-alt)]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            How I Work
          </div>
          <h2 className="font-display font-bold text-[clamp(28px,3.4vw,38px)] tracking-[-0.01em] leading-[1.15]">
            An operator, not a vendor.
          </h2>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="text-lg text-[var(--text)] mb-4 max-w-[480px]"
          >
            Nine years in enterprise account management taught me how large operations
            actually run &mdash; the workflows, the handoffs, the things that quietly cost
            money. I build the software that fixes those, then ship the site that sells it.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="text-[var(--text-muted)] mb-8 max-w-[480px]"
          >
            That's the difference between hiring a studio and hiring someone who's run
            the account, built the agent, and can see the whole system before writing
            a line of code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="flex gap-8 flex-wrap"
          >
            <div>
              <div className="font-display text-[34px] font-bold text-[var(--accent)]"><AnimatedNumber value="4" /></div>
              <div className="text-[13px] text-[var(--text-muted)] mt-1">Products shipped or in build</div>
            </div>
            <div>
              <div className="font-display text-[34px] font-bold text-[var(--accent)]"><AnimatedNumber value="1" /></div>
              <div className="text-[13px] text-[var(--text-muted)] mt-1">Operator across all of them</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
