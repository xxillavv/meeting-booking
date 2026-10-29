"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRoomMutations } from "@/hooks/rooms/rooms.hook";
import { TCreateRoom, TRoom } from "@/hooks/rooms/rooms.types";
import { getErrorMessage } from "@/lib/errors";
import { RoomForm } from "./RoomForm";

export const EditRoomDialog = ({ room }: { room: TRoom }) => {
  const [open, setOpen] = useState(false);
  const { update } = useRoomMutations();

  const onSubmit = (values: TCreateRoom) => {
    update.mutate(
      { id: room.id, body: values },
      {
        onSuccess: () => {
          toast.success("Кімнату оновлено");
          setOpen(false);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilIcon />
        Редагувати
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагувати кімнату</DialogTitle>
        </DialogHeader>

        <RoomForm
          defaultValues={{
            name: room.name,
            description: room.description ?? "",
          }}
          submitLabel={update.isPending ? "Зберігаємо..." : "Зберегти"}
          isPending={update.isPending}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
