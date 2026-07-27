import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/services/profileServices";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: updateProfileImage,

    onSuccess: (data) => {
      toast.success(
        data?.message || "Profile image updated successfully"
      );
      updateUser(data.data);

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