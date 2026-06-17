import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/services/courseService";

export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });
};