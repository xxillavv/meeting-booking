import { Badge } from "@/components/ui/badge";
import { TRoomRole } from "@/hooks/rooms/rooms.types";

export const ROLE_LABELS: Record<TRoomRole, string> = {
  ADMIN: "Адмін",
  USER: "Учасник",
};

export const RoleBadge = ({ role }: { role: TRoomRole }) => {
  return (
    <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
      {ROLE_LABELS[role]}
    </Badge>
  );
};
