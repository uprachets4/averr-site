const ICONS: Record<string, React.ReactNode> = {
  // Agents: connected nodes — echoes the Hero's network visualization
  agents: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="7" r="2" stroke="white" strokeWidth="1.6" />
      <circle cx="18" cy="6" r="1.6" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="17" r="2.2" stroke="white" strokeWidth="1.6" />
      <path d="M7.7 8.3L11 15.3M8 6.6L16.3 6.2M13.5 15.6L17 7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  // Web & Brand: a simple browser frame with a cursor, standing in for design/interaction craft
  web: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="5" width="17" height="13.5" rx="2" stroke="white" strokeWidth="1.6" />
      <path d="M3.5 9h17" stroke="white" strokeWidth="1.6" />
      <circle cx="6.3" cy="7" r="0.6" fill="white" />
      <circle cx="8.3" cy="7" r="0.6" fill="white" />
      <path d="M13 12.5l5 2.1-2.1.7-.7 2.1-2.2-4.9z" fill="white" />
    </svg>
  ),
  // SaaS & Product Build: stacked layers assembling — echoes the Services 3D block scene
  saas: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4l7.5 3.8L12 11.6 4.5 7.8 12 4z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4.5 12.2L12 16l7.5-3.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 16.4L12 20.2l7.5-3.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function ServiceIcon({ variant }: { variant: 'agents' | 'web' | 'saas' }) {
  return (
    <div
      className="w-11 h-11 flex items-center justify-center flex-shrink-0 squircle"
      style={{
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2), #A78BFA)',
        borderRadius: 14,
      }}
    >
      <div className="w-5 h-5">{ICONS[variant]}</div>
    </div>
  );
}
