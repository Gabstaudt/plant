"use client";

type Tab = "overview" | "readings" | "alerts" | "settings";

export default function SensorDetailsTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  const items: Array<{ key: Tab; label: string }> = [
    { key: "overview", label: "Visão Geral" },
    { key: "readings", label: "Leituras" },
    { key: "alerts", label: "Alertas" },
    { key: "settings", label: "Configurações" },
  ];

  return (
    <div className="mt-6 inline-flex rounded-2xl bg-[var(--plant-ice)] border border-black/5 p-1">
      {items.map((i) => {
        const active = tab === i.key;
        return (
          <button
            key={i.key}
            type="button"
            onClick={() => onChange(i.key)}
            aria-current={active ? "page" : undefined}
            className={[
              "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
              active
                ? "bg-white text-[var(--plant-graphite)]"
                : "text-black/45 hover:text-[var(--plant-graphite)]",
            ].join(" ")}
          >
            {i.label}
          </button>
        );
      })}
    </div>
  );
}
