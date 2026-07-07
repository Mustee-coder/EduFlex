import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "@/services/paymentService";
import { toast } from "sonner";

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: verifyPayment,

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Payment verification failed"
      );
    },
  });
};