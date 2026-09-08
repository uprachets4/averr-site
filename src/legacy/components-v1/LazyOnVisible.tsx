import { useEffect, useRef, useState, type ComponentType } from 'react';

export default function LazyOnVisible({
  factory,
  rootMargin = '300px',
}: {
  factory: () => Promise<{ default: ComponentType }>;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [Comp, setComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (visible && !Comp) {
      factory().then((mod) => setComp(() => mod.default));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <div ref={ref} className="w-full h-full">
      {Comp ? <Comp /> : null}
    </div>
  );
}
