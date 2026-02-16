import { Droplets, ThermometerSun, Sun, MapPin, Activity, Cpu } from "lucide-react";
import type { ReactNode } from "react";
import type { PlantCardView } from "@/app/lib/plants.api";
import PlantStatusBadge from "@/app/components/plants/PlantStatusBadge";
import Link from "next/link";

export default function PlantCard({ plant }: { plant: PlantCardView }) {
  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/12 grid place-items-center">
            <Activity className="h-5 w-5 text-[var(--plant-primary)]" />
          </div>
          <div>
            <p className="font-bold text-[var(--plant-graphite)] leading-tight">
              {plant.name}
            </p>
            <p className="text-xs text-black/45 italic">{plant.species}</p>
          </div>
        </div>

        <PlantStatusBadge status={plant.status} />
      </div>

      <div className="mt-3 h-px bg-black/5" />

      <div className="mt-3 flex items-center justify-between text-sm text-black/55">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{plant.locationLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-black/55">
          <Cpu className="h-4 w-4 text-black/40" />
          <span>{plant.sensorsCount} Sensores</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Metric
          icon={<Droplets className="h-4 w-4 text-sky-600" />}
          label="Umidade"
          value={formatMetric(plant.metrics.humidity, "%")}
        />
        <Metric
          icon={<ThermometerSun className="h-4 w-4 text-orange-600" />}
          label="Temp."
          value={formatMetric(plant.metrics.temp, "°C")}
        />
        <Metric
          icon={<Sun className="h-4 w-4 text-amber-500" />}
          label="Luz"
          value={formatMetric(plant.metrics.light, "%")}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-black/45">
          Última leitura: {plant.lastReading ?? "—"}
        </p>
        <Link
          href={`/plants/${plant.id}`}
          className="rounded-xl px-5 py-2 text-sm font-semibold
                    border border-black/25 bg-white text-[var(--plant-graphite)]
                    shadow-none transition-colors
                    hover:bg-black/5
                    focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-[var(--plant-ice)]/40 px-3 py-2">
      <div className="flex items-center gap-2 text-black/55">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <div className="mt-1 font-bold text-[var(--plant-graphite)]">{value}</div>
    </div>
  );
}

function formatMetric(value: number | null, suffix: string) {
  if (value === null || value === undefined) return "—";
  return `${value}${suffix}`;
}
