import { useQuery } from "@tanstack/react-query";
import { getMyLearning } from "@/services/profileServices";

export const useMyLearning = () => {
  return useQuery({
    queryKey: ["my-learning"],
    queryFn: getMyLearning,

    // refech data everytime 
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};