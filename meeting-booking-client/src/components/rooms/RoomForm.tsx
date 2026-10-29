"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { roomSchema } from "@/hooks/rooms/rooms.schemas";
import { TCreateRoom } from "@/hooks/rooms/rooms.types";

type RoomFormProps = {
  defaultValues?: TCreateRoom;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (values: TCreateRoom) => void;
};

export const RoomForm = ({
  defaultValues,
  submitLabel,
  isPending,
  onSubmit,
}: RoomFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateRoom>({
    resolver: zodResolver(roomSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Назва</FieldLabel>
          <Input
            id="name"
            placeholder="Наприклад, Переговорна 1"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Опис</FieldLabel>
          <Textarea
            id="description"
            placeholder="Поверх, кількість місць, обладнання"
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
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};
