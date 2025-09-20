"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/app/lib/validators";
import { api } from "@/app/lib/http";

type RegisterResponse = {
  ok: boolean;
  id?: string;
  role?: "USER" | "ADMIN";
  message?: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
      role: "USER" as const, // registro público = user comum; admin fica restrito ao backend
    };

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await api<RegisterResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });

        if (!res.ok) {
          setError(res.message || "Não foi possível criar sua conta.");
          return;
        }

        // Após registrar, vai para login
        router.replace("/login");
      } catch {
        setError("Erro de conexão. Tente novamente.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block mb-2 font-semibold text-[var(--plant-dark)]">
          Nome Completo
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Seu nome"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-semibold text-[var(--plant-dark)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="você@mail.com"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="password" className="block mb-2 font-semibold text-[var(--plant-dark)]">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••"
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                       focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-[var(--plant-dark)]">
            Confirme a senha
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••"
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                       focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>
      </div>

      {error && (
        <p role="alert" aria-live="assertive"
           className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {error}
        </p>
      )}

      <button
        disabled={pending}
        className="btn btn-primary w-full rounded-full py-3 font-bold shadow-md
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plant-primary)]/30"
      >
        {pending ? "Criando..." : "Criar Conta"}
      </button>

      <p className="text-center text-sm text-[var(--plant-graphite)]/70">
        Já tem a sua conta?{" "}
        <Link href="/login" className="font-semibold text-[var(--plant-primary)] hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
