import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubSection } from "@/services/courseService";
import { toast } from "react-toastify";

export const useDeleteSubSection = (courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubSection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseDetails", courseId],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete sub-section");
    },
  });
};
