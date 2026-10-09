import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/services/courseService";

export const useGetAllCourses = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["courses", page, limit],
    queryFn: () => getAllCourses(page, limit),
    placeholderData: (previousData) => previousData,
  });
};
