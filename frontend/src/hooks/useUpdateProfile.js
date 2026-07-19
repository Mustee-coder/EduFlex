import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/profileServices";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["userDetails"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile"
      );
    },
  });
};