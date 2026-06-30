import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubSection } from "@/services/courseService";

export const useDeleteSubSection = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubSection,
    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: ["courseDetails", courseId],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete sub-section");
    },
  });
};