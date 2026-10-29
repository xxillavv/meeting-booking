"use client";

import { useState } from "react";
import { CalendarXIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/bookings/bookings.hook";
import { TBooking } from "@/hooks/bookings/bookings.types";
import { formatDayLabel, toDateInputValue } from "@/lib/dates";
import { BookingFormDialog } from "./BookingFormDialog";
import { BookingItem } from "./BookingItem";

type BookingsCardProps = {
  roomId: string;
  isAdmin: boolean;
};

const groupByDay = (bookings: TBooking[]) => {
  const groups: Record<string, TBooking[]> = {};

  for (const booking of bookings) {
    const day = toDateInputValue(new Date(booking.startTime));
    groups[day] = [...(groups[day] ?? []), booking];
  }

  return Object.entries(groups);
};

const isOngoing = (booking: TBooking) =>
  new Date(booking.startTime).getTime() <= Date.now();

export const BookingsCard = ({ roomId, isAdmin }: BookingsCardProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: bookings, isPending, isError, refetch } = useBookings(roomId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Бронювання</CardTitle>
        {isAdmin && (
          <CardAction>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <PlusIcon />
              Нове бронювання
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-start gap-2 text-sm">
            <p className="text-muted-foreground">
              Не вдалося завантажити бронювання
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Спробувати ще раз
            </Button>
          </div>
        )}

        {bookings?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CalendarXIcon className="size-8 text-muted-foreground" />
            <p className="font-medium">Бронювань поки немає</p>
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? "Створіть перше бронювання для цієї кімнати"
                : "Коли адмін забронює кімнату, бронювання з'являться тут"}
            </p>
          </div>
        )}

        {bookings && bookings.length > 0 && (
          <div className="flex flex-col gap-6">
            {groupByDay(bookings).map(([day, dayBookings]) => (
              <section key={day} className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-muted-foreground first-letter:uppercase">
                  {formatDayLabel(day)}
                </h3>
                <ul className="flex flex-col gap-2">
                  {dayBookings.map((booking) => (
                    <BookingItem
                      key={booking.id}
                      roomId={roomId}
                      booking={booking}
                      isAdmin={isAdmin}
                      isOngoing={isOngoing(booking)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </CardContent>

      {isAdmin && (
        <BookingFormDialog
          roomId={roomId}
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      )}
    </Card>
  );
};
