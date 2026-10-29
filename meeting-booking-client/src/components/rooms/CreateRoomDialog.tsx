"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRoomMutations } from "@/hooks/rooms/rooms.hook";
import { roomSchema } from "@/hooks/rooms/rooms.schemas";
import { TCreateRoom } from "@/hooks/rooms/rooms.types";
import { getErrorMessage } from "@/lib/errors";

export const CreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const { create } = useRoomMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateRoom>({
    resolver: zodResolver(roomSchema),
  });

  const onSubmit = (values: TCreateRoom) => {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Кімнату створено");
        reset();
        setOpen(false);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        Нова кімната
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Нова кімната</DialogTitle>
          <DialogDescription>
            Ви станете адміністратором цієї кімнати
          </DialogDescription>
        </DialogHeader>

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
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Створюємо..." : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
