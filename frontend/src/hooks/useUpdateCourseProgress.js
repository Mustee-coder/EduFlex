import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourseProgress } from "@/services/courseService";

export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, subSectionId }) =>
      updateCourseProgress(courseId, subSectionId),

    onSuccess: (data, variables) => {
      const courseId = variables.courseId;

      const progressData = data?.data ?? data;

      // ✅ Instant UI update (no delay)
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
                ...progressData,
              },
            },
          };
        }
      );

      // 🔄 Sync other pages (dashboard, enrolled courses)
      queryClient.invalidateQueries({
        queryKey: ["enrolled-courses"],
      });
    },

    onError: (error) => {
      console.error("Progress update failed:", error.message);
    },
  });
};