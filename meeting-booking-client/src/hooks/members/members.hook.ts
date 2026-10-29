import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TRoomRole } from "@/hooks/rooms/rooms.types";
import {
  addMember,
  getMembers,
  removeMember,
  updateMemberRole,
} from "./members.service";
import { TAddMember } from "./members.types";

const membersKey = (roomId: string) => ["rooms", roomId, "members"];

export const useRoomMembers = (roomId: string) => {
  return useQuery({
    queryKey: membersKey(roomId),
    queryFn: () => getMembers(roomId),
  });
};

export const useMemberMutations = (roomId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const refreshMembers = async () => {
    await queryClient.invalidateQueries({ queryKey: membersKey(roomId) });
    router.refresh();
  };

  const addMutation = useMutation({
    mutationFn: (body: TAddMember) => addMember(roomId, body),
    onSuccess: refreshMembers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: TRoomRole }) =>
      updateMemberRole(roomId, userId, role),
    onSuccess: refreshMembers,
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeMember(roomId, userId),
    onSuccess: refreshMembers,
  });

  return {
    add: addMutation,
    updateRole: updateRoleMutation,
    remove: removeMutation,
  };
};
