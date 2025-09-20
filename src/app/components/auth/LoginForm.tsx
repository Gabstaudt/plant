"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { loginSchema } from "@/app/lib/validators";
import { api } from "@/app/lib/http";
import { useRouter } from "next/navigation";

type LoginResponse = {
  ok: boolean;
  role?: "ADMIN" | "USER";
  token?: string;
  message?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

    
  
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const data = {
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
        const res = await api<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });

        if (!res.ok || !res.token || !res.role) {
          setError(res.message || "Falha no login.");
          return;
        }

        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);

        router.replace(res.role === "ADMIN" ? "/admin" : "/user");
      } catch {
        setError("Erro de conexão. Tente novamente.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="label block mb-2 font-semibold text-[var(--plant-dark)]" htmlFor="email">
          Username
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
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
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
            Remember me
          </label>
          <a className="text-sm font-semibold text-[var(--plant-primary)] hover:underline" href="#">
            Forgot Password?
          </a>
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
        {pending ? "Entrando..." : "Let's Plant"}
      </button>

      <p className="text-center helper mt-4">
        Don’t have an account yet?{" "}
        <a className="font-semibold text-[var(--plant-primary)] hover:underline" href="#">
          Register
        </a>
      </p>
    </form>
  );
}
