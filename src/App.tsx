function App() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <p
          className="font-mono uppercase mb-6"
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: 'var(--color-muted)'
          }}
        >
          Averr Studios · Redesign in progress
        </p>
        <h1
          className="font-display font-medium mb-6"
          style={{
            fontSize: 'clamp(40px, 6vw, 80px)',
            lineHeight: 1.05,
            letterSpacing: '-0.028em'
          }}
        >
          Rebuilding at <span className="pill-hl"><span>studio</span></span> quality.
        </h1>
        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.55,
            color: 'var(--color-muted)',
            maxWidth: '560px',
            margin: '0 auto'
          }}
        >
          The v2 rebuild is under way — warm-muted palette, signature pill-highlighted
          headline, gradient text that actually shifts. Real components landing shortly.
        </p>
      </div>
    </main>
  );
}

export default App;
