import { getMe } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export const UserMenu = async () => {
  const user = await getMe();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
};
