import Link from "next/link";
import { ArrowLeftIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRoomWithCount } from "@/hooks/rooms/rooms.types";
import { DeleteRoomDialog } from "./DeleteRoomDialog";
import { EditRoomDialog } from "./EditRoomDialog";

export const RoomHeader = ({ room }: { room: TRoomWithCount }) => {
  const isAdmin = room.role === "ADMIN";

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/rooms"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Мої кімнати
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">{room.name}</h1>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Адмін" : "Учасник"}
            </Badge>
          </div>
          {room.description && (
            <p className="max-w-2xl text-muted-foreground">{room.description}</p>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="size-4" />
            Учасників: {room._count.members}
          </span>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <EditRoomDialog room={room} />
            <DeleteRoomDialog room={room} />
          </div>
        )}
      </div>
    </div>
  );
};
