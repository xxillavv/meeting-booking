"use client";

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
} from "@/components/ui/alert-dialog";
import { useBookingMutations } from "@/hooks/bookings/bookings.hook";
import { TBooking } from "@/hooks/bookings/bookings.types";
import { getErrorMessage } from "@/lib/errors";

type CancelBookingDialogProps = {
  roomId: string;
  booking: TBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CancelBookingDialog = ({
  roomId,
  booking,
  open,
  onOpenChange,
}: CancelBookingDialogProps) => {
  const { cancel } = useBookingMutations(roomId);

  const onCancel = () => {
    cancel.mutate(booking.id, {
      onSuccess: () => {
        toast.success("Бронювання скасовано");
        onOpenChange(false);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Скасувати бронювання?</AlertDialogTitle>
          <AlertDialogDescription>
            Учасники більше не побачать це бронювання. Цю дію не можна
            скасувати.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Назад</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onCancel}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? "Скасовуємо..." : "Скасувати бронювання"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
