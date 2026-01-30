"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type TabKey = "overview" | "history" | "sensors" | "alerts";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "history", label: "Histórico" },
  { key: "sensors", label: "Sensores" },
  { key: "alerts", label: "Alertas" },
];

export default function PlantDetailsTabs({ baseHref }: { baseHref: string }) {
  const sp = useSearchParams();
  const active = (sp.get("tab") as TabKey) || "overview";

  return (
    <div className="inline-flex rounded-xl bg-black/5 p-1">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={`${baseHref}?tab=${t.key}`}
            className={[
              "px-4 py-2 text-sm rounded-lg transition-colors",
              isActive
                ? "bg-white text-[var(--plant-graphite)] shadow-sm"
                : "text-black/50 hover:text-black/70",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
