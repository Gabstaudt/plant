"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import PageHeader from "@/app/components/layout/PageHeader";

type AlertStatus = "ATIVO" | "RESOLVIDO";
type AlertSeverity = "CRITICO" | "MEDIO" | "BAIXO";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  status: AlertStatus;
  severity: AlertSeverity;
  plantName: string;
  sensorCode: string;
  valueLabel: string;
  createdAt: string;
};

const alertsMock: AlertItem[] = [
  {
    id: "a-1",
    title: "Temperatura Crítica",
    description: "Temperatura muito alta detectada no sensor TH-001",
    status: "ATIVO",
    severity: "CRITICO",
    plantName: "Tomates A1",
    sensorCode: "TH-001",
    valueLabel: "35.2°C",
    createdAt: "16/02/2026, 16:56:36",
  },
  {
    id: "a-2",
    title: "Umidade Baixa",
    description: "Umidade abaixo do ideal no sensor UM-014",
    status: "ATIVO",
    severity: "MEDIO",
    plantName: "Rosas B2",
    sensorCode: "UM-014",
    valueLabel: "38%",
    createdAt: "16/02/2026, 15:12:10",
  },
  {
    id: "a-3",
    title: "Luminosidade Alta",
    description: "Luminosidade acima do limite no sensor LZ-003",
    status: "RESOLVIDO",
    severity: "BAIXO",
    plantName: "Alfaces C3",
    sensorCode: "LZ-003",
    valueLabel: "92%",
    createdAt: "15/02/2026, 10:22:04",
  },
  {
    id: "a-4",
    title: "pH Instável",
    description: "Oscilação de pH detectada no sensor PH-002",
    status: "ATIVO",
    severity: "MEDIO",
    plantName: "Vinca A2",
    sensorCode: "PH-002",
    valueLabel: "5.4 pH",
    createdAt: "14/02/2026, 09:47:21",
  },
];

function severityPill(sev: AlertSeverity) {
  if (sev === "CRITICO") {
    return {
      label: "Crítico",
      cls: "bg-red-50 text-red-600 border-red-200",
    };
  }
  if (sev === "MEDIO") {
    return {
      label: "Médio",
      cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
  }
  return {
    label: "Baixo",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

function statusPill(status: AlertStatus) {
  if (status === "ATIVO") {
    return {
      label: "Ativo",
      cls: "bg-red-50 text-red-600 border-red-200",
    };
  }
  return {
    label: "Resolvido",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

export default function AlertsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | AlertStatus>("");
  const [severity, setSeverity] = useState<"" | AlertSeverity>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alertsMock.filter((a) => {
      if (q) {
        const match =
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.plantName.toLowerCase().includes(q) ||
          a.sensorCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (status && a.status !== status) return false;
      if (severity && a.severity !== severity) return false;
      return true;
    });
  }, [query, status, severity]);

  const stats = useMemo(() => {
    const total = alertsMock.length;
    const critical = alertsMock.filter((a) => a.severity === "CRITICO").length;
    const active = alertsMock.filter((a) => a.status === "ATIVO").length;
    const resolved = alertsMock.filter((a) => a.status === "RESOLVIDO").length;
    return { total, critical, active, resolved };
  }, []);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Alertas"
        subtitle="Monitore e gerencie alertas de Sensores."
        right={
          <Link href="/alerts/new" className="btn btn-primary rounded-full px-5 py-2">
            <span className="inline-flex -ml-1 mr-2 h-5 w-5 items-center justify-center">
              <Plus className="h-4 w-4" />
            </span>
            Nova Regra
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-red-200/70 bg-red-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-red-600">CRÍTICOS</div>
              <div className="mt-1 text-2xl font-extrabold text-red-600">
                {stats.critical}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-700">RESOLVIDOS</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-700">
                {stats.resolved}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-700">ATIVOS</div>
              <div className="mt-1 text-2xl font-extrabold text-amber-700">
                {stats.active}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/15 bg-black/[0.02] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-black/50">CRÍTICOS</div>
              <div className="mt-1 text-2xl font-extrabold text-black/60">
                {stats.critical}
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center">
              <Filter className="h-5 w-5 text-black/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto] md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar alertas"
              className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | AlertStatus)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          >
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativos</option>
            <option value="RESOLVIDO">Resolvidos</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as "" | AlertSeverity)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          >
            <option value="">Todos os tipos</option>
            <option value="CRITICO">Crítico</option>
            <option value="MEDIO">Médio</option>
            <option value="BAIXO">Baixo</option>
          </select>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
            <SlidersHorizontal className="h-4 w-4 text-black/50" />
            Filtros Avançados
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((a) => {
          const sev = severityPill(a.severity);
          const stat = statusPill(a.status);
          return (
            <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 grid h-12 w-12 place-items-center rounded-2xl bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
                        {a.title}
                      </h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${sev.cls}`}>
                        {sev.label}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${stat.cls}`}>
                        {stat.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-black/55">{a.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
                    Resolver
                  </button>
                  <button className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
                    Ver Detalhes
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 rounded-xl border border-black/5 bg-[var(--plant-ice)]/40 px-4 py-3 text-sm md:grid-cols-4">
                <div>
                  <div className="text-black/45">Planta:</div>
                  <div className="font-semibold text-[var(--plant-graphite)]">{a.plantName}</div>
                </div>
                <div>
                  <div className="text-black/45">Sensor:</div>
                  <div className="font-semibold text-[var(--plant-graphite)]">{a.sensorCode}</div>
                </div>
                <div>
                  <div className="text-black/45">Valor:</div>
                  <div className="font-semibold text-[var(--plant-graphite)]">{a.valueLabel}</div>
                </div>
                <div>
                  <div className="text-black/45">Horário:</div>
                  <div className="font-semibold text-[var(--plant-graphite)]">{a.createdAt}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
