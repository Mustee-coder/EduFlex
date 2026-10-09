import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/services/courseService";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    onSuccess: () => {
      // refresh instructor courses after delete
      queryClient.invalidateQueries(["instructor-courses"]);
    },

    onError: (error) => {
      const status = error?.response?.status;
      const code = error?.code;
      console.error("[deleteCourse] request failed", {
        ...(Number.isInteger(status) ? { status } : {}),
        ...(typeof code === "string" && /^[A-Z0-9_]{1,40}$/.test(code)
          ? { code }
          : {}),
      });
    },
  });
};
