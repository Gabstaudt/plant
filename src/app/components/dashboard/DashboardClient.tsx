"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Droplet, Thermometer, Sun, Sprout, MapPin, Cpu, LineChart } from "lucide-react";
import { useRole, type Role } from "@/app/lib/auth.client";
import { api } from "@/app/lib/http";
import { sampleRecentPlants, sampleLatestReadings } from "@/app/components/mocks/dashboard/dashboard.mocks";

type Summary = {
  counts: {
    plants: number;
    sensorsOnline: number;
    sensorsTotal: number;
    alerts: number;
    successRate: number;
  };
  trend: {
    plantsMonth: number;
    sensorsWeek: number;
    successVsMonth: number;
  };
};

const EMPTY_SUMMARY: Summary = {
  counts: {
    plants: 0,
    sensorsOnline: 0,
    sensorsTotal: 0,
    alerts: 0,
    successRate: 0,
  },
  trend: {
    plantsMonth: 0,
    sensorsWeek: 0,
    successVsMonth: 0,
  },
};

function isAdminRole(role: Role) {
  return role === "ADMIN" || role === "ADMIN_MASTER";
}

export default function DashboardClient() {
  const role = useRole(); // lê do localStorage (ADMIN_MASTER | ADMIN | USER)
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErrorMsg(null);
        const res = await api<Summary>(`/dashboard/summary?role=${role}`);
        if (mounted) setData(res ?? null);
      } catch (e) {
        if (mounted) {
          setData(null);
          setErrorMsg("Falha ao carregar o dashboard.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [role]);


  const safeData: Summary = data ?? EMPTY_SUMMARY;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-2xl bg-[#1E5A32] text-white p-6 md:p-9 min-h-[180px]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(0,0,0,.05), rgba(0,0,0,.25)), url('/Fundo-dash.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Monitoramento Inteligente de Plantas
        </h1>
        <div className="mt-4">
          <Link
            href="/plants?new=1"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)] shadow-sm"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center">＋</span>
            {isAdminRole(role) ? "Nova Planta" : "Adicionar Planta"}
          </Link>
        </div>
      </section>

      {/* MENSAGEM DE ERRO  */}
      {errorMsg && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(loading ? skeletonCards() : buildCards(safeData, role)).map((c) => (
          <div
            key={c.key}
            className="rounded-2xl border border-black/5 bg-[#ECF7EF] px-5 py-4"
          >
            <p className="text-[11px] font-semibold uppercase text-black/45">{c.title}</p>
            <div className="mt-2 text-2xl font-extrabold text-[var(--plant-graphite)]">
              {c.value}
            </div>
          </div>
        ))}
      </section>

      {/* LISTAS */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--plant-graphite)]">Plantas Recentes</h2>
            <Link
              href="/plants"
              className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[var(--plant-graphite)] hover:bg-black/5"
            >
              Ver todas
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {loading
              ? skeletonLines()
              : sampleRecentPlants(role).map((p) => (
                  <div key={p.id} className="rounded-2xl border border-black/5 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/15 grid place-items-center">
                          <Sprout className="h-5 w-5 text-[var(--plant-primary)]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                            {p.name}
                          </div>
                          <div className="text-xs text-black/45">{p.species}</div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-black/45">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-black/40" />
                              Estufa A - Setor 1
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Cpu className="h-3.5 w-3.5 text-black/40" />
                              4 Sensores
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Online
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-black/55">
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-[#1D72F2]" />
                        Umidade
                        <span className="ml-1 font-semibold text-black/70">65%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-[#F97316]" />
                        Temp.
                        <span className="ml-1 font-semibold text-black/70">24°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-[#FACC15]" />
                        Luz
                        <span className="ml-1 font-semibold text-black/70">78%</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-black/40">
                      <span>Última leitura: {p.createdAt}</span>
                      <button className="rounded-full border border-black/10 px-3 py-1 font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--plant-graphite)]">Últimas Leituras</h2>
          </div>
          <div className="mt-3 space-y-3">
            {loading
              ? skeletonLines()
              : sampleLatestReadings(role).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 grid place-items-center">
                          <LineChart className="h-4.5 w-4.5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                            {r.sensor}
                          </div>
                          <div className="text-xs text-black/45">{r.plant}</div>
                          <div className="text-xs text-black/45">{r.sensor === "PH-004" ? "pH" : r.unit === "%" ? "Umidade" : "Temperatura"}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[var(--plant-graphite)]">
                          {r.value} {r.unit}
                        </div>
                        <span
                          className={[
                            "mt-1 inline-flex rounded-full px-3 py-0.5 text-[10px] font-semibold",
                            r.ok
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200",
                          ].join(" ")}
                        >
                          {r.ok ? "Normal" : "Baixo"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- helpers de UI ---------- */
function skeletonCards() {
  return [1, 2, 3, 4].map((i) => ({
    key: `s-${i}`,
    title: "—",
    value: <span className="inline-block h-6 w-12 bg-black/10 rounded-md animate-pulse" />,
    badge: "—",
    delta: 0,
  }));
}
function skeletonLines() {
  return Array.from({ length: 4 }, (_, i) => (
    <div key={i} className="h-16 rounded-md bg-black/5 animate-pulse" />
  ));
}

/* ---------- conteúdo por papel ---------- */
function buildCards(data: Summary, role: Role) {
  const base = [
    {
      key: "plants",
      title: "Plantas cadastradas",
      value: data.counts.plants,
      badge: `+${data.trend.plantsMonth}% mês`,
      delta: data.trend.plantsMonth,
    },
    {
      key: "sensors",
      title: "Sensores online",
      value: `${data.counts.sensorsOnline} de ${data.counts.sensorsTotal}`,
      badge: `${data.trend.sensorsWeek}% semana`,
      delta: data.trend.sensorsWeek,
    },
    {
      key: "alerts",
      title: "Alertas ativos",
      value: data.counts.alerts,
      badge: "tempo real",
      delta: -3,
    },
    {
      key: "success",
      title: "Taxa de sucesso",
      value: `${Number(data.counts.successRate).toFixed(1)}%`,
      badge: `${data.trend.successVsMonth}% vs mês`,
      delta: data.trend.successVsMonth,
    },
  ];

  if (isAdminRole(role)) {
    return base;
  }
  return base.map((c) =>
    c.key === "plants"
      ? { ...c, value: Math.max(1, Math.floor(Number(c.value) * 0.2)) }
      : c.key === "sensors"
      ? { ...c, value: "5 de 6" }
      : c
  );
}
