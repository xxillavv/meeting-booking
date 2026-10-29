import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.email("Введіть коректний email"),
  role: z.enum(["ADMIN", "USER"]),
});
