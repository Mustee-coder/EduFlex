import { useQuery } from "@tanstack/react-query";
import { getCourseDetails } from "@/services/courseService";

export const useGetCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId,
  });
};
