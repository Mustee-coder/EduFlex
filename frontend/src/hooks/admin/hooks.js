import { useQuery } from "@tanstack/react-query";
import {
  getAdminStats,
  getAllStudents,
  getAllInstructors,
} from "@/services/adminService";


export const useAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });
};


export const useAllStudents = () => {
  return useQuery({
    queryKey: ["allStudents"],
    queryFn: getAllStudents,
  });
};
export const useAllInstructors = () => {
  return useQuery({
    queryKey: ["allInstructors"],
    queryFn: getAllInstructors,
  });
};
