import type { ReactNode } from "react";

export default function MetricCard({
  icon,
  label,
  value,
  suffix,
  ideal,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  ideal?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <div className="flex items-center gap-2 text-sm text-black/60">
        <span className="inline-flex">{icon}</span>
        <span className="font-semibold">{label}</span>
      </div>

      <div className="mt-2 text-2xl font-extrabold text-[var(--plant-graphite)]">
        {value}
        {suffix ? <span className="text-lg font-bold">{suffix}</span> : null}
      </div>

      {ideal ? (
        <div className="mt-1 text-xs text-black/40">Ideal: {ideal}</div>
      ) : null}
    </div>
  );
}
