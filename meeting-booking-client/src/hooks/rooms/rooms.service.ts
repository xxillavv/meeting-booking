import { api } from "@/lib/axios";
import { TCreateRoom, TRoom, TUpdateRoom } from "./rooms.types";

export const createRoom = async (body: TCreateRoom): Promise<TRoom> => {
  const { data } = await api.post<TRoom>("/rooms", body);
  return data;
};

export const updateRoom = async (id: string, body: TUpdateRoom): Promise<void> => {
  await api.patch(`/rooms/${id}`, body);
};

export const deleteRoom = async (id: string): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};
