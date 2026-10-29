"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRoomMutations } from "@/hooks/rooms/rooms.hook";
import { TCreateRoom } from "@/hooks/rooms/rooms.types";
import { getErrorMessage } from "@/lib/errors";
import { RoomForm } from "./RoomForm";

export const CreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const { create } = useRoomMutations();

  const onSubmit = (values: TCreateRoom) => {
    create.mutate(values, {
      onSuccess: () => {
        toast.success("Кімнату створено");
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

        <RoomForm
          submitLabel={create.isPending ? "Створюємо..." : "Створити"}
          isPending={create.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
