import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateSubSection } from "@/services/courseService";

export const useUpdateSubSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubSection,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
};