import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "Senha é obrigatória."),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Confirme a senha."),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD."),

  ecosystemCode: z.string().optional(),
  isMasterAdmin: z.boolean().optional(),
  ecosystemName: z.string().optional(),
}).superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "As senhas não conferem.",
      path: ["confirmPassword"],
    });
  }

  if (val.isMasterAdmin) {
    if (!val.ecosystemName || !val.ecosystemName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o nome do ecossistema.",
        path: ["ecosystemName"],
      });
    }
  } else {
    if (!val.ecosystemCode || !val.ecosystemCode.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o código do ecossistema.",
        path: ["ecosystemCode"],
      });
    }
  }
});
