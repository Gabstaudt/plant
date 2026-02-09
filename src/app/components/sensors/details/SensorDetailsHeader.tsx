import Link from "next/link";
import {
  MapPin,
  Battery,
  Wifi,
  Calendar,
  Pencil,
  Thermometer,
} from "lucide-react";
import type { SensorDetailsDto } from "@/app/components/mocks/sensors/sensors.mocks";

function statusBadge(status: SensorDetailsDto["status"]) {
  if (status === "ONLINE") return "bg-green-100 text-green-700";
  if (status === "ATENCAO") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700";
}
function statusLabel(status: SensorDetailsDto["status"]) {
  if (status === "ONLINE") return "Online";
  if (status === "ATENCAO") return "Atenção";
  return "Offline";
}

export default function SensorDetailsHeader({
  sensor,
  backHref,
}: {
  sensor: SensorDetailsDto;
  backHref: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Link
          href={backHref}
          className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
          aria-label="Voltar"
          title="Voltar"
        >
          ←
        </Link>

        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[var(--plant-primary)]/10 grid place-items-center">
            <Thermometer className="h-7 w-7 text-[var(--plant-primary)]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)] leading-tight">
                {sensor.name}
              </h1>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(sensor.status)}`}>
                {statusLabel(sensor.status)}
              </span>
            </div>

            <p className="text-sm text-black/45">{sensor.code}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/55">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-black/40" />
                <span>{sensor.locationLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-black/40" />
                <span>{sensor.batteryPct}% bateria</span>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-black/40" />
                <span>{sensor.signalPct}% sinal</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-black/40" />
                <span>Instalado em {sensor.installedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/sensors/${sensor.id}/edit`}
        className="btn btn-primary rounded-full px-6 py-2"
      >
        Editar
      </Link>
    </div>
  );
}
