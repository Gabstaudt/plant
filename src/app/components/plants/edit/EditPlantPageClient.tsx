"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import NewPlantForm from "@/app/components/plants/new/NewPlantForm";
import { getPlant, type PlantStatusResponse } from "@/app/lib/plants.api";

export default function EditPlantPageClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const [plant, setPlant] = useState<PlantStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
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

  const defaults = useMemo(() => {
    if (!plant) return undefined;
    return {
      name: plant.plantName,
      species: plant.species,
      location: plant.location,
      notes: plant.notes ?? "",
      idealTempMin: plant.tempMin != null ? String(plant.tempMin) : "",
      idealTempMax: plant.tempMax != null ? String(plant.tempMax) : "",
      idealHumidityMin: plant.umiMin != null ? String(plant.umiMin) : "",
      idealHumidityMax: plant.umiMax != null ? String(plant.umiMax) : "",
      idealLightMin: plant.lightMin != null ? String(plant.lightMin) : "",
      idealLightMax: plant.lightMax != null ? String(plant.lightMax) : "",
      idealPhMin: plant.phMin != null ? String(plant.phMin) : "",
      idealPhMax: plant.phMax != null ? String(plant.phMax) : "",
      idealNotes: plant.notesConditions ?? "",
    };
  }, [plant]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          Carregando...
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          {error ?? "Planta não encontrada."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <NewPlantForm
        mode="edit"
        plantId={plant.id}
        defaultValues={defaults}
        onSubmitSuccess={() => router.push(`/plants/${plant.id}`)}
      />
    </div>
  );
}
