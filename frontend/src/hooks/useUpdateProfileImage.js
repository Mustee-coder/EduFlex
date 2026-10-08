import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "@/services/profileServices";
import { useAuth } from "@/context/AuthContext";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: updateProfileImage,

    onSuccess: (data) => {
      updateUser(data.data);

      queryClient.invalidateQueries({
        queryKey: ["userDetails"],
      });
    },
  });
};