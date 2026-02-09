import type { PlantStatus } from "@/app/components/mocks/plants/plants.mocks";

export default function PlantStatusBadge({ status }: { status: PlantStatus }) {
  if (status === "ONLINE") {
    return (
      <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100">
        Online
      </span>
    );
  }

  if (status === "ATTENTION") {
    return (
      <span className="badge bg-amber-50 text-amber-700 border border-amber-100">
        Atenção
      </span>
    );
  }

  return (
    <span className="badge bg-slate-100 text-slate-600 border border-slate-200">
      Offline
    </span>
  );
}
