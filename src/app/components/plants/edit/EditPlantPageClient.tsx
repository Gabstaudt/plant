"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import NewPlantForm from "@/app/components/plants/new/NewPlantForm";
import { samplePlants } from "@/app/components/mocks/plants/plants.mocks";

export default function EditPlantPageClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params.id;

  const plant = useMemo(() => samplePlants.find((p) => p.id === id), [id]);

  if (!plant) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          Planta não encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <NewPlantForm
        mode="edit"
        defaultValues={{
          name: plant.name,
          species: plant.species,
          location: plant.locationLabel,
          notes: "",
        }}
        onSubmitSuccess={() => router.push(`/plants/${plant.id}`)}
      />
    </div>
  );
}
