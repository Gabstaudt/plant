"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/app/lib/validators";
import { api } from "@/app/lib/http";

type RegisterDto = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data: RegisterDto = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      dateOfBirth: String(fd.get("dateOfBirth") || ""),
    };

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Dados inválidos.";
      setError(first);
      return;
    }

    start(async () => {
      try {
        // 1) Registrar 
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });

        // 2) Ir para a tela de login com flag de sucesso
        router.replace("/login?created=1");
      } catch (err: any) {
        const msg = String(err?.message || "");
        if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplic")) {
          setError("Este email já está cadastrado.");
        } else if (msg) {
          setError(msg);
        } else {
          setError("Não foi possível concluir o cadastro.");
        }
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="fullName">
          Nome completo
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Maria Silva"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@gmail.com"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Mínimo de 6 caracteres"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="dateOfBirth">
          Data de nascimento
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {error}
        </p>
      )}

      <button
        disabled={pending}
        className="btn btn-primary w-full rounded-full py-3 font-bold shadow-md
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plant-primary)]/30"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center helper">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-[var(--plant-primary)] hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
