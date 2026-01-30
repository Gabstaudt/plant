import type { SensorDetailsDto } from "@/app/components/mocks/sensors/sensors.mocks";
import { sampleSensorAlerts } from "@/app/components/mocks/sensors/sensors.mocks";
import { AlertTriangle } from "lucide-react";

export default function SensorAlertsPanel({ sensor }: { sensor: SensorDetailsDto }) {
  const alerts = sampleSensorAlerts;

  return (
    <div className="mt-4">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="rounded-2xl border border-black/10 bg-white p-5 flex items-center justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 grid place-items-center w-9 h-9 rounded-xl bg-yellow-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>

            <div>
              <div className="text-base font-extrabold text-[var(--plant-graphite)]">
                {a.title}
              </div>
              <div className="text-sm text-black/45">{a.at}</div>
            </div>
          </div>

          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold text-emerald-700">
            {a.statusLabel}
          </span>
        </div>
      ))}
    </div>
  );
}
