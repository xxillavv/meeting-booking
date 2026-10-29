import "server-only";
import type { TRoomWithCount } from "@/hooks/rooms/rooms.types";
import { serverFetch } from "./server-api";

export const getRooms = () => serverFetch<TRoomWithCount[]>("/rooms");

export const getRoom = (id: string) =>
  serverFetch<TRoomWithCount>(`/rooms/${id}`);
