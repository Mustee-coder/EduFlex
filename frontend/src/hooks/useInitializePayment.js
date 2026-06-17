import { useMutation } from "@tanstack/react-query";
import { initializePayment } from "@/services/paymentService";
import { toast } from "sonner";

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: initializePayment,

    onSuccess: (data) => {
      toast.success("Redirecting to payment... 💳");

      const url = data?.data?.authorization_url;

      if (url) {
        window.location.href = url;
      }
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Payment failed"
      );
    },
  });
};
