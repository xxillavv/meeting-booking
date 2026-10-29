import { Suspense } from "react";
import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";

const UserMenuSkeleton = () => (
  <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
);

export const Header = () => {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/rooms" className="flex items-center gap-2 font-semibold">
          <CalendarDaysIcon className="size-5" />
          Meeting Booking
        </Link>

        <Suspense fallback={<UserMenuSkeleton />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
};
