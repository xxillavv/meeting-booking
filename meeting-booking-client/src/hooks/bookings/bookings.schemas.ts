import { z } from "zod";

export const bookingSchema = z
  .object({
    date: z.string().min(1, "Оберіть дату"),
    startTime: z.string().min(1, "Вкажіть час початку"),
    endTime: z.string().min(1, "Вкажіть час кінця"),
    description: z.string().trim().max(500, "Опис задовгий").optional(),
  })
  .refine((values) => values.endTime > values.startTime, {
    message: "Кінець має бути пізніше за початок",
    path: ["endTime"],
  });

export const createBookingSchema = bookingSchema.refine(
  (values) => new Date(`${values.date}T${values.startTime}`) > new Date(),
  {
    message: "Не можна бронювати час у минулому",
    path: ["startTime"],
  },
);
