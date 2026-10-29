import { z } from "zod";

export const roomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введіть назву кімнати")
    .max(100, "Назва задовга"),
  description: z.string().trim().max(500, "Опис задовгий").optional(),
});
