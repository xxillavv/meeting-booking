import { TRoomRole } from "@/hooks/rooms/rooms.types";

export type TRoomMember = {
  role: TRoomRole;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type TAddMember = {
  email: string;
  role: TRoomRole;
};
