import { Thermometer } from "lucide-react";

export default function SensorCard({
  name,
  code,
  value,
  statusLabel = "Online",
}: {
  name: string;
  code: string;
  value: string;
  statusLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 grid place-items-center">
          <Thermometer className="h-5 w-5 text-emerald-600" />
        </div>

        <div>
          <p className="font-bold text-[var(--plant-graphite)]">{name}</p>
          <p className="text-xs text-black/40">{code}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100">
          {statusLabel}
        </span>
        <span className="text-xl font-extrabold text-[var(--plant-graphite)]">
          {value}
        </span>
      </div>
    </div>
  );
}
