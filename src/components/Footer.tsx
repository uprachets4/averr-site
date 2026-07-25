export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-16 px-6 md:px-8">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-16">
          <div>
            <div className="font-display font-bold text-lg tracking-tight">
              AVERR<span className="text-[var(--accent)]">.</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm mt-3 max-w-[280px]">
              Websites, AI agents, and SaaS products &mdash; built by one operator,
              from the GTA.
            </p>
          </div>
          <div>
            <h4 className="text-[13px] text-[var(--text-muted)] uppercase tracking-[0.04em] mb-4">Studio</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#work" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Work</a>
              <a href="#how" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">How I Work</a>
              <a href="#services" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Services</a>
            </div>
          </div>
          <div>
            <h4 className="text-[13px] text-[var(--text-muted)] uppercase tracking-[0.04em] mb-4">Get in touch</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#contact" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Start a project</a>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-16 pt-6 border-t border-[var(--border)] text-[13px] text-[var(--text-muted)] flex-wrap gap-3">
          <div>&copy; 2026 Averr</div>
          <div>Greater Toronto Area</div>
        </div>
      </div>
    </footer>
  );
}
