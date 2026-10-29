"use client";

import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRoomMutations } from "@/hooks/rooms/rooms.hook";
import { TRoom } from "@/hooks/rooms/rooms.types";
import { getErrorMessage } from "@/lib/errors";

export const DeleteRoomDialog = ({ room }: { room: TRoom }) => {
  const { remove } = useRoomMutations();

  const onDelete = () => {
    remove.mutate(room.id, {
      onSuccess: () => toast.success("Кімнату видалено"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2Icon />
        Видалити
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Видалити «{room.name}»?</AlertDialogTitle>
          <AlertDialogDescription>
            Разом з кімнатою буде видалено всі її бронювання та учасників. Цю
            дію не можна скасувати.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onDelete}
            disabled={remove.isPending}
          >
            {remove.isPending ? "Видаляємо..." : "Видалити"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
