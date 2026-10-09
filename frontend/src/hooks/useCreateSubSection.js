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
      const status = error?.response?.status;
      const code = error?.code;
      console.error("[createSubSection] request failed", {
        ...(Number.isInteger(status) ? { status } : {}),
        ...(typeof code === "string" && /^[A-Z0-9_]{1,40}$/.test(code)
          ? { code }
          : {}),
      });

      toast.error(
        error?.response?.data?.message || "Failed to create lesson"
      );
    },
  });
};
