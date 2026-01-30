import type { SensorDetailsDto, SensorReadingRow } from "@/app/components/mocks/sensors/sensors.mocks";
import { sampleSensorReadings } from "@/app/components/mocks/sensors/sensors.mocks";

function StatusPill({ status }: { status?: SensorReadingRow["status"] }) {
  const label = status === "CRITICO" ? "Crítico" : status === "ATENCAO" ? "Atenção" : "Normal";

  const cls =
    status === "CRITICO"
      ? "bg-red-50 text-red-600 border-red-200"
      : status === "ATENCAO"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export default function SensorReadingsPanel({ sensor }: { sensor: SensorDetailsDto }) {
  const rows = sampleSensorReadings;

  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="text-xl font-extrabold text-[var(--plant-graphite)]">
        Histórico Completo
      </h3>

      <div className="mt-5">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr] px-2 text-sm font-semibold text-black/45">
          <span>Horário</span>
          <span className="text-center">Valor</span>
          <span className="text-right">Status</span>
        </div>

        <div className="mt-2 divide-y divide-black/5">
          {rows.map((r) => (
            <div key={r.at} className="grid grid-cols-[1.2fr_0.8fr_0.6fr] items-center px-2 py-4 text-sm">
              <span className="text-[var(--plant-graphite)]">{r.at}</span>
              <span className="text-center font-semibold text-[var(--plant-graphite)]">{r.value}</span>
              <div className="flex justify-end">
                <StatusPill status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
