import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { createCourse } from "@/services/courseService";
import { toast } from "react-toastify";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,

    onSuccess: () => {
      toast.success("Course created successfully 🎉");

      queryClient.invalidateQueries({
        queryKey: ["instructor-courses"],
      });
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to create course"
      );
    },
  });
};