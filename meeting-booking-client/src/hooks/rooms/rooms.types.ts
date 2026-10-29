export type TRoomRole = "ADMIN" | "USER";

export type TRoom = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  role: TRoomRole;
};

export type TRoomWithCount = TRoom & {
  _count: { members: number };
};

export type TCreateRoom = {
  name: string;
  description?: string;
};

export type TUpdateRoom = Partial<TCreateRoom>;
