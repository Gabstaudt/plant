import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("Informe um e-mail válido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme sua senha."),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });
