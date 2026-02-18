"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import FormSection from "@/app/components/plants/new/FormSection";
import TextField from "@/app/components/plants/new/fields/TextField";
import SelectField from "@/app/components/plants/new/fields/SelectField";
import ComboField from "@/app/components/plants/new/fields/ComboField";
import { createAlertRule, type AlertCondition, type AlertSeverity } from "@/app/lib/alerts.api";
import { listSensors, type SensorStatusResponse } from "@/app/lib/sensors.api";

type FormState = {
  name: string;
  measurementType: string;
  unit: string;
  condition: "" | AlertCondition;
  threshold: string;
  severity: "" | AlertSeverity;
  enabled: boolean;
  sensorIds: number[];
};

const initial: FormState = {
  name: "",
  measurementType: "",
  unit: "",
  condition: "",
  threshold: "",
  severity: "",
  enabled: true,
  sensorIds: [],
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
        checked ? "bg-[var(--plant-primary)]" : "bg-black/10",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

export default function NewAlertRulePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sensors, setSensors] = useState<SensorStatusResponse[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listSensors();
        if (!active) return;
        setSensors(res?.data ?? []);
      } catch {
        if (active) setSensors([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const typeOptions = useMemo(() => {
    const unique = new Map<string, string>();
    sensors.forEach((s) => {
      if (s.type) unique.set(s.type, s.type);
    });
    return Array.from(unique.values()).map((t) => ({ value: t, label: t }));
  }, [sensors]);

  const unitOptions = useMemo(() => {
    const unique = new Map<string, string>();
    sensors.forEach((s) => {
      if (s.unit) unique.set(s.unit, s.unit);
    });
    return Array.from(unique.values()).map((u) => ({ value: u, label: u }));
  }, [sensors]);

  const conditionOptions = useMemo(
    () => [
      { value: "ABOVE_IDEAL", label: "Acima do ideal" },
      { value: "BELOW_IDEAL", label: "Abaixo do ideal" },
      { value: "GREATER_THAN", label: "Maior que" },
      { value: "LESS_THAN", label: "Menor que" },
      { value: "EQUALS", label: "Igual a" },
    ],
    []
  );

  const severityOptions = useMemo(
    () => [
      { value: "CRITICO", label: "Crítico" },
      { value: "MEDIO", label: "Médio" },
      { value: "BAIXO", label: "Baixo" },
    ],
    []
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  const thresholdRequired =
    form.condition === "GREATER_THAN" ||
    form.condition === "LESS_THAN" ||
    form.condition === "EQUALS";

  const errors = {
    name: !form.name.trim() ? "Informe o nome do alerta." : "",
    measurementType: !form.measurementType.trim()
      ? "Informe a medição relacionada."
      : "",
    condition: !form.condition ? "Selecione a condição." : "",
    severity: !form.severity ? "Selecione a severidade." : "",
    threshold:
      thresholdRequired && !form.threshold.trim()
        ? "Informe o valor de referência."
        : "",
  };

  const canSubmit =
    !errors.name &&
    !errors.measurementType &&
    !errors.condition &&
    !errors.severity &&
    !errors.threshold &&
    !submitting;

  function toggleSensor(id: number) {
    setForm((p) => {
      const exists = p.sensorIds.includes(id);
      return {
        ...p,
        sensorIds: exists
          ? p.sensorIds.filter((x) => x !== id)
          : [...p.sensorIds, id],
      };
    });
  }

  function toNumberOrUndefined(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    markTouched("name");
    markTouched("measurementType");
    markTouched("condition");
    markTouched("severity");
    markTouched("threshold");
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await createAlertRule({
        name: form.name.trim(),
        measurementType: form.measurementType.trim(),
        unit: form.unit.trim() ? form.unit.trim() : undefined,
        condition: form.condition as AlertCondition,
        threshold: toNumberOrUndefined(form.threshold),
        severity: form.severity as AlertSeverity,
        enabled: form.enabled,
        sensorIds: form.sensorIds,
      });
      router.push("/alerts");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/alerts"
              className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
              aria-label="Voltar"
              title="Voltar"
            >
              ←
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)]">
                Nova Regra
              </h1>
              <p className="mt-1 text-sm text-black/55">
                Crie uma regra de alerta para sensores.
              </p>
            </div>
          </div>
        </div>

        <FormSection
          title="Informações da Regra"
          icon={<AlertTriangle className="h-5 w-5 text-[var(--plant-primary)]" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Nome do Alerta*"
              placeholder="Ex: Alerta de Temperatura Alta"
              value={form.name}
              onChange={(v) => update("name", v)}
              onBlur={() => markTouched("name")}
              error={touched.name ? errors.name : ""}
            />

            <ComboField
              label="Medição Relacionada*"
              placeholder="Ex: TEMPERATURA"
              value={form.measurementType}
              options={typeOptions}
              onChange={(v) => update("measurementType", v)}
              onBlur={() => markTouched("measurementType")}
              error={touched.measurementType ? errors.measurementType : ""}
              listId="measurement-type-list"
            />

            <ComboField
              label="Unidade"
              placeholder="Ex: °C"
              value={form.unit}
              options={unitOptions}
              onChange={(v) => update("unit", v)}
              listId="unit-list"
            />

            <SelectField
              label="Condição*"
              placeholder="Selecione a condição"
              value={form.condition}
              options={conditionOptions}
              onChange={(v) => update("condition", v as FormState["condition"])}
              onBlur={() => markTouched("condition")}
              error={touched.condition ? errors.condition : ""}
            />

            <TextField
              label={`Valor de Referência${thresholdRequired ? "*" : ""}`}
              placeholder="Ex: 30"
              value={form.threshold}
              onChange={(v) => update("threshold", v)}
              onBlur={() => markTouched("threshold")}
              error={touched.threshold ? errors.threshold : ""}
            />

            <SelectField
              label="Severidade*"
              placeholder="Selecione a severidade"
              value={form.severity}
              options={severityOptions}
              onChange={(v) => update("severity", v as FormState["severity"])}
              onBlur={() => markTouched("severity")}
              error={touched.severity ? errors.severity : ""}
            />

            <div className="flex items-center gap-3 md:col-span-2">
              <Toggle
                checked={form.enabled}
                onChange={(v) => update("enabled", v)}
              />
              <span className="text-sm font-semibold text-[var(--plant-graphite)]">
                Alerta habilitado
              </span>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Vincular Sensores"
          icon={<AlertTriangle className="h-5 w-5 text-[var(--plant-primary)]" />}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {sensors.map((s) => (
              <label
                key={s.id}
                className="flex items-start gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={form.sensorIds.includes(s.id)}
                  onChange={() => toggleSensor(s.id)}
                  className="mt-1 h-4 w-4 accent-[var(--plant-primary)]"
                />
                <div>
                  <div className="font-semibold text-[var(--plant-graphite)]">
                    {s.sensorName}
                  </div>
                  <div className="text-xs text-black/45">
                    {s.hardwareId} • {s.type}
                  </div>
                </div>
              </label>
            ))}
            {!sensors.length ? (
              <div className="text-sm text-black/45">
                Nenhum sensor encontrado.
              </div>
            ) : null}
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/alerts"
            className="rounded-xl px-5 py-2 text-sm font-semibold
                     border border-black/15 bg-white text-[var(--plant-graphite)]
                     shadow-none transition-colors hover:bg-black/5"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "rounded-xl px-6 py-2 text-sm font-semibold",
              "bg-[var(--plant-primary)] text-white",
              "transition-opacity",
              !canSubmit ? "opacity-60 cursor-not-allowed" : "hover:opacity-95",
            ].join(" ")}
          >
            {submitting ? "Salvando..." : "Criar Regra"}
          </button>
        </div>
      </form>
    </div>
  );
}
