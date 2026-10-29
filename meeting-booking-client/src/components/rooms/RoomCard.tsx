import Link from "next/link";
import { UsersIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TRoomWithCount } from "@/hooks/rooms/rooms.types";
import { RoleBadge } from "./RoleBadge";

export const RoomCard = ({ room }: { room: TRoomWithCount }) => {
  return (
    <Link href={`/rooms/${room.id}`} className="group">
      <Card className="h-full transition-colors group-hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="line-clamp-1">{room.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {room.description || "Без опису"}
          </CardDescription>
        </CardHeader>

        <CardFooter className="mt-auto justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersIcon className="size-4" />
            {room._count.members}
          </span>
          <RoleBadge role={room.role} />
        </CardFooter>
      </Card>
    </Link>
  );
};
