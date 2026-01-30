import { Settings, Pencil } from "lucide-react";
import type { SensorDetailsDto } from "@/app/components/mocks/sensors/sensors.mocks";

function Row({ label, sub, value }: { label: string; sub: string; value: string }) {
  return (
    <div className="py-5 flex items-start justify-between gap-6 border-t border-black/5 first:border-t-0">
      <div>
        <div className="font-extrabold text-[var(--plant-graphite)]">{label}</div>
        <div className="text-sm text-black/45">{sub}</div>
      </div>
      <div className="font-extrabold text-[var(--plant-graphite)]">{value}</div>
    </div>
  );
}

export default function SensorSettingsPanel({ sensor }: { sensor: SensorDetailsDto }) {
  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
          <Settings className="h-5 w-5 text-[var(--plant-primary)]" />
        </div>
        <div className="text-lg font-extrabold text-[var(--plant-graphite)]">
          Configurações do Sensor
        </div>
      </div>

      <div className="mt-4">
        <Row
          label="Intervalo de Leitura"
          sub="Frequência de coleta de dados"
          value={`${sensor.readIntervalSeconds} segundos`}
        />
        <Row
          label="Limite Mínimo"
          sub="Valor abaixo gera alerta"
          value={`${sensor.alertMin}${sensor.unit}`}
        />
        <Row
          label="Limite Máximo"
          sub="Valor acima gera alerta"
          value={`${sensor.alertMax}${sensor.unit}`}
        />
      </div>

      <div className="mt-5">
        <button className="btn btn-primary rounded-xl px-5 py-2 inline-flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Editar Configurações
        </button>
      </div>
    </div>
  );
}
