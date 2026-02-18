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
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data: RegisterDto = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
      dateOfBirth: String(fd.get("dateOfBirth") || ""),
      ecosystemCode: String(fd.get("ecosystemCode") || ""),
      isMasterAdmin: isMasterAdmin,
      ecosystemName: String(fd.get("ecosystemName") || ""),
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
          body: JSON.stringify({
            fullName: parsed.data.fullName,
            email: parsed.data.email,
            password: parsed.data.password,
            dateOfBirth: parsed.data.dateOfBirth,
            ecosystemCode: parsed.data.ecosystemCode,
            ecosystemName: parsed.data.ecosystemName,
            isMasterAdmin: parsed.data.isMasterAdmin,
          }),
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
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="fullName">
            Nome completo
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Maria Silva"
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
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
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                       focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>
      </div>

      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="password">
          Senha
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                       focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                       focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>
      </div>

      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="dateOfBirth">
          Data de nascimento
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="flex items-center gap-3">
          <input
            id="isMasterAdmin"
            name="isMasterAdmin"
            type="checkbox"
            checked={isMasterAdmin}
            onChange={(e) => setIsMasterAdmin(e.target.checked)}
            className="h-4 w-4 accent-[var(--plant-primary)]"
          />
          <label htmlFor="isMasterAdmin" className="text-sm font-semibold text-[var(--plant-dark)]">
            Sou o primeiro administrador (criar novo ecossistema)
          </label>
        </div>

        <div className="mt-4">
          {!isMasterAdmin ? (
            <div>
              <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="ecosystemCode">
                Código do ecossistema
              </label>
              <input
                id="ecosystemCode"
                name="ecosystemCode"
                type="text"
                placeholder="Ex: ECO-8F2C9A"
                className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                           focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
              />
            </div>
          ) : (
            <div>
              <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="ecosystemName">
                Nome do ecossistema
              </label>
              <input
                id="ecosystemName"
                name="ecosystemName"
                type="text"
                placeholder="Ex: Plant Connect"
                className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-2.5 outline-none transition
                           focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
              />
            </div>
          )}
        </div>
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
