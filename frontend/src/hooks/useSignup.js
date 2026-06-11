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
      console.log("SIGNUP ERROR FULL:", error); // 🔥 IMPORTANT DEBUG

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed ❌";

      toast.error(message);
      onError?.(error);
    },
  });
};