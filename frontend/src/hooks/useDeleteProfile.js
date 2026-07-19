import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfile } from "@/services/profileServices";
import { toast } from "sonner";

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,

    onSuccess: (data) => {
      toast.success(
        data?.message || "Account deleted successfully"
      );

      queryClient.clear();
      localStorage.clear();

      window.location.href = "/login";
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete account"
      );
    },
  });
};