import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      login(data);
    },
  });
};