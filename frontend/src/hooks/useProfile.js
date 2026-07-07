import { useQuery } from "@tanstack/react-query";
import {
  getUserDetails,
  getEnrolledCourses,
} from "@/services/profileServices.js";

export const useUserDetails = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      console.log("Fetching user details...");
      const res = await getUserDetails();
      return res;
    },
  });
};

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: async () => {
      console.log("Fetching enrolled courses...");
      const res = await getEnrolledCourses();
      return res;
    },
  });
};