export default function PillHl({ children }: { children: React.ReactNode }) {
  return (
    <span className="pill-hl">
      <span style={{ WebkitTextFillColor: "transparent" }}>{children}</span>
    </span>
  );
}
