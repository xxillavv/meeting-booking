import { DoorOpenIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getRooms } from "@/lib/rooms";
import { RoomCard } from "./RoomCard";

export const RoomsList = async () => {
  const rooms = await getRooms();

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <DoorOpenIcon className="size-10 text-muted-foreground" />
        <p className="font-medium">У вас ще немає кімнат</p>
        <p className="text-sm text-muted-foreground">
          Створіть першу кімнату або попросіть колегу додати вас до своєї
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export const RoomsListSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-36 rounded-xl" />
      ))}
    </div>
  );
};
