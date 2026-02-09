import type { SensorStatus } from "@/app/components/mocks/sensors/sensors.mocks";

function mapStatus(status: SensorStatus) {
  if (status === "ONLINE") return { label: "Online", cls: "bg-[var(--plant-primary)]/10 text-[var(--plant-primary)] border-[var(--plant-primary)]/15" };
  if (status === "ATENCAO") return { label: "Atenção", cls: "bg-amber-500/10 text-amber-700 border-amber-500/20" };
  return { label: "Offline", cls: "bg-black/5 text-black/55 border-black/10" };
}

export default function SensorStatusPill({ status }: { status: SensorStatus }) {
  const s = mapStatus(status);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${s.cls}`}>
      {/* wifi iconzinho pode ficar no header, aqui só label */}
      {s.label}
    </span>
  );
}
