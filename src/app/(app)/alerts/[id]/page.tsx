"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Thermometer,
  MapPin,
  Cpu,
  Calendar,
  MessageSquare,
  User,
} from "lucide-react";

type ReadingRow = {
  at: string;
  value: string;
  status: "ACIMA" | "NORMAL";
};

type EventRow = {
  id: string;
  by: string;
  at: string;
  text: string;
};

const alertMock = {
  id: "ALT-001",
  title: "Temperatura Crítica",
  status: "ATIVO" as const,
  severity: "CRITICO" as const,
  description:
    "Temperatura muito alta detectada no sensor TH-001. O valor ultrapassou o limite máximo configurado.",
  plantName: "Tomatoes A1",
  plantLocation: "Estufa A - Setor 1",
  sensorName: "Sensor Temperatura A1",
  sensorCode: "TH-001",
  ruleName: "Temperatura Alta",
  ruleDetail: "Valor > 28°C por 5 minutos",
  firedAt: "20/01/2024, 11:30:00",
  currentValue: "35.2°C",
  limitLabel: "Limite: > 28°C",
};

const readingsMock: ReadingRow[] = [
  { at: "2024-01-20 14:30", value: "35.2°C", status: "ACIMA" },
  { at: "2024-01-20 14:25", value: "33.8°C", status: "ACIMA" },
  { at: "2024-01-20 14:20", value: "31.5°C", status: "ACIMA" },
  { at: "2024-01-20 14:15", value: "29.2°C", status: "ACIMA" },
  { at: "2024-01-20 14:10", value: "28.5°C", status: "ACIMA" },
];

const eventsMock: EventRow[] = [
  {
    id: "e1",
    by: "Sistema",
    at: "20/01/2024, 11:30:00",
    text: "Alerta gerado automaticamente",
  },
  {
    id: "e2",
    by: "Sistema",
    at: "20/01/2024, 11:30:05",
    text: "Notificação enviada por e-mail para admin@empresa.com",
  },
];

function statusPill(status: "ATIVO" | "RESOLVIDO") {
  if (status === "ATIVO") {
    return "bg-red-50 text-red-600 border-red-200";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function severityPill(sev: "CRITICO" | "MEDIO" | "BAIXO") {
  if (sev === "CRITICO") return "bg-red-50 text-red-600 border-red-200";
  if (sev === "MEDIO") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function AlertDetailsPage() {
  const [comment, setComment] = useState("");

  const stats = useMemo(
    () => ({
      statusLabel: alertMock.status === "ATIVO" ? "Ativo" : "Resolvido",
      severityLabel:
        alertMock.severity === "CRITICO"
          ? "Crítico"
          : alertMock.severity === "MEDIO"
          ? "Médio"
          : "Baixo",
    }),
    []
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <Link
          href="/alerts"
          className="mt-2 rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
          aria-label="Voltar"
          title="Voltar"
        >
          ←
        </Link>

        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-red-50 grid place-items-center">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)] leading-tight">
                {alertMock.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${severityPill(
                  alertMock.severity
                )}`}
              >
                {stats.severityLabel}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${statusPill(
                  alertMock.status
                )}`}
              >
                {stats.statusLabel}
              </span>
            </div>
            <div className="mt-1 text-sm text-black/45">{alertMock.id}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
              Descrição
            </h3>
            <p className="mt-3 text-sm text-black/55">{alertMock.description}</p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
              Valor Atual
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-red-50 grid place-items-center">
                <Thermometer className="h-9 w-9 text-red-500" />
              </div>
              <div>
                <div className="text-4xl font-extrabold text-red-500">
                  {alertMock.currentValue}
                </div>
                <div className="mt-2 text-sm text-black/55">
                  {alertMock.limitLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
              Histórico de Leituras
            </h3>
            <div className="mt-4">
              <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr] px-2 text-sm font-semibold text-black/45">
                <span>Horário</span>
                <span className="text-center">Valor</span>
                <span className="text-right">Status</span>
              </div>
              <div className="mt-2 divide-y divide-black/5">
                {readingsMock.map((r) => (
                  <div
                    key={`${r.at}-${r.value}`}
                    className="grid grid-cols-[1.2fr_0.8fr_0.6fr] items-center px-2 py-3 text-sm"
                  >
                    <span className="text-[var(--plant-graphite)]">{r.at}</span>
                    <span className="text-center font-semibold text-[var(--plant-graphite)]">
                      {r.value}
                    </span>
                    <div className="flex justify-end">
                      <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-red-50 text-red-600 border-red-200">
                        {r.status === "ACIMA" ? "Acima" : "Normal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
              Histórico de Eventos
            </h3>
            <div className="mt-4 space-y-4">
              {eventsMock.map((e) => (
                <div key={e.id} className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-black/5 grid place-items-center">
                    <User className="h-5 w-5 text-black/45" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                      {e.by} <span className="text-black/35 font-normal"> {e.at}</span>
                    </div>
                    <div className="text-sm text-black/55">{e.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
              Informações
            </h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <div className="text-black/45">Planta</div>
                <div className="font-semibold text-[var(--plant-primary)]">
                  {alertMock.plantName}
                </div>
                <div className="mt-2 flex items-center gap-2 text-black/60">
                  <MapPin className="h-4 w-4 text-black/35" />
                  <span>{alertMock.plantLocation}</span>
                </div>
              </div>

              <div className="border-t border-black/5 pt-4">
                <div className="text-black/45">Sensor</div>
                <div className="mt-1 flex items-center gap-2 text-[var(--plant-graphite)]">
                  <Cpu className="h-4 w-4 text-[var(--plant-primary)]" />
                  <span className="font-semibold">{alertMock.sensorName}</span>
                </div>
                <div className="text-xs text-black/45">{alertMock.sensorCode}</div>
              </div>

              <div className="border-t border-black/5 pt-4">
                <div className="text-black/45">Regra de Alerta</div>
                <div className="font-semibold text-[var(--plant-graphite)]">
                  {alertMock.ruleName}
                </div>
                <div className="text-xs text-black/45">{alertMock.ruleDetail}</div>
              </div>

              <div className="border-t border-black/5 pt-4">
                <div className="text-black/45">Disparado em</div>
                <div className="mt-2 flex items-center gap-2 text-[var(--plant-graphite)]">
                  <Calendar className="h-4 w-4 text-black/35" />
                  <span className="font-semibold">{alertMock.firedAt}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[var(--plant-graphite)]" />
              <h3 className="text-lg font-extrabold text-[var(--plant-graphite)]">
                Resolver Alerta
              </h3>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
                Comentário *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Descreva como o problema foi resolvido..."
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none min-h-[120px]
                           focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--plant-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95">
                <CheckCircle2 className="h-4 w-4" />
                Marcar como Resolvido
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
                <Clock className="h-4 w-4 text-black/50" />
                Adiar por 1 hora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
