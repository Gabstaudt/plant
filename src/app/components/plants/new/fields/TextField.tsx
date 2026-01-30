"use client";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean; // ✅ ADICIONAR
};

export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled, // ✅ ADICIONAR
}: Props) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--plant-graphite)]">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled} 
        className={[
          "mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors",
          "border-black/10 bg-white",
          error ? "border-red-300" : "focus:border-[var(--plant-primary)]",
          disabled ? "bg-black/5 text-black/50 cursor-not-allowed" : "",
        ].join(" ")}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : null}
    </label>
  );
}
