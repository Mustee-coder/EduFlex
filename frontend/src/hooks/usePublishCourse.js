import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { publishCourse } from "@/services/courseService";

export const usePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, status }) =>
      publishCourse({ courseId, status }),

    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.setQueryData(["course", variables.courseId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            courseDetails: {
              ...oldData.data?.courseDetails,
              status: variables.status,
            },
          },
        };
      });

      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["instructor-courses"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update course status"
      );
    },
  });
};