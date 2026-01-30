export default function ObservationsCard({ text }: { text?: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-sm font-semibold text-[var(--plant-graphite)]">
        Observações
      </p>
      <p className="mt-3 text-sm text-black/45">
        {text ?? "Sem observações registradas."}
      </p>
    </div>
  );
}
