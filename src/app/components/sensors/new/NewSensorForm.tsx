"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cpu } from "lucide-react";

import FormSection from "@/app/components/plants/new/FormSection"; 
import TextField from "@/app/components/plants/new/fields/TextField";
import SelectField from "@/app/components/plants/new/fields/SelectField";
import TextAreaField from "@/app/components/plants/new/fields/TextAreaField";
import RangeField from "@/app/components/plants/new/fields/RangeField";

type FormState = {
  name: string;
  code: string;
  type: "" | "TEMPERATURA" | "UMIDADE" | "LUMINOSIDADE" | "PH";
  location: string;
  readIntervalSeconds: string;
  notes: string;

  plantId: string;

  alertsEnabled: boolean;
  alertMin: string;
  alertMax: string;
};

const initial: FormState = {
  name: "",
  code: "",
  type: "",
  location: "",
  readIntervalSeconds: "",
  notes: "",

  plantId: "",

  alertsEnabled: false,
  alertMin: "",
  alertMax: "",
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

export default function NewSensorForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const typeOptions = useMemo(
    () => [
      { value: "TEMPERATURA", label: "Temperatura" },
      { value: "UMIDADE", label: "Umidade" },
      { value: "LUMINOSIDADE", label: "Luminosidade" },
      { value: "PH", label: "pH" },
    ],
    []
  );

  const locationOptions = useMemo(
    () => [
      { value: "estufa-a-setor-1", label: "Estufa A - Setor 1" },
      { value: "estufa-a-setor-2", label: "Estufa A - Setor 2" },
      { value: "estufa-b-setor-3", label: "Estufa B - Setor 3" },
    ],
    []
  );

  const intervalOptions = useMemo(
    () => [
      { value: "30", label: "30 segundos" },
      { value: "60", label: "60 segundos" },
      { value: "120", label: "120 segundos" },
      { value: "300", label: "300 segundos" },
    ],
    []
  );

  const plantOptions = useMemo(
    () => [
      { value: "tomates-a1", label: "Tomates A1" },
      { value: "lettuce-b2", label: "Lettuce B2" },
    ],
    []
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  // obrigatórios do print
  const errors = {
    name: !form.name.trim() ? "Informe o nome do sensor." : "",
    code: !form.code.trim() ? "Informe o ID do sensor." : "",
    type: !form.type ? "Selecione o tipo do sensor." : "",
    location: !form.location ? "Selecione a localização." : "",
  };

  const canSubmit =
    !errors.name &&
    !errors.code &&
    !errors.type &&
    !errors.location &&
    !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    markTouched("name");
    markTouched("code");
    markTouched("type");
    markTouched("location");

    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // TODO: integrar API
      await new Promise((r) => setTimeout(r, 600));
      console.log("Novo sensor:", form);
      alert("Sensor cadastrado (mock) ✅");
      setForm(initial);
      setTouched({});
    } finally {
      setSubmitting(false);
    }
  }

  // placeholder do print: limites só fazem sentido após selecionar tipo
  const alertHint =
    form.type === ""
      ? "Selecione um tipo de sensor para configurar os limites de alerta"
      : "";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/sensors"
            className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
            aria-label="Voltar"
            title="Voltar"
          >
            ←
          </Link>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)]">
              Novo Sensor
            </h1>
            <p className="mt-1 text-sm text-black/55">
              Adicione um novo sensor ao sistema
            </p>
          </div>
        </div>
      </div>

      {/* Seção 1 - Informações */}
      <FormSection
        title="Informações do Sensor"
        icon={<Cpu className="h-5 w-5 text-[var(--plant-primary)]" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome do Sensor*"
            placeholder="Ex: Sensor Temperatura A1"
            value={form.name}
            onChange={(v) => update("name", v)}
            onBlur={() => markTouched("name")}
            error={touched.name ? errors.name : ""}
          />

          <TextField
            label="ID do Sensor*"
            placeholder="Ex: TH-001"
            value={form.code}
            onChange={(v) => update("code", v)}
            onBlur={() => markTouched("code")}
            error={touched.code ? errors.code : ""}
          />

          <SelectField
            label="Tipo do Sensor*"
            placeholder="Selecione o tipo"
            value={form.type}
            options={typeOptions}
            onChange={(v) => update("type", v as FormState["type"])}
            onBlur={() => markTouched("type")}
            error={touched.type ? errors.type : ""}
          />

          <SelectField
            label="Localização*"
            placeholder="Selecione a localização"
            value={form.location}
            options={locationOptions}
            onChange={(v) => update("location", v)}
            onBlur={() => markTouched("location")}
            error={touched.location ? errors.location : ""}
          />

          <SelectField
            label="Intervalo de Leitura (segundos)"
            placeholder="Selecione o tipo"
            value={form.readIntervalSeconds}
            options={intervalOptions}
            onChange={(v) => update("readIntervalSeconds", v)}
            className="md:col-span-2 md:max-w-[360px]"
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="Notas/Observações"
            placeholder="Adicione observações sobre a planta..."
            value={form.notes}
            onChange={(v) => update("notes", v)}
          />
        </div>
      </FormSection>

      {/* Seção 2 - Vincular planta */}
      <FormSection
        title="Vincular Planta"
        icon={<Cpu className="h-5 w-5 text-[var(--plant-primary)]" />}
      >
        <SelectField
          label="Intervalo de Leitura (segundos)"
          placeholder="Selecione uma planta"
          value={form.plantId}
          options={plantOptions}
          onChange={(v) => update("plantId", v)}
          className="max-w-[520px]"
        />
      </FormSection>

      {/* Seção 3 - Alertas */}
      <FormSection
        title="Configuração de Alertas"
        icon={<Cpu className="h-5 w-5 text-[var(--plant-primary)]" />}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-black/45">{alertHint}</p>

          <div className="flex items-center gap-3">
            <Toggle
              checked={form.alertsEnabled}
              onChange={(v) => update("alertsEnabled", v)}
            />
            <span className="text-sm font-semibold text-[var(--plant-graphite)]">
              Alertas Habilitados
            </span>
          </div>
        </div>

        {/* quando habilitar, mostra limites */}
        {form.alertsEnabled && form.type !== "" && (
          <div className="mt-4 max-w-[520px]">
            <RangeField
              label="Limites de Alerta"
              minValue={form.alertMin}
              maxValue={form.alertMax}
              onChangeMin={(v) => update("alertMin", v)}
              onChangeMax={(v) => update("alertMax", v)}
            />
          </div>
        )}
      </FormSection>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/sensors"
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
          {submitting ? "Cadastrando..." : "Cadastrar Sensor"}
        </button>
      </div>
    </form>
  );
}
