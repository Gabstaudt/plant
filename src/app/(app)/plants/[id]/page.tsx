import { Droplets, ThermometerSun, Sun, FlaskConical } from "lucide-react";

import PlantDetailsHeader from "@/app/components/plants/details/PlantDetailsHeader";
import PlantDetailsTabs from "@/app/components/plants/details/PlantDetailsTabs";

import MetricCard from "@/app/components/plants/details/MetricCard";
import ObservationsCard from "@/app/components/plants/details/ObservationsCard";
import ReadingsTable from "@/app/components/plants/details/ReadingsTable";
import SensorCard from "@/app/components/plants/details/SensorCard";
import AlertCard from "@/app/components/plants/details/AlertCard";

import { samplePlants } from "@/app/components/mocks/plants/plants.mocks";
import {
  mockOverview,
  mockReadings,
  mockSensors,
  mockAlerts,
} from "@/app/components/mocks/plants/plant-details.mocks";


type Props = { params: { id: string }; searchParams?: { tab?: string } };

export default function PlantDetailsPage({ params, searchParams }: Props) {
  const plantBase = samplePlants.find((p) => p.id === params.id);

  if (!plantBase) {
    return <div className="p-6 text-sm text-black/60">Planta não encontrada.</div>;
  }

  const plant = { ...plantBase, createdAt: "15/01/2024" };
  const tab = (searchParams?.tab ?? "overview") as
    | "overview"
    | "history"
    | "sensors"
    | "alerts";

  return (
    <div className="p-4 md:p-6">
      <PlantDetailsHeader plant={plant} backHref="/plants" onEditHref="#" />

      <div className="mt-6">
        <PlantDetailsTabs baseHref={`/plants/${plant.id}`} />
      </div>

      {/* Conteúdo por aba */}
      {tab === "overview" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<ThermometerSun className="h-4 w-4 text-orange-600" />}
              label="Temperatura"
              value={mockOverview.metrics.temperature.value}
              suffix={mockOverview.metrics.temperature.suffix}
              ideal={mockOverview.metrics.temperature.ideal}
            />
            <MetricCard
              icon={<Droplets className="h-4 w-4 text-sky-600" />}
              label="Umidade"
              value={mockOverview.metrics.humidity.value}
              suffix={mockOverview.metrics.humidity.suffix}
              ideal={mockOverview.metrics.humidity.ideal}
            />
            <MetricCard
              icon={<Sun className="h-4 w-4 text-amber-500" />}
              label="Luminosidade"
              value={mockOverview.metrics.light.value}
              suffix={mockOverview.metrics.light.suffix}
              ideal={mockOverview.metrics.light.ideal}
            />
            <MetricCard
              icon={<FlaskConical className="h-4 w-4 text-purple-600" />}
              label="pH"
              value={mockOverview.metrics.ph.value}
              ideal={mockOverview.metrics.ph.ideal}
            />
          </div>

          <ObservationsCard text={mockOverview.observations} />

          <ReadingsTable title="Últimas Leituras" rows={mockReadings} />
        </div>
      )}

      {tab === "history" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-base font-bold text-[var(--plant-graphite)]">
              Histórico de Medições
            </p>
            <p className="mt-1 text-sm text-black/45">
              Visualize o histórico completo de leituras dos sensores vinculados a essa planta
            </p>

            <div className="mt-10 h-[220px] grid place-items-center text-sm text-black/30">
              gráficos aqui
            </div>
          </div>

          <ReadingsTable title="Tabela Completa" rows={mockReadings} />
        </div>
      )}

      {tab === "sensors" && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockSensors.map((s, idx) => (
              <SensorCard
                key={idx}
                name={s.name}
                code={s.code}
                value={s.value}
                statusLabel={s.status}
              />
            ))}
          </div>

          <button className="btn btn-primary rounded-xl px-5 py-3 w-fit">
            Vincular novo Sensor
          </button>
        </div>
      )}

      {tab === "alerts" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {mockAlerts.map((a, idx) => (
            <AlertCard
              key={idx}
              title={a.title}
              subtitle={a.subtitle}
              plantName={a.plantName}
              sensorCode={a.sensorCode}
              value={a.value}
              time={a.time}
            />
          ))}
        </div>
      )}
    </div>
  );
}
