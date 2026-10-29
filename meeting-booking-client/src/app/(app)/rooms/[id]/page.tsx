import type { Metadata } from "next";
import { RoomHeader } from "@/components/rooms/RoomHeader";
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
  const room = await getRoom(id);

  return <RoomHeader room={room} />;
}
