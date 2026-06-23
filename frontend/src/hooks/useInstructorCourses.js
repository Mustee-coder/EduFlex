import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/services/courseService";

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  });
};