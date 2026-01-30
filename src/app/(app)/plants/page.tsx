import PageHeader from "@/app/components/layout/PageHeader";
import PlantsToolbar from "@/app/components/plants/PlantsToolbar";
import PlantCard from "@/app/components/plants/PlantCard";
import { samplePlants } from "@/app/components/mocks/plants/plants.mocks";
import Link from "next/link";

export default function PlantsPage() {
  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Plantas"
        subtitle="Gerencie e monitore todas as plantas cadastradas"
        right={
          <button className="btn btn-primary rounded-full px-5 py-2">
            <span className="inline-flex -ml-1 mr-1 w-5 h-5 items-center justify-center">＋</span>
            Nova Planta
          </button>
        }
      />

      <PlantsToolbar />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {samplePlants.map((p) => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>
    </div>
  );
}
