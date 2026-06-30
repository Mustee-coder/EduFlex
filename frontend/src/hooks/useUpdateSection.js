
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection } from "@/services/courseService";
import { toast } from "react-toastify";

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSection,

    onSuccess: () => {
      toast.success("Section updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["full-course-details"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update section"
      );
    },
  });
};
 