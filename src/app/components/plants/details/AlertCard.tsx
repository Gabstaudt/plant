import { AlertTriangle } from "lucide-react";

type PillTone = "danger" | "warning" | "neutral";

function Pill({ children, tone }: { children: string; tone: PillTone }) {
  const cls =
    tone === "danger"
      ? "bg-red-50 text-red-600 border-red-100"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`badge border ${cls}`}>{children}</span>
  );
}

export default function AlertCard({
  title,
  subtitle,
  plantName,
  sensorCode,
  value,
  time,
}: {
  title: string;
  subtitle: string;
  plantName: string;
  sensorCode: string;
  value: string;
  time: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-red-50 grid place-items-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>

          <div>
            <p className="font-bold text-[var(--plant-graphite)]">{title}</p>
            <p className="text-sm text-black/45">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Pill tone="danger">Crítico</Pill>
          <Pill tone="danger">Ativo</Pill>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Info label="Planta" value={plantName} />
        <Info label="Sensor" value={sensorCode} />
        <Info label="Valor" value={value} />
        <Info label="Horário" value={time} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-black/35">{label}:</p>
      <p className="text-sm font-semibold text-[var(--plant-graphite)]">{value}</p>
    </div>
  );
}
