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
      console.log(
        "DELETE ERROR:",
        error.response?.data || error.message
      );
    },
  });
};