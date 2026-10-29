import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  getBookings,
  joinBooking,
  leaveBooking,
  updateBooking,
} from "./bookings.service";
import { TUpdateBooking } from "./bookings.types";

const bookingsKey = (roomId: string) => ["rooms", roomId, "bookings"];

export const useBookings = (roomId: string) => {
  return useQuery({
    queryKey: bookingsKey(roomId),
    queryFn: () => getBookings(roomId),
  });
};

export const useBookingMutations = (roomId: string) => {
  const queryClient = useQueryClient();

  const refreshBookings = () => {
    return queryClient.invalidateQueries({ queryKey: bookingsKey(roomId) });
  };

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: refreshBookings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: TUpdateBooking }) =>
      updateBooking(id, body),
    onSuccess: refreshBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: refreshBookings,
  });

  const joinMutation = useMutation({
    mutationFn: joinBooking,
    onSuccess: refreshBookings,
  });

  const leaveMutation = useMutation({
    mutationFn: leaveBooking,
    onSuccess: refreshBookings,
  });

  return {
    create: createMutation,
    update: updateMutation,
    cancel: cancelMutation,
    join: joinMutation,
    leave: leaveMutation,
  };
};
