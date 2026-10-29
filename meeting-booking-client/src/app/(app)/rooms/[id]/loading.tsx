import { Skeleton } from "@/components/ui/skeleton";

export default function RoomLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
  );
}
