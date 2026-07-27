import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/authService";
import { toast } from "sonner";

export const useChangePassword = () => {

  return useMutation({
    mutationFn: changePassword,

    onSuccess: (data) => {
      toast.success(
        data?.message || "Password changed successfully"
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to change password"
      );
    },
  });

};