import { useQuery } from "@tanstack/react-query";
import { getEnrollmentTrend } from "@/services/profileServices";

export const useEnrollmentTrend = () => {
  return useQuery({
    queryKey: ["enrollment-trend"],
    queryFn: getEnrollmentTrend,
  });
};