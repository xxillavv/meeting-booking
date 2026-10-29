"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoomMembers } from "@/hooks/members/members.hook";
import { RoleBadge } from "@/components/rooms/RoleBadge";
import { AddMemberForm } from "./AddMemberForm";
import { MemberActions } from "./MemberActions";

type MembersCardProps = {
  roomId: string;
  isAdmin: boolean;
  currentUserId: string;
};

export const MembersCard = ({
  roomId,
  isAdmin,
  currentUserId,
}: MembersCardProps) => {
  const { data: members, isPending, isError, refetch } = useRoomMembers(roomId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Учасники {members && `(${members.length})`}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isAdmin && <AddMemberForm roomId={roomId} />}

        {isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-start gap-2 text-sm">
            <p className="text-muted-foreground">
              Не вдалося завантажити учасників
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Спробувати ще раз
            </Button>
          </div>
        )}

        {members && (
          <ul className="flex flex-col divide-y">
            {members.map((member) => {
              const isMe = member.user.id === currentUserId;

              return (
                <li
                  key={member.user.id}
                  className="flex items-center gap-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {member.user.name}
                      {isMe && (
                        <span className="text-muted-foreground"> (ви)</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>

                  <RoleBadge role={member.role} />

                  {isAdmin && !isMe && (
                    <MemberActions roomId={roomId} member={member} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
