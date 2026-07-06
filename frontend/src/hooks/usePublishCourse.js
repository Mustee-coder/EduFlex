import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { publishCourse } from "@/services/courseService";

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, status }) =>
      publishCourse({ courseId, status }),

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update course status"
      );
    },
  });
};