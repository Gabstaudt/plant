type Row = {
  time: string;
  temperature?: string;
  humidity?: string;
  light?: string;
  ph?: string;
};

export default function ReadingsTable({
  title,
  rows,
}: {
  title: string;
  rows: Row[];
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-sm font-semibold text-[var(--plant-graphite)]">
        {title}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black/35">
              <th className="py-3 pr-4 font-medium">Horário</th>
              <th className="py-3 pr-4 font-medium">Temperatura</th>
              <th className="py-3 pr-4 font-medium">Umidade</th>
              <th className="py-3 pr-4 font-medium">Luminosidade</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-black/5">
                <td className="py-3 pr-4">{r.time}</td>
                <td className="py-3 pr-4">{r.temperature ?? "—"}</td>
                <td className="py-3 pr-4">{r.humidity ?? "—"}</td>
                <td className="py-3 pr-4">{r.light ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
