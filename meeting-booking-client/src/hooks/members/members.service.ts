import { api } from "@/lib/axios";
import { TRoomRole } from "@/hooks/rooms/rooms.types";
import { TAddMember, TRoomMember } from "./members.types";

export const getMembers = async (roomId: string): Promise<TRoomMember[]> => {
  const { data } = await api.get<TRoomMember[]>(`/rooms/${roomId}/members`);
  return data;
};

export const addMember = async (roomId: string, body: TAddMember): Promise<void> => {
  await api.post(`/rooms/${roomId}/members`, body);
};

export const updateMemberRole = async (
  roomId: string,
  userId: string,
  role: TRoomRole,
): Promise<void> => {
  await api.patch(`/rooms/${roomId}/members/${userId}`, { role });
};

export const removeMember = async (roomId: string, userId: string): Promise<void> => {
  await api.delete(`/rooms/${roomId}/members/${userId}`);
};
