"use client";

import { Button } from "@/components/ui/button";

export default function RoomsError({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-medium">Не вдалося завантажити кімнати</p>
      <p className="text-sm text-muted-foreground">
        Перевірте з&apos;єднання і спробуйте ще раз
      </p>
      <Button variant="outline" onClick={() => retry()}>
        Спробувати ще раз
      </Button>
    </div>
  );
}
