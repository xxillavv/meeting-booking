import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createRoom, deleteRoom, updateRoom } from "./rooms.service";
import { TUpdateRoom } from "./rooms.types";

export const useRoomMutations = () => {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => router.refresh(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: TUpdateRoom }) =>
      updateRoom(id, body),
    onSuccess: () => router.refresh(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      router.push("/rooms");
      router.refresh();
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
};
