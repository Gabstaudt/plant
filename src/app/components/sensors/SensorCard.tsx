import Link from "next/link";
import {
  Thermometer,
  Droplet,
  Sun,
  Wifi,
  BatteryFull,
} from "lucide-react";
import type { SensorCardDto } from "@/app/components/mocks/sensors/sensors.mocks";

function SensorIcon({ type }: { type: SensorCardDto["type"] }) {
  if (type === "UMIDADE") return <Droplet className="h-5 w-5 text-green-600" />;
  if (type === "LUMINOSIDADE") return <Sun className="h-5 w-5 text-yellow-500" />;
  return <Thermometer className="h-5 w-5 text-green-600" />;
}

function StatusBadge({ status }: { status: SensorCardDto["status"] }) {
  if (status === "ONLINE") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Online
      </span>
    );
  }

  if (status === "ATENCAO") {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Atenção
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
      Offline
    </span>
  );
}

export default function SensorCard({ sensor }: { sensor: SensorCardDto }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <SensorIcon type={sensor.type} />
          </div>

          <div>
            <h3 className="font-extrabold text-[var(--plant-graphite)]">
              {sensor.name}
            </h3>
            <p className="text-sm text-black/45">{sensor.code}</p>
          </div>
        </div>

        <StatusBadge status={sensor.status} />
      </div>

      {/* Infos */}
      <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-black/45">Tipo:</span>
        <span className="font-medium text-right">
          {sensor.type === "TEMPERATURA"
            ? "Temperatura"
            : sensor.type === "UMIDADE"
            ? "Umidade"
            : "Luminosidade"}
        </span>

        <span className="text-black/45">Localização:</span>
        <span className="font-medium text-right">
          {sensor.locationLabel}
        </span>

        {sensor.plantName && (
          <>
            <span className="text-black/45">Planta:</span>
            <Link
              href={`/plants/${sensor.plantId}`}
              className="text-right font-semibold text-[var(--plant-primary)] hover:underline"
            >
              {sensor.plantName}
            </Link>
          </>
        )}
      </div>

      {/* Valor central */}
      <div className="mt-5 rounded-xl bg-black/[0.02] py-4 text-center">
        <div className="text-3xl font-extrabold text-[var(--plant-graphite)]">
          {sensor.lastValue}
          {sensor.unit}
        </div>
        <div className="mt-1 text-xs text-black/45">
          {sensor.updatedAt}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
        <div className="flex items-center gap-4 text-sm text-black/60">
          <span className="flex items-center gap-1">
            <BatteryFull className="h-4 w-4" />
            87%
          </span>

          <span className="flex items-center gap-1">
            <Wifi className="h-4 w-4" />
            85%
          </span>
        </div>

        <Link
          href={`/sensors/${sensor.id}`}
          className="rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5"
        >
          Configurar
        </Link>
      </div>
    </div>
  );
}
