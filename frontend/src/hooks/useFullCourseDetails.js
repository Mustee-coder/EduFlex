import { useQuery } from "@tanstack/react-query";
import { getFullCourseDetails } from "@/services/courseService";

export const useFullCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ["full-course-details", courseId],
    queryFn: () => getFullCourseDetails(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
};