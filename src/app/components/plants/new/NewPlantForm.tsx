"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sprout } from "lucide-react";

import FormSection from "./FormSection";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import TextAreaField from "./fields/TextAreaField";
import RangeField from "./fields/RangeField";
import {
  createPlant,
  updatePlant,
  type CreatePlantPayload,
} from "@/app/lib/plants.api";

type FormState = {
  name: string;
  species: string;
  location: string;
  notes: string;

  idealTempMin: string;
  idealTempMax: string;
  idealHumidityMin: string;
  idealHumidityMax: string;
  idealLightMin: string;
  idealLightMax: string;
  idealPhMin: string;
  idealPhMax: string;

  idealNotes: string;
};

type Props = {
  mode?: "create" | "edit";
  plantId?: string | number;
  defaultValues?: Partial<FormState>;
  onSubmitSuccess?: () => void;
};

const initial: FormState = {
  name: "",
  species: "",
  location: "",
  notes: "",

  idealTempMin: "20",
  idealTempMax: "28",
  idealHumidityMin: "60",
  idealHumidityMax: "80",
  idealLightMin: "70",
  idealLightMax: "90",
  idealPhMin: "6.0",
  idealPhMax: "7.0",

  idealNotes: "",
};

export default function NewPlantForm({
  mode = "create",
  plantId,
  defaultValues,
  onSubmitSuccess,
}: Props) {
  const [form, setForm] = useState<FormState>({ ...initial, ...defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...initial, ...defaultValues });
  }, [defaultValues]);

  const speciesOptions = useMemo(() => {
    const base = [
      { value: "solanum-lycopersicum", label: "Tomate (Solanum lycopersicum)" },
      { value: "vinca", label: "Vinca" },
      { value: "rosa-do-deserto", label: "Rosa-do-deserto" },
      { value: "rosas", label: "Rosas" },
      { value: "orquidea", label: "Orquídea" },
    ];
    if (form.species && !base.some((o) => o.value === form.species)) {
      return [{ value: form.species, label: form.species }, ...base];
    }
    return base;
  }, [form.species]);

  const locationOptions = useMemo(() => {
    const base = [
      { value: "Estufa A - Setor 1", label: "Estufa A - Setor 1" },
      { value: "Estufa A - Setor 2", label: "Estufa A - Setor 2" },
      { value: "Estufa B - Setor 1", label: "Estufa B - Setor 1" },
    ];
    if (form.location && !base.some((o) => o.value === form.location)) {
      return [{ value: form.location, label: form.location }, ...base];
    }
    return base;
  }, [form.location]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  const errors = {
    name: !form.name.trim() ? "Informe o nome da planta." : "",
    species: !form.species ? "Selecione a espécie." : "",
    location: !form.location ? "Selecione a localização." : "",
  };

  const canSubmit = !errors.name && !errors.species && !errors.location && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    markTouched("name");
    markTouched("species");
    markTouched("location");
    setError(null);

    if (!canSubmit) return;

    setSubmitting(true);

    try {
      const payload: CreatePlantPayload = {
        plantName: form.name.trim(),
        species: form.species,
        location: form.location,
        notes: emptyToUndefined(form.notes),
        notesConditions: emptyToUndefined(form.idealNotes),
        tempMin: toNumberOrUndefined(form.idealTempMin),
        tempMax: toNumberOrUndefined(form.idealTempMax),
        umiMin: toNumberOrUndefined(form.idealHumidityMin),
        umiMax: toNumberOrUndefined(form.idealHumidityMax),
        lightMin: toNumberOrUndefined(form.idealLightMin),
        lightMax: toNumberOrUndefined(form.idealLightMax),
        phMin: toNumberOrUndefined(form.idealPhMin),
        phMax: toNumberOrUndefined(form.idealPhMax),
      };

      if (mode === "edit") {
        if (!plantId) throw new Error("ID da planta não encontrado.");
        await updatePlant(plantId, payload);
        onSubmitSuccess?.();
        return;
      }

      await createPlant(payload);
      setForm(initial);
      setTouched({});
      onSubmitSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/plants"
            className="rounded-xl px-3 py-2 border border-black/10 hover:bg-black/5 transition-colors"
            aria-label="Voltar"
            title="Voltar"
          >
            ←
          </Link>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)]">
              {mode === "edit" ? "Editar Planta" : "Nova Planta"}
            </h1>
            <p className="mt-1 text-sm text-black/55">
              {mode === "edit"
                ? "Edite as informações da planta"
                : "Cadastre uma nova planta no sistema"}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <FormSection
        title="Informações Básicas"
        icon={<Sprout className="h-5 w-5 text-[var(--plant-primary)]" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome da Planta*"
            placeholder="Ex: Tomate A1"
            value={form.name}
            onChange={(v) => update("name", v)}
            onBlur={() => markTouched("name")}
            error={touched.name ? errors.name : ""}
          />

          <SelectField
            label="Espécie*"
            placeholder="Selecione a espécie"
            value={form.species}
            options={speciesOptions}
            onChange={(v) => update("species", v)}
            onBlur={() => markTouched("species")}
            error={touched.species ? errors.species : ""}
          />

          <SelectField
            label="Localização*"
            placeholder="Selecione a localização"
            value={form.location}
            options={locationOptions}
            onChange={(v) => update("location", v)}
            onBlur={() => markTouched("location")}
            error={touched.location ? errors.location : ""}
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

      <FormSection
        title="Condições Ideais"
        icon={<Sprout className="h-5 w-5 text-[var(--plant-primary)]" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RangeField
            label="Temperatura (°C)"
            minValue={form.idealTempMin}
            maxValue={form.idealTempMax}
            onChangeMin={(v) => update("idealTempMin", v)}
            onChangeMax={(v) => update("idealTempMax", v)}
          />

          <RangeField
            label="Umidade (%)"
            minValue={form.idealHumidityMin}
            maxValue={form.idealHumidityMax}
            onChangeMin={(v) => update("idealHumidityMin", v)}
            onChangeMax={(v) => update("idealHumidityMax", v)}
          />

          <RangeField
            label="Luminosidade (%)"
            minValue={form.idealLightMin}
            maxValue={form.idealLightMax}
            onChangeMin={(v) => update("idealLightMin", v)}
            onChangeMax={(v) => update("idealLightMax", v)}
          />

          <RangeField
            label="pH"
            minValue={form.idealPhMin}
            maxValue={form.idealPhMax}
            onChangeMin={(v) => update("idealPhMin", v)}
            onChangeMax={(v) => update("idealPhMax", v)}
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="Notas/Observações"
            placeholder="Adicione observações sobre a planta..."
            value={form.idealNotes}
            onChange={(v) => update("idealNotes", v)}
          />
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/plants"
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
          {submitting
            ? mode === "edit"
              ? "Salvando..."
              : "Cadastrando..."
            : mode === "edit"
            ? "Salvar Alterações"
            : "Cadastrar Planta"}
        </button>
      </div>
    </form>
  );
}

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toNumberOrUndefined(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}
