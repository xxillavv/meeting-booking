import "server-only";
import { notFound } from "next/navigation";
import { z } from "zod";
import type { TRoomWithCount } from "@/hooks/rooms/rooms.types";
import { serverFetch } from "./server-api";

export const getRooms = () => serverFetch<TRoomWithCount[]>("/rooms");

export const getRoom = (id: string) => {
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  return serverFetch<TRoomWithCount>(`/rooms/${id}`);
};
