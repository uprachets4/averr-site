import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'How I Work', href: '#how' },
  { label: 'Services', href: '#services' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  function handleCtaMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  }

  function handleCtaLeave() {
    if (ctaRef.current) ctaRef.current.style.transform = '';
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4
                   bg-[rgba(8,8,12,0.55)] backdrop-blur-xl border-b border-[var(--border)]"
      >
        <a href="#" className="font-display font-bold text-lg tracking-tight">
          AVERR<span className="text-[var(--accent)]">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-[var(--text)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            ref={ctaRef}
            href="#contact"
            onMouseMove={handleCtaMove}
            onMouseLeave={handleCtaLeave}
            style={{ transition: 'transform 0.15s ease-out' }}
            className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--accent)] text-white
                       shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_16px_rgba(124,92,252,0.35)]
                       hover:shadow-[0_4px_20px_rgba(124,92,252,0.5)] transition-shadow duration-200"
          >
            Start a Project
          </a>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[rgba(8,8,12,0.98)] backdrop-blur-2xl
                       flex flex-col items-center justify-center gap-10"
          >
            <button
              className="absolute top-6 right-6 text-2xl"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            {[...LINKS, { label: 'Start a Project', href: '#contact' }].map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display text-3xl"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
