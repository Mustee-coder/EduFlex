import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseProgress } from "@/services/courseService";

export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, subSectionId }) =>
      updateCourseProgress(courseId, subSectionId),

    onSuccess: (data, variables) => {
      const courseId = variables.courseId;

      // ✅ Update cache only — NO invalidateQueries
      // invalidateQueries was overwriting our update with stale GET data
      queryClient.setQueryData(
        ["course-details", courseId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              courseProgress: {
                ...oldData.data?.courseProgress,
                ...data,
              },
            },
          };
        }
      );
    },

    onError: (error) => {
      console.error("Progress update failed:", error.message);
    },
  });
};