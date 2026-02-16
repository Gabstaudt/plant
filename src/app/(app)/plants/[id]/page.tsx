"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Droplets, ThermometerSun, Sun, FlaskConical } from "lucide-react";

import PlantDetailsHeader from "@/app/components/plants/details/PlantDetailsHeader";
import PlantDetailsTabs from "@/app/components/plants/details/PlantDetailsTabs";
import MetricCard from "@/app/components/plants/details/MetricCard";
import ObservationsCard from "@/app/components/plants/details/ObservationsCard";
import ReadingsTable from "@/app/components/plants/details/ReadingsTable";

import {
  deletePlant,
  formatLocation,
  formatSpecies,
  getPlant,
  type PlantStatusResponse,
} from "@/app/lib/plants.api";

type TabKey = "overview" | "history" | "sensors" | "alerts";

export default function PlantDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sp = useSearchParams();
  const id = params.id;

  const [plant, setPlant] = useState<PlantStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!id) return;
    (async () => {
      try {
        setError(null);
        const res = await getPlant(id);
        if (!active) return;
        setPlant(res ?? null);
      } catch (err: any) {
        if (active) setError(err?.message || "Falha ao carregar a planta.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    const ok = window.confirm("Tem certeza que deseja excluir esta planta?");
    if (!ok) return;
    setDeleting(true);
    try {
      await deletePlant(id);
      router.push("/plants");
    } catch (err: any) {
      setError(err?.message || "Falha ao excluir a planta.");
    } finally {
      setDeleting(false);
    }
  }

  const tab = (sp.get("tab") as TabKey) || "overview";

  const headerPlant = useMemo(() => {
    if (!plant) return null;
    return {
      id: String(plant.id),
      name: plant.plantName,
      species: formatSpecies(plant.species),
      locationLabel: formatLocation(plant.location),
      sensorsCount: plant.sensorsCount ?? 0,
      createdAt: undefined,
    };
  }, [plant]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-black/60">Carregando planta...</div>
    );
  }

  if (error || !plant || !headerPlant) {
    return (
      <div className="p-6 text-sm text-black/60">
        {error ?? "Planta não encontrada."}
      </div>
    );
  }

  const tempValue = plant.tempCurrent ?? null;
  const humidityValue = plant.umiCurrent ?? null;
  const lightValue = plant.lightCurrrent ?? null;
  const phValue = plant.phCurrent ?? null;

  return (
    <div className="p-4 md:p-6">
      <PlantDetailsHeader
        plant={headerPlant}
        backHref="/plants"
        onEditHref={`/plants/${plant.id}/edit`}
        onDelete={handleDelete}
        deleteDisabled={deleting}
      />

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        <PlantDetailsTabs baseHref={`/plants/${plant.id}`} />
      </div>

      {tab === "overview" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<ThermometerSun className="h-4 w-4 text-orange-600" />}
              label="Temperatura"
              value={valueOrDash(tempValue)}
              suffix="°C"
              ideal={formatRange(plant.tempMin, plant.tempMax, "°C")}
            />
            <MetricCard
              icon={<Droplets className="h-4 w-4 text-sky-600" />}
              label="Umidade"
              value={valueOrDash(humidityValue)}
              suffix="%"
              ideal={formatRange(plant.umiMin, plant.umiMax, "%")}
            />
            <MetricCard
              icon={<Sun className="h-4 w-4 text-amber-500" />}
              label="Luminosidade"
              value={valueOrDash(lightValue)}
              suffix="%"
              ideal={formatRange(plant.lightMin, plant.lightMax, "%")}
            />
            <MetricCard
              icon={<FlaskConical className="h-4 w-4 text-purple-600" />}
              label="pH"
              value={valueOrDash(phValue)}
              ideal={formatRange(plant.phMin, plant.phMax, "")}
            />
          </div>

          <ObservationsCard text={plant.notes ?? plant.notesConditions} />

          <ReadingsTable title="Últimas Leituras" rows={[]} />
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

          <ReadingsTable title="Tabela Completa" rows={[]} />
        </div>
      )}

      {tab === "sensors" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-black/45">
            Nenhum sensor vinculado a esta planta.
          </div>
          <button className="btn btn-primary rounded-xl px-5 py-3 w-fit">
            Vincular novo Sensor
          </button>
        </div>
      )}

      {tab === "alerts" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-black/45">
            Nenhum alerta registrado.
          </div>
        </div>
      )}
    </div>
  );
}

function valueOrDash(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value;
}

function formatRange(
  min: number | null | undefined,
  max: number | null | undefined,
  suffix: string
) {
  const hasMin = min !== null && min !== undefined;
  const hasMax = max !== null && max !== undefined;
  if (!hasMin && !hasMax) return undefined;
  if (hasMin && hasMax) return `${min}${suffix} - ${max}${suffix}`;
  if (hasMin) return `≥ ${min}${suffix}`;
  return `≤ ${max}${suffix}`;
}
