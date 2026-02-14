"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Sprout, Trash2 } from "lucide-react";

import FormSection from "./FormSection";
import TextField from "./fields/TextField";
import TextAreaField from "./fields/TextAreaField";
import ComboField from "./fields/ComboField";
import {
  createPlant,
  listPlantOptions,
  updatePlant,
  type CreatePlantPayload,
  type PlantOptionsResponse,
} from "@/app/lib/plants.api";

type FormState = {
  name: string;
  species: string;
  location: string;
  notes: string;
  idealNotes: string;
  idealRanges: RangeRow[];
};

type RangeRow = {
  id: string;
  type: string;
  unit: string;
  min: string;
  max: string;
};

type Props = {
  mode?: "create" | "edit";
  plantId?: string | number;
  defaultValues?: Partial<FormState>;
  onSubmitSuccess?: () => void;
};

const initial: FormState = buildInitialForm();

export default function NewPlantForm({
  mode = "create",
  plantId,
  defaultValues,
  onSubmitSuccess,
}: Props) {
  const [form, setForm] = useState<FormState>(
    buildInitialForm(defaultValues)
  );
  const [options, setOptions] = useState<PlantOptionsResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildInitialForm(defaultValues));
  }, [defaultValues]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listPlantOptions();
        if (active) setOptions(res);
      } catch {
        if (active) setOptions(null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function addOptionValue(list: string[], value?: string) {
    const v = value?.trim();
    if (!v) return list;
    const exists = list.some((x) => x.trim().toLowerCase() === v.toLowerCase());
    return exists ? list : [v, ...list];
  }

  function updateLocalOptions(payload: CreatePlantPayload) {
    const types: string[] = [];
    const units: string[] = [];
    (payload.idealRanges ?? []).forEach((r) => {
      if (r.type && !types.includes(r.type)) types.push(r.type);
      if (r.unit && !units.includes(r.unit)) units.push(r.unit);
    });

    setOptions((prev) => {
      if (!prev) {
        return {
          species: payload.species ? [payload.species] : [],
          locations: payload.location ? [payload.location] : [],
          types,
          units,
        };
      }
      return {
        species: addOptionValue(prev.species, payload.species),
        locations: addOptionValue(prev.locations, payload.location),
        types: mergeUnitList(prev.types, types),
        units: mergeUnitList(prev.units, units),
      };
    });
  }

  const speciesOptions = useMemo(() => {
    const merged = toOptions(options?.species ?? []);
    if (form.species && !hasValue(merged, form.species)) {
      merged.unshift({ value: form.species, label: form.species });
    }
    return merged;
  }, [form.species, options]);

  const locationOptions = useMemo(() => {
    const merged = toOptions(options?.locations ?? []);
    if (form.location && !hasValue(merged, form.location)) {
      merged.unshift({ value: form.location, label: form.location });
    }
    return merged;
  }, [form.location, options]);

  const typeOptions = useMemo(() => {
    return toOptions(options?.types ?? []);
  }, [options]);

  const unitOptions = useMemo(() => {
    return toOptions(options?.units ?? []);
  }, [options]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  const errors = {
    name: !form.name.trim() ? "Informe o nome da planta." : "",
    species: !form.species.trim() ? "Informe a espécie." : "",
    location: !form.location.trim() ? "Informe a localização." : "",
  };

  const canSubmit = !errors.name && !errors.species && !errors.location && !submitting;

  function addRange() {
    setForm((p) => ({
      ...p,
      idealRanges: [
        ...p.idealRanges,
        { id: createId(), type: "", unit: "", min: "", max: "" },
      ],
    }));
  }

  function removeRange(id: string) {
    setForm((p) => ({
      ...p,
      idealRanges: p.idealRanges.filter((r) => r.id !== id),
    }));
  }

  function updateRange(
    id: string,
    key: "type" | "unit" | "min" | "max",
    value: string
  ) {
    setForm((p) => ({
      ...p,
      idealRanges: p.idealRanges.map((r) =>
        r.id === id ? { ...r, [key]: value } : r
      ),
    }));
  }

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
        species: form.species.trim(),
        location: form.location.trim(),
        notes: emptyToUndefined(form.notes),
        notesConditions: emptyToUndefined(form.idealNotes),
        idealRanges: buildIdealRanges(form.idealRanges),
      };

      if (mode === "edit") {
        if (!plantId) throw new Error("ID da planta não encontrado.");
        await updatePlant(plantId, payload);
        updateLocalOptions(payload);
        onSubmitSuccess?.();
        return;
      }

      await createPlant(payload);
      updateLocalOptions(payload);
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

          <ComboField
            label="Espécie*"
            placeholder="Digite ou selecione a espécie"
            value={form.species}
            options={speciesOptions}
            onChange={(v) => update("species", v)}
            onBlur={() => markTouched("species")}
            error={touched.species ? errors.species : ""}
            listId="species-list"
          />

          <ComboField
            label="Localização*"
            placeholder="Digite ou selecione a localização"
            value={form.location}
            options={locationOptions}
            onChange={(v) => update("location", v)}
            onBlur={() => markTouched("location")}
            error={touched.location ? errors.location : ""}
            className="md:col-span-2 md:max-w-[360px]"
            listId="location-list"
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
        <div className="grid gap-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--plant-graphite)]">
                Condição
              </p>
              <button
                type="button"
                onClick={addRange}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-[var(--plant-graphite)] hover:bg-black/5"
                aria-label="Adicionar condição"
                title="Adicionar condição"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {form.idealRanges.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-black/5 bg-[var(--plant-ice)]/40 p-3"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr,1fr,1fr,auto] items-end">
                    <ComboField
                      label="Título"
                      placeholder="Digite ou selecione o título"
                      value={row.type}
                      options={typeOptions}
                      onChange={(v) => updateRange(row.id, "type", v)}
                      listId="type-list"
                    />
                    <ComboField
                      label="Unidade"
                      placeholder="Digite ou selecione a unidade"
                      value={row.unit}
                      options={unitOptions}
                      onChange={(v) => updateRange(row.id, "unit", v)}
                      listId="unit-list"
                    />
                    <div>
                      <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
                        Intervalo
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          value={row.min}
                          onChange={(e) =>
                            updateRange(row.id, "min", e.target.value)
                          }
                          placeholder="Mínimo"
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                        />
                        <span className="text-sm text-black/35">a</span>
                        <input
                          value={row.max}
                          onChange={(e) =>
                            updateRange(row.id, "max", e.target.value)
                          }
                          placeholder="Máximo"
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRange(row.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-black/50 hover:bg-black/5"
                      aria-label="Remover condição"
                      title="Remover condição"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

type Option = { value: string; label: string };

function toOptions(values: string[]) {
  return values.map((v) => ({ value: v, label: v }));
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function hasValue(options: Option[], value: string) {
  const key = normalizeKey(value);
  return options.some((o) => normalizeKey(o.value) === key);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyRangeRow(): RangeRow {
  return { id: createId(), type: "", unit: "", min: "", max: "" };
}

function buildInitialForm(defaults?: Partial<FormState>): FormState {
  const base: FormState = {
    name: "",
    species: "",
    location: "",
    notes: "",
    idealNotes: "",
    idealRanges: [emptyRangeRow()],
  };

  if (!defaults) return base;

  return {
    ...base,
    ...defaults,
    idealRanges: defaults.idealRanges ?? base.idealRanges,
  };
}

type IdealRangePayload = NonNullable<CreatePlantPayload["idealRanges"]>[number];

function buildIdealRanges(
  ranges: RangeRow[]
): CreatePlantPayload["idealRanges"] {
  const list: IdealRangePayload[] = [];
  const push = (r: RangeRow) => {
    const type = r.type.trim();
    const unit = r.unit.trim();
    if (!type || !unit) return;
    list.push({
      type,
      unit,
      min: toNumberOrUndefined(r.min),
      max: toNumberOrUndefined(r.max),
    });
  };

  ranges.forEach((r) => push(r));

  return list.length ? list : undefined;
}

function mergeUnitList(existing: string[], incoming: string[]) {
  const next = [...existing];
  incoming.forEach((v) => {
    const val = v?.trim();
    if (!val) return;
    if (!next.some((x) => x.trim().toLowerCase() === val.toLowerCase())) {
      next.unshift(val);
    }
  });
  return next;
}
