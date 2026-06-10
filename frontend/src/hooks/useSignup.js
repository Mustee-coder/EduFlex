import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/services/authService.js";
import { toast } from "sonner";

export const useSignup = (options) => {
  const { onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: signupUser,

    onSuccess: (data) => {
      toast.success(data?.message || "Account created successfully 🚀");
      onSuccess?.(data);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Signup failed ❌");
      onError?.(error);
    },
  });
};