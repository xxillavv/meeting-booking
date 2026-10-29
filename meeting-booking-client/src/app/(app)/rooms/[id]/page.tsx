import type { Metadata } from "next";
import { MembersCard } from "@/components/members/MembersCard";
import { RoomHeader } from "@/components/rooms/RoomHeader";
import { getMe } from "@/lib/auth";
import { getRoom } from "@/lib/rooms";

export async function generateMetadata({
  params,
}: PageProps<"/rooms/[id]">): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoom(id);

  return { title: room.name };
}

export default async function RoomPage({ params }: PageProps<"/rooms/[id]">) {
  const { id } = await params;
  const [room, user] = await Promise.all([getRoom(id), getMe()]);

  return (
    <div className="flex flex-col gap-8">
      <RoomHeader room={room} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-start-3">
          <MembersCard
            roomId={room.id}
            isAdmin={room.role === "ADMIN"}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  );
}
