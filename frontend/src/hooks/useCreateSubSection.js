import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubSection } from "@/services/courseService";
import { toast } from "react-toastify";

export const useCreateSubSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubSection,

    onSuccess: () => {
      toast.success("Lesson created successfully");
      

      queryClient.invalidateQueries({
        queryKey: ["full-course-details"],
      });
    },

    onError: (error) => {
  console.log(error);
  console.log(error?.response?.data);

  toast.error(
    error?.response?.data?.message || "Failed to create lesson"
  );
},
  });
};