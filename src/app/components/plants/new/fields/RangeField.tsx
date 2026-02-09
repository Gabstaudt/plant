export default function RangeField({
  label,
  minValue,
  maxValue,
  onChangeMin,
  onChangeMax,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onChangeMin: (v: string) => void;
  onChangeMax: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
        {label}
      </label>

      <div className="mt-2 flex items-center gap-3">
        <input
          value={minValue}
          onChange={(e) => onChangeMin(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
        />
        <span className="text-sm text-black/35">a</span>
        <input
          value={maxValue}
          onChange={(e) => onChangeMax(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
        />
      </div>
    </div>
  );
}
