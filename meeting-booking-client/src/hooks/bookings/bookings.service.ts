import { api } from "@/lib/axios";
import { TBooking, TCreateBooking, TUpdateBooking } from "./bookings.types";

export const getBookings = async (roomId: string): Promise<TBooking[]> => {
  const { data } = await api.get<TBooking[]>("/bookings", {
    params: { roomId },
  });
  return data;
};

export const createBooking = async (body: TCreateBooking): Promise<void> => {
  await api.post("/bookings", body);
};

export const updateBooking = async (id: string, body: TUpdateBooking): Promise<void> => {
  await api.patch(`/bookings/${id}`, body);
};

export const cancelBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};

export const joinBooking = async (id: string): Promise<void> => {
  await api.post(`/bookings/${id}/participants`);
};

export const leaveBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}/participants`);
};
