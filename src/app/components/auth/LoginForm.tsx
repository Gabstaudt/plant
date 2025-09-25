"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { loginSchema } from "@/app/lib/validators";
import { api } from "@/app/lib/http";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LoginDto = z.infer<typeof loginSchema>;

type LoginApiResponse = {
  access_token: string;
};

type MeResponse = {
  id: string | number;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
};

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const justCreated = search?.get("created") === "1";

  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data: LoginDto = {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    };

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Dados inválidos.";
      setError(first);
      return;
    }

    start(async () => {
      try {
        // 1) Login na API
        const login = await api<LoginApiResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });

        if (!login?.access_token) {
          setError("Falha no login.");
          return;
        }

        // 2) Guardar token
        localStorage.setItem("token", login.access_token);

        // 3) Buscar perfil
        const me = await api<MeResponse>("/users/me", { method: "GET" });
        const role = me?.role ?? "USER";
        localStorage.setItem("role", role);

        // 4) Ir ao dashboard
        router.replace("/dashboard");
      } catch (err: any) {
        setError(err?.message || "Erro de conexão. Tente novamente.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          className="label block mb-2 font-semibold text-[var(--plant-dark)]"
          htmlFor="email"
        >
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
        <label
          className="label block mb-2 font-semibold text-[var(--plant-dark)]"
          htmlFor="password"
        >
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          className="w-full rounded-xl border border-[var(--plant-dark)]/20 bg-white px-4 py-3 outline-none transition
                     focus:border-[var(--plant-primary)] focus:ring-2 focus:ring-[var(--plant-primary)]/20"
        />
        <div className="mt-2 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-[var(--plant-graphite)]">
            <input
              name="remember"
              type="checkbox"
              className="rounded border-gray-300 text-[var(--plant-primary)] focus:ring-[var(--plant-primary)]"
            />
            Lembre-se de mim
          </label>
          <a
            className="text-sm font-semibold text-[var(--plant-primary)] hover:underline"
            href="#"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
          {error}
        </p>
      )}

      {justCreated && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 border border-green-200">
          Conta criada com sucesso. Faça login para continuar.
        </p>
      )}

      <button
        disabled={pending}
        className="btn btn-primary w-full rounded-full py-3 font-bold shadow-md
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--plant-primary)]/30"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center helper">
        Ainda não tem uma conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-[var(--plant-primary)] hover:underline"
        >
          Registre-se
        </Link>
      </p>
    </form>
  );
}
