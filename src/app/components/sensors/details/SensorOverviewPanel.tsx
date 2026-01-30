import Link from "next/link";
import { Link2, Cpu } from "lucide-react";
import type { SensorDetailsDto } from "@/app/components/mocks/sensors/sensors.mocks";

export default function SensorOverviewPanel({ sensor }: { sensor: SensorDetailsDto }) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {/* Planta Vinculada */}
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-[var(--plant-primary)]" />
          <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
            Planta Vinculada
          </h3>
        </div>

        <div className="mt-4">
          {sensor.linkedPlant ? (
            <>
              <Link
                href={`/plants/${sensor.linkedPlant.id}`}
                className="text-[var(--plant-primary)] font-extrabold text-lg hover:underline"
              >
                {sensor.linkedPlant.name}
              </Link>
              <p className="mt-1 text-sm text-black/45">{sensor.linkedPlant.locationLabel}</p>
            </>
          ) : (
            <p className="text-sm text-black/45">Nenhuma planta vinculada.</p>
          )}
        </div>
      </div>

      {/* Informações do Dispositivo */}
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-[var(--plant-primary)]" />
          <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
            Informações do Dispositivo
          </h3>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black/45">Firmware:</span>
            <span className="font-semibold text-[var(--plant-graphite)]">
              {sensor.deviceInfo.firmware}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/45">Última Calibração:</span>
            <span className="font-semibold text-[var(--plant-graphite)]">
              {sensor.deviceInfo.lastCalibrationAt}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/45">Tipo:</span>
            <span className="font-semibold text-[var(--plant-graphite)]">
              {sensor.deviceInfo.typeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Últimas Leituras (bloco grande) */}
      <div className="md:col-span-2 rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
          Últimas Leituras
        </h3>

        {/* placeholder do gráfico como no print */}
        <div className="mt-4 rounded-2xl bg-black/5 min-h-[220px] flex items-center justify-center text-sm text-black/35">
          Gráfico de leituras será exibido aqui
        </div>

        {/* tabela simplificada (você pode trocar pelos mocks reais depois) */}
        <div className="mt-6">
          <div className="grid grid-cols-2 text-sm font-semibold text-black/45 px-2">
            <span>Horário</span>
            <span className="text-right">Valor</span>
          </div>
          <div className="mt-2 divide-y divide-black/5">
            {/* aqui depois você puxa do sampleSensorReadings */}
            <div className="grid grid-cols-2 px-2 py-3 text-sm">
              <span className="text-[var(--plant-graphite)]">2024-01-20 10:00</span>
              <span className="text-right font-semibold text-[var(--plant-graphite)]">24.5°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
