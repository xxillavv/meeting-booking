import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Введіть коректний email"),
  password: z.string().min(1, "Введіть пароль"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Введіть ім'я").max(100, "Ім'я задовге"),
  email: z.email("Введіть коректний email"),
  password: z
    .string()
    .min(6, "Пароль має містити щонайменше 6 символів")
    .max(72, "Пароль задовгий"),
});
