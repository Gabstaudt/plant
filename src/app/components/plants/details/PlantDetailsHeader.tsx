import Link from "next/link";
import { Calendar, MapPin, Cpu } from "lucide-react";
import type { PlantCardDto } from "@/app/components/mocks/plants/plants.mocks";

export default function PlantDetailsHeader({
  plant,
  backHref,
  onEditHref,
}: {
  plant: PlantCardDto & {
    createdAt?: string; // "15/01/2024"
  };
  backHref: string;
  onEditHref?: string; // se quiser no futuro
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Link
          href={backHref}
          className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
          aria-label="Voltar"
          title="Voltar"
        >
          ←
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)] leading-tight">
            {plant.name}
          </h1>
          <p className="text-sm text-black/45 italic">{plant.species}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{plant.locationLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>{plant.sensorsCount} Sensores vinculados</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Cadastrada em{" "}
                {plant.createdAt ? plant.createdAt : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary rounded-full px-6 py-2">
        Editar
      </button>
    </div>
  );
}
