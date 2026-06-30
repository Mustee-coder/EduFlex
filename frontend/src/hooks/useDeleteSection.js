import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteSection } from "@/services/courseService";

export const useDeleteSection = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSection,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
};