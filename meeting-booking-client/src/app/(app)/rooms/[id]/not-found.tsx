import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <SearchXIcon className="size-10 text-muted-foreground" />
      <p className="font-medium">Кімнату не знайдено</p>
      <p className="text-sm text-muted-foreground">
        Можливо, її видалили або у вас немає до неї доступу
      </p>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/rooms" />}
      >
        До моїх кімнат
      </Button>
    </div>
  );
}
