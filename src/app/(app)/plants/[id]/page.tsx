import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import { samplePlants } from "@/app/components/mocks/plants/plants.mocks";

type Props = {
  params: { id: string };
};

export default function PlantDetailsPage({ params }: Props) {
  const plant = samplePlants.find((p) => p.id === params.id);

  if (!plant) {
    return (
      <div className="p-6">
        <p className="text-sm text-black/60">Planta não encontrada.</p>
        <Link className="underline text-sm" href="/plants">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <Link
          href="/plants"
          className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
          aria-label="Voltar"
          title="Voltar"
        >
          ←
        </Link>

        <div className="flex-1">
          <PageHeader
            title={plant.name}
            subtitle={plant.species}
            right={
              <button className="btn btn-primary rounded-full px-5 py-2">
                Editar
              </button>
            }
          />
        </div>
      </div>

      {/* Aqui você vai colocar os tabs + cards de métricas + tabela etc (igual suas imagens) */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm text-black/60">
          Detalhes da planta: <b>{plant.name}</b> (id: {plant.id})
        </p>
        <p className="mt-2 text-sm text-black/60">
          Local: {plant.locationLabel} • Sensores: {plant.sensorsCount}
        </p>
      </div>
    </div>
  );
}
