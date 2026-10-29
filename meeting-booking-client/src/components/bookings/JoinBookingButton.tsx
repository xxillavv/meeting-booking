"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBookingMutations } from "@/hooks/bookings/bookings.hook";
import { TBooking } from "@/hooks/bookings/bookings.types";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";

type JoinBookingButtonProps = {
  roomId: string;
  booking: TBooking;
};

const getParticipationError = (error: unknown) => {
  if (getErrorStatus(error) === 400) return "Бронювання вже завершилося";

  return getErrorMessage(error);
};

export const JoinBookingButton = ({ roomId, booking }: JoinBookingButtonProps) => {
  const { join, leave } = useBookingMutations(roomId);
  const isPending = join.isPending || leave.isPending;

  const onJoin = () => {
    join.mutate(booking.id, {
      onSuccess: () => toast.success("Ви долучилися до бронювання"),
      onError: (error) => toast.error(getParticipationError(error)),
    });
  };

  const onLeave = () => {
    leave.mutate(booking.id, {
      onSuccess: () => toast.success("Ви вийшли з бронювання"),
      onError: (error) => toast.error(getParticipationError(error)),
    });
  };

  if (booking.isParticipant) {
    return (
      <Button variant="outline" size="sm" onClick={onLeave} disabled={isPending}>
        Вийти
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={onJoin} disabled={isPending}>
      Долучитися
    </Button>
  );
};
