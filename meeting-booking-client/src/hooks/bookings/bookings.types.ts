export type TBookingUser = {
  id: string;
  name: string;
  email: string;
};

export type TBooking = {
  id: string;
  roomId: string;
  description: string | null;
  startTime: string;
  endTime: string;
  createdBy: { id: string; name: string };
  participants: TBookingUser[];
  isParticipant: boolean;
};

export type TCreateBooking = {
  roomId: string;
  startTime: string;
  endTime: string;
  description?: string;
};

export type TUpdateBooking = Partial<Omit<TCreateBooking, "roomId">>;

export type TBookingForm = {
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
};
