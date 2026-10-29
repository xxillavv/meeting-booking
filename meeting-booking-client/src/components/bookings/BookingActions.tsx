"use client";

import { useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TBooking } from "@/hooks/bookings/bookings.types";
import { BookingFormDialog } from "./BookingFormDialog";
import { CancelBookingDialog } from "./CancelBookingDialog";

type BookingActionsProps = {
  roomId: string;
  booking: TBooking;
};

export const BookingActions = ({ roomId, booking }: BookingActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" />}
          aria-label="Дії з бронюванням"
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Редагувати
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsCancelOpen(true)}
          >
            Скасувати бронювання
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BookingFormDialog
        roomId={roomId}
        booking={booking}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <CancelBookingDialog
        roomId={roomId}
        booking={booking}
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
      />
    </>
  );
};
