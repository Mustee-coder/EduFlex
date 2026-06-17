import { useQuery } from "@tanstack/react-query";
import { getFullCoursedetails } from "../services/courseService";

export const useFullCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ["fullCourseDetails", courseId],
    queryFn: () => getFullCoursedetails(courseId),
    enabled: !!courseId,
  });
};
