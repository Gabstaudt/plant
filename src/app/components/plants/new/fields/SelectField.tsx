import { useId } from "react";

type Option = { value: string; label: string };

export default function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  onBlur,
  error,
  className,
  allowCustom,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  allowCustom?: boolean;
}) {
  const listId = useId();
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
        {label}
      </label>

      {allowCustom ? (
        <>
          <input
            list={listId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={[
              "mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none",
              error
                ? "border-red-300 focus:ring-2 focus:ring-red-200"
                : "border-black/10 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30",
            ].join(" ")}
          />
          <datalist id={listId}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </datalist>
        </>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={[
            "mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none",
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-200"
              : "border-black/10 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30",
          ].join(" ")}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
