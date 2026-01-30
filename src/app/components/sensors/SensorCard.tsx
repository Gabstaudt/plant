import Link from "next/link";
import type { SensorCardDto } from "@/app/components/mocks/sensors/sensors.mocks";
import { Cpu } from "lucide-react";

function statusBadge(status: SensorCardDto["status"]) {
  if (status === "ONLINE") return "bg-green-100 text-green-700";
  if (status === "ATENCAO") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700";
}

function statusLabel(status: SensorCardDto["status"]) {
  if (status === "ONLINE") return "Online";
  if (status === "ATENCAO") return "Atenção";
  return "Offline";
}

export default function SensorCard({ sensor }: { sensor: SensorCardDto }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
            <Cpu className="h-5 w-5 text-[var(--plant-primary)]" />
          </div>
          <div>
            <div className="font-extrabold text-[var(--plant-graphite)]">
              {sensor.name}
            </div>
            <div className="text-sm text-black/45">{sensor.code}</div>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(sensor.status)}`}>
          {statusLabel(sensor.status)}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-sm text-black/45">
          {sensor.plantName ? (
            <div className="flex items-center gap-2">
              <span>Vinculado:</span>
              {sensor.plantId ? (
                <Link
                  href={`/plants/${sensor.plantId}`}
                  className="font-semibold text-[var(--plant-primary)] hover:underline"
                >
                  {sensor.plantName}
                </Link>
              ) : (
                <span className="font-semibold">{sensor.plantName}</span>
              )}
            </div>
          ) : (
            <span>Sem vínculo</span>
          )}

          <div className="mt-1 text-xs text-black/35">Atualizado: {sensor.updatedAt}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-[var(--plant-graphite)] leading-none">
            {sensor.lastValue}
            <span className="text-sm font-bold text-black/45 ml-1">{sensor.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
