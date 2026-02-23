"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cpu } from "lucide-react";

import FormSection from "@/app/components/plants/new/FormSection";
import TextField from "@/app/components/plants/new/fields/TextField";
import SelectField from "@/app/components/plants/new/fields/SelectField";
import TextAreaField from "@/app/components/plants/new/fields/TextAreaField";
import RangeField from "@/app/components/plants/new/fields/RangeField";
import { getPlant, listPlants, type PlantStatusResponse } from "@/app/lib/plants.api";
import {
  createSensor,
  defaultUnitForType,
  mapUiTypeToApi,
} from "@/app/lib/sensors.api";

type FormState = {
  name: string;
  code: string;
  type: string;
  location: string;
  unit: string;
  readIntervalSeconds: string;
  notes: string;

  plantId: string;

  alertsEnabled: boolean;
  alertMin: string;
  alertMax: string;
};

type Props = {
  mode?: "create" | "edit";
  defaultValues?: Partial<FormState>;
  onSubmitSuccess?: () => void;
};

const initial: FormState = {
  name: "",
  code: "",
  type: "",
  location: "",
  unit: "",
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

export default function NewSensorForm({
  mode = "create",
  defaultValues,
  onSubmitSuccess,
}: Props) {
  const [form, setForm] = useState<FormState>({ ...initial, ...defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [plants, setPlants] = useState<PlantStatusResponse[]>([]);
  const [plantDetails, setPlantDetails] = useState<PlantStatusResponse | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listPlants();
        if (!active) return;
        setPlants(res?.data ?? []);
      } catch {
        if (active) setPlants([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const typeOptions = useMemo(() => {
    const defaults = [
      { value: "TEMPERATURA", label: "Temperatura" },
      { value: "UMIDADE", label: "Umidade" },
      { value: "LUMINOSIDADE", label: "Luminosidade" },
      { value: "PH", label: "pH" },
    ];
    const plantTypes =
      plantDetails?.idealRanges?.map((r) => ({
        value: r.type,
        label: r.type,
      })) ?? [];
    const map = new Map<string, { value: string; label: string }>();
    [...plantTypes, ...defaults].forEach((o) => {
      if (!map.has(o.value)) map.set(o.value, o);
    });
    return Array.from(map.values());
  }, [plantDetails]);

  const locationOptions = useMemo(
    () => {
      const fromPlants = plants
        .map((p) => p.location)
        .filter(Boolean)
        .map((loc) => ({ value: loc, label: loc }));

      const defaults = [
        { value: "estufa-a-setor-1", label: "Estufa A - Setor 1" },
        { value: "estufa-a-setor-2", label: "Estufa A - Setor 2" },
        { value: "estufa-b-setor-3", label: "Estufa B - Setor 3" },
      ];

      const map = new Map<string, { value: string; label: string }>();
      [...fromPlants, ...defaults].forEach((o) => {
        if (!map.has(o.value)) map.set(o.value, o);
      });
      return Array.from(map.values());
    },
    [plants]
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

  const plantOptions = useMemo(() => {
    const list = plants.map((p) => ({
      value: String(p.id),
      label: p.plantName,
    }));
    return list;
  }, [plants]);

  const unitOptions = useMemo(() => {
    const fromPlants = plants
      .map((p) => [p.tempUnit, p.umiUnit, p.lightUnit, p.phUnit])
      .flat()
      .filter(Boolean)
      .map((u) => ({ value: String(u), label: String(u) }));
    const fromPlantDetails =
      plantDetails?.idealRanges
        ?.map((r) => r.unit)
        .filter(Boolean)
        .map((u) => ({ value: String(u), label: String(u) })) ?? [];
    const defaults = [
      { value: "°C", label: "°C" },
      { value: "%", label: "%" },
      { value: "pH", label: "pH" },
    ];
    const map = new Map<string, { value: string; label: string }>();
    [...fromPlantDetails, ...fromPlants, ...defaults].forEach((o) => {
      if (!map.has(o.value)) map.set(o.value, o);
    });
    return Array.from(map.values());
  }, [plants, plantDetails]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function markTouched(key: keyof FormState) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  const errors = {
    name: !form.name.trim() ? "Informe o nome do sensor." : "",
    code: !form.code.trim() ? "Informe o ID do sensor." : "",
    type: !form.type ? "Selecione o tipo do sensor." : "",
    unit: !form.unit ? "Selecione a unidade." : "",
  };

  const canSubmit =
    !errors.name &&
    !errors.code &&
    !errors.type &&
    !errors.unit &&
    !submitting;

  function resolveUnit(type: string, plant?: PlantStatusResponse | null) {
    if (!type || !plant) return "";
    const ideal = plant.idealRanges?.find((r) => r.type === type);
    if (ideal?.unit) return ideal.unit;
    if (type === "TEMPERATURA") return plant.tempUnit ?? "";
    if (type === "UMIDADE") return plant.umiUnit ?? "";
    if (type === "LUMINOSIDADE") return plant.lightUnit ?? "";
    if (type === "PH") return plant.phUnit ?? "";
    return "";
  }

  function pickPlantUnit(plant?: PlantStatusResponse | null) {
    if (!plant) return "";
    return (
      plant.tempUnit ||
      plant.umiUnit ||
      plant.lightUnit ||
      plant.phUnit ||
      ""
    );
  }

  useEffect(() => {
    let active = true;
    if (!form.plantId) {
      setPlantDetails(null);
      return;
    }
    (async () => {
      try {
        const res = await getPlant(form.plantId);
        if (!active) return;
        setPlantDetails(res ?? null);
      } catch {
        if (active) setPlantDetails(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [form.plantId]);

  useEffect(() => {
    if (!plantDetails) return;
    const nextLocation = plantDetails.location ?? "";
    if (nextLocation !== form.location) update("location", nextLocation);
    const plantType = plantDetails.idealRanges?.[0]?.type ?? "";
    if (plantType && plantType !== form.type) {
      update("type", plantType);
    }
    const unitFromPlant = resolveUnit(plantType || form.type, plantDetails);
    const fallbackUnit = pickPlantUnit(plantDetails);
    const nextUnit = unitFromPlant || fallbackUnit;
    if (nextUnit && nextUnit !== form.unit) update("unit", nextUnit);
  }, [plantDetails, form.type, form.location]);

  function toNumberOrUndefined(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed.replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    markTouched("name");
    markTouched("code");
    markTouched("type");
    markTouched("location");
    markTouched("unit");

    if (!canSubmit) return;

    setSubmitting(true);
    try {
      if (mode === "edit") {
        onSubmitSuccess?.();
        return;
      }

      const plantUnit = resolveUnit(form.type, plantDetails);
      const unitToSend =
        plantUnit ||
        form.unit ||
        defaultUnitForType(form.type as any);

      const apiType =
        form.type === "TEMPERATURA" ||
        form.type === "UMIDADE" ||
        form.type === "LUMINOSIDADE" ||
        form.type === "PH"
          ? mapUiTypeToApi(form.type as any)
          : form.type;

      await createSensor({
        sensorName: form.name.trim(),
        hardwareId: form.code.trim(),
        type: apiType,
        location: form.location,
        unit: unitToSend,
        alertsEnabled: form.alertsEnabled,
        plantId: form.plantId ? Number(form.plantId) : undefined,
        readingIntervalSeconds: toNumberOrUndefined(form.readIntervalSeconds),
        notes: form.notes.trim() ? form.notes.trim() : undefined,
      });

      setForm(initial);
      setTouched({});
      onSubmitSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

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
              {mode === "edit" ? "Editar Sensor" : "Novo Sensor"}
            </h1>
            <p className="mt-1 text-sm text-black/55">
              {mode === "edit"
                ? "Edite as configurações do sensor"
                : "Adicione um novo sensor ao sistema"}
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
            disabled={mode === "edit"}
          />

          <SelectField
            label="Tipo do Sensor*"
            placeholder="Selecione o tipo"
            value={form.type}
            options={typeOptions}
            onChange={(v) => update("type", v as FormState["type"])}
            onBlur={() => markTouched("type")}
            error={touched.type ? errors.type : ""}
            allowCustom
          />

          <SelectField
            label="Localização"
            placeholder="Digite ou selecione a localização"
            value={form.location}
            options={locationOptions}
            onChange={(v) => update("location", v)}
            onBlur={() => markTouched("location")}
            error={touched.location ? errors.location : ""}
            allowCustom
          />

          <SelectField
            label="Unidade*"
            placeholder="Digite ou selecione a unidade"
            value={form.unit}
            options={unitOptions}
            onChange={(v) => update("unit", v)}
            onBlur={() => markTouched("unit")}
            error={touched.unit ? errors.unit : ""}
            allowCustom
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
        title="Configurações de Alertas"
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
          {submitting
            ? mode === "edit"
              ? "Salvando..."
              : "Cadastrando..."
            : mode === "edit"
            ? "Salvar Alterações"
            : "Cadastrar Sensor"}
        </button>
      </div>
    </form>
  );
}


