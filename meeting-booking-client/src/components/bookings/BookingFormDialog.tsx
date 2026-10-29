"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBookingMutations } from "@/hooks/bookings/bookings.hook";
import {
  bookingSchema,
  createBookingSchema,
} from "@/hooks/bookings/bookings.schemas";
import {
  TBooking,
  TBookingForm,
  TUpdateBooking,
} from "@/hooks/bookings/bookings.types";
import { toDateInputValue, toISO, toTimeInputValue } from "@/lib/dates";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";

type BookingFormDialogProps = {
  roomId: string;
  booking?: TBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getDefaultValues = (booking?: TBooking): TBookingForm => {
  if (booking) {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    return {
      date: toDateInputValue(start),
      startTime: toTimeInputValue(start),
      endTime: toTimeInputValue(end),
      description: booking.description ?? "",
    };
  }

  const start = new Date();
  start.setHours(start.getHours() + 1, 0, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return {
    date: toDateInputValue(start),
    startTime: toTimeInputValue(start),
    endTime: toTimeInputValue(end),
    description: "",
  };
};

const getBookingError = (error: unknown) => {
  const status = getErrorStatus(error);

  if (status === 409) return "Цей час уже зайнятий іншим бронюванням";
  if (status === 400) return "Не можна бронювати час у минулому";

  return getErrorMessage(error);
};

const BookingForm = ({
  roomId,
  booking,
  onOpenChange,
}: Omit<BookingFormDialogProps, "open">) => {
  const { create, update } = useBookingMutations(roomId);
  const isPending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TBookingForm>({
    resolver: zodResolver(booking ? bookingSchema : createBookingSchema),
    defaultValues: getDefaultValues(booking),
  });

  const onSubmit = (values: TBookingForm) => {
    const startTime = toISO(values.date, values.startTime);
    const endTime = toISO(values.date, values.endTime);

    const options = {
      onSuccess: () => {
        toast.success(booking ? "Бронювання оновлено" : "Кімнату заброньовано");
        onOpenChange(false);
      },
      onError: (error: unknown) => toast.error(getBookingError(error)),
    };

    if (!booking) {
      create.mutate(
        { roomId, startTime, endTime, description: values.description },
        options,
      );
      return;
    }

    const body: TUpdateBooking = { description: values.description };

    if (startTime !== booking.startTime) body.startTime = startTime;
    if (endTime !== booking.endTime) body.endTime = endTime;

    update.mutate({ id: booking.id, body }, options);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.date}>
          <FieldLabel htmlFor="date">Дата</FieldLabel>
          <Input
            id="date"
            type="date"
            aria-invalid={!!errors.date}
            {...register("date")}
          />
          <FieldError errors={[errors.date]} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.startTime}>
            <FieldLabel htmlFor="startTime">Початок</FieldLabel>
            <Input
              id="startTime"
              type="time"
              aria-invalid={!!errors.startTime}
              {...register("startTime")}
            />
            <FieldError errors={[errors.startTime]} />
          </Field>

          <Field data-invalid={!!errors.endTime}>
            <FieldLabel htmlFor="endTime">Кінець</FieldLabel>
            <Input
              id="endTime"
              type="time"
              aria-invalid={!!errors.endTime}
              {...register("endTime")}
            />
            <FieldError errors={[errors.endTime]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Опис</FieldLabel>
          <Textarea
            id="description"
            placeholder="Наприклад, дейлі команди"
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <DialogClose render={<Button variant="outline" />}>
          Скасувати
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Зберігаємо..." : booking ? "Зберегти" : "Забронювати"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const BookingFormDialog = ({
  roomId,
  booking,
  open,
  onOpenChange,
}: BookingFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {booking ? "Редагувати бронювання" : "Нове бронювання"}
          </DialogTitle>
        </DialogHeader>

        <BookingForm
          roomId={roomId}
          booking={booking}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};
