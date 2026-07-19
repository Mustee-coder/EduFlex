import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/services/profileServices";
import { toast } from "sonner";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,

    onSuccess: (data) => {
      toast.success(
        data?.message || "Profile image updated successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["userDetails"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update profile image"
      );
    },
  });
};