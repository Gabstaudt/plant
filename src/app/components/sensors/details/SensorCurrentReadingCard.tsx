import type { SensorDetailsDto } from "@/app/components/mocks/sensors/sensors.mocks";

export default function SensorCurrentReadingCard({ sensor }: { sensor: SensorDetailsDto }) {
  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm text-black/45">Leitura Atual</div>
          <div className="mt-2 text-5xl font-extrabold text-[var(--plant-graphite)] leading-none">
            {sensor.currentValue}
            <span className="text-3xl font-extrabold ml-1">{sensor.unit}</span>
          </div>
          <div className="mt-2 text-sm text-black/45">
            Última atualização: {sensor.lastUpdatedAt}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-black/45">Limites de Alerta</div>
          <div className="mt-2 text-xl font-extrabold text-[var(--plant-graphite)]">
            {sensor.alertMin}{sensor.unit} - {sensor.alertMax}{sensor.unit}
          </div>
          <div className="mt-2 text-sm text-black/45">
            Intervalo de leitura: {sensor.readIntervalSeconds}s
          </div>
        </div>
      </div>
    </div>
  );
}
