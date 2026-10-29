import { Badge } from "@/components/ui/badge";
import { TBooking } from "@/hooks/bookings/bookings.types";
import { formatTimeRange } from "@/lib/dates";
import { BookingActions } from "./BookingActions";
import { JoinBookingButton } from "./JoinBookingButton";

type BookingItemProps = {
  roomId: string;
  booking: TBooking;
  isAdmin: boolean;
  isOngoing: boolean;
};

export const BookingItem = ({
  roomId,
  booking,
  isAdmin,
  isOngoing,
}: BookingItemProps) => {
  return (
    <li className="flex items-start gap-4 rounded-lg border p-3">
      <div className="w-24 shrink-0 font-medium tabular-nums">
        {formatTimeRange(booking.startTime, booking.endTime)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">
            {booking.description || "Без опису"}
          </p>
          {isOngoing && <Badge variant="secondary">Зараз</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          {booking.createdBy.name} · Учасників: {booking.participants.length}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <JoinBookingButton roomId={roomId} booking={booking} />
        {isAdmin && <BookingActions roomId={roomId} booking={booking} />}
      </div>
    </li>
  );
};
