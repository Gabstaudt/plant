"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        className="relative overflow-hidden rounded-2xl bg-[var(--plant-primary)] text-white p-6 md:p-8"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(0,0,0,.0), rgba(0,0,0,.15)), url('/login/side.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl md:text-3xl font-black">Monitoramento Inteligente de Plantas</h1>
        <p className="mt-1 text-white/90">
          Acompanhe a saúde das suas plantas em tempo real com sensores IoT avançados.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link
            href="/plants?new=1"
            className="btn btn-outline bg-white text-[var(--plant-dark)] font-semibold rounded-full px-5 py-2"
          >
            <span className="inline-flex -ml-1 mr-1 w-5 h-5 items-center justify-center">＋</span>
            {isAdminRole(role) ? "Nova Planta" : "Adicionar Planta"}
          </Link>

          <input
            placeholder="Pesquisar plantas ou sensores..."
            className="w-full sm:w-72 rounded-full bg-white/95 px-4 py-2 text-[var(--plant-graphite)] placeholder:text-black/50 outline-none focus:ring-2 focus:ring-white/50"
          />
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
          <div key={c.key} className="rounded-2xl bg-white border border-black/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-[var(--plant-graphite)]/60 uppercase">
                {c.title}
              </p>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ background: "color-mix(in srgb, var(--plant-primary) 15%, white)" }}
              >
                {c.badge}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div className="text-3xl font-black text-[var(--plant-graphite)]">{c.value}</div>
              <div
                className={`text-sm font-semibold ${
                  c.delta >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {c.delta >= 0 ? "▲" : "▼"} {Math.abs(c.delta)}%
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* LISTAS */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white border border-black/5 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--plant-graphite)]">Plantas Recentes</h2>
            <Link href="/plants" className="text-sm font-semibold text-[var(--plant-primary)] hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {loading
              ? skeletonLines()
              : sampleRecentPlants(role).map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-[var(--plant-primary)]/15" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-black/60">{p.species}</p>
                      </div>
                    </div>
                    <span className="text-xs text-black/60">{p.createdAt}</span>
                  </li>
                ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white border border-black/5 p-4">
          <h2 className="text-lg font-bold text-[var(--plant-graphite)]">Últimas Leituras</h2>
          <ul className="mt-3 space-y-3">
            {loading
              ? skeletonLines()
              : sampleLatestReadings(role).map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: r.ok ? "var(--plant-primary)" : "#e11d48" }}
                      />
                      <div>
                        <p className="font-medium">
                          {r.plant} — {r.sensor}
                        </p>
                        <p className="text-xs text-black/60">{r.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {r.value} {r.unit}
                    </span>
                  </li>
                ))}
          </ul>
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
    value: <span className="inline-block h-7 w-16 bg-black/10 rounded-md animate-pulse" />,
    badge: "—",
    delta: 0,
  }));
}
function skeletonLines() {
  return Array.from({ length: 4 }, (_, i) => (
    <li key={i} className="h-10 rounded-md bg-black/5 animate-pulse" />
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
