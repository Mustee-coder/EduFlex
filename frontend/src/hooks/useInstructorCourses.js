import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/services/courseService";

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructor-courses"],
    queryFn: async () => {
      try {
        const res = await getInstructorCourses();
        console.log("INSTRUCTOR API:", res);
        return res;
      } catch (err) {
        console.log("INSTRUCTOR ERROR:", err.response?.data || err.message);
        throw err;
      }
    },
  });
};