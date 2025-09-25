import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD."),
});
