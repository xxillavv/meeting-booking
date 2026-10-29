import { Suspense } from "react";
import type { Metadata } from "next";
import { CreateRoomDialog } from "@/components/rooms/CreateRoomDialog";
import { RoomsList, RoomsListSkeleton } from "@/components/rooms/RoomsList";

export const metadata: Metadata = {
  title: "Мої кімнати",
};

export default function RoomsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Мої кімнати</h1>
          <p className="text-sm text-muted-foreground">
            Кімнати, у яких ви адміністратор або учасник
          </p>
        </div>
        <CreateRoomDialog />
      </div>

      <Suspense fallback={<RoomsListSkeleton />}>
        <RoomsList />
      </Suspense>
    </div>
  );
}
