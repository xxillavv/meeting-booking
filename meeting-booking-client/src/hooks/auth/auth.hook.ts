import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser, logoutUser, registerUser } from "./auth.service";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onAuthSuccess = () => {
    router.push("/rooms");
    router.refresh();
  };

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: onAuthSuccess,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: onAuthSuccess,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });

  return {
    register: registerMutation,
    login: loginMutation,
    logout: logoutMutation,
  };
};
