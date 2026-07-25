import { useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="light-section py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="font-display text-[13px] tracking-[0.08em] uppercase text-[var(--accent)] flex items-center gap-2 mb-3">
            <span className="w-4 h-px bg-[var(--accent)]" />
            Start a Project
          </div>
          <h2 className="font-display font-bold text-[clamp(26px,3vw,34px)] tracking-[-0.01em] mb-4">
            Tell me what needs building.
          </h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-[440px]">
            Whether it's a site, an agent, or a full product &mdash; I usually reply
            within a day, and can walk through scope on a quick call before anything's
            signed.
          </p>
          <div className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
            <div><strong className="text-[var(--text)] font-medium">Response time:</strong> within 24 hours</div>
            <div><strong className="text-[var(--text)] font-medium">Based in:</strong> Greater Toronto Area</div>
            <div><strong className="text-[var(--text)] font-medium">Service area:</strong> GTA & remote, worldwide</div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-[13px] text-[var(--text-muted)] mb-1.5 block">Name</label>
            <input
              type="text"
              required
              placeholder="Your name"
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full px-3.5 py-3 text-[15px] focus:border-[var(--accent)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] text-[var(--text-muted)] mb-1.5 block">Email</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full px-3.5 py-3 text-[15px] focus:border-[var(--accent)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] text-[var(--text-muted)] mb-1.5 block">What are you building?</label>
            <textarea
              placeholder="A quick line on the project, and where you're stuck."
              rows={4}
              className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-full px-3.5 py-3 text-[15px] focus:border-[var(--accent)] outline-none transition-colors resize-y"
            />
          </div>
          <button
            type="submit"
            className="mt-2 self-start inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium
                       bg-[var(--accent)] text-white
                       shadow-[0_4px_20px_rgba(124,92,252,0.35)] hover:shadow-[0_4px_24px_rgba(124,92,252,0.5)]
                       transition-shadow duration-200"
          >
            {sent ? 'Sent — talk soon' : 'Send it over'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
