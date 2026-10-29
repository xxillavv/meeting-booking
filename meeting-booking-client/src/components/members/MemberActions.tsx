"use client";

import { EllipsisVerticalIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemberMutations } from "@/hooks/members/members.hook";
import { TRoomMember } from "@/hooks/members/members.types";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";

type MemberActionsProps = {
  roomId: string;
  member: TRoomMember;
};

const getMemberError = (error: unknown) => {
  if (getErrorStatus(error) === 400) {
    return "У кімнаті має залишитися хоча б один адмін";
  }

  return getErrorMessage(error);
};

export const MemberActions = ({ roomId, member }: MemberActionsProps) => {
  const { updateRole, remove } = useMemberMutations(roomId);
  const isAdmin = member.role === "ADMIN";

  const onToggleRole = () => {
    updateRole.mutate(
      { userId: member.user.id, role: isAdmin ? "USER" : "ADMIN" },
      {
        onSuccess: () => toast.success("Роль змінено"),
        onError: (error) => toast.error(getMemberError(error)),
      },
    );
  };

  const onRemove = () => {
    remove.mutate(member.user.id, {
      onSuccess: () => toast.success("Учасника видалено"),
      onError: (error) => toast.error(getMemberError(error)),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" />}
        aria-label={`Дії з ${member.user.name}`}
      >
        <EllipsisVerticalIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onToggleRole}>
          {isAdmin ? "Зробити учасником" : "Зробити адміном"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onRemove}>
          Видалити з кімнати
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
