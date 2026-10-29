"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/auth.hook";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      <LogOutIcon />
      Вийти
    </Button>
  );
};
