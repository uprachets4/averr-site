import { RingChart } from './charts/ring-chart';
import { Ring } from './charts/ring';
import { RingCenter } from './charts/ring-center';

export default function ServiceRing({
  value,
  maxValue = 100,
  label,
  color,
}: {
  value: number;
  maxValue?: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <RingChart
        size={84}
        strokeWidth={7}
        ringGap={0}
        baseInnerRadius={30}
        data={[{ label, value, maxValue, color }]}
      >
        <Ring index={0} />
        <RingCenter
          defaultLabel=""
          suffix="%"
          valueClassName="font-display font-bold text-sm"
          labelClassName="hidden"
        />
      </RingChart>
      <span className="text-[11px] text-[var(--text-muted)] text-center leading-tight max-w-[90px]">
        {label}
      </span>
    </div>
  );
}
