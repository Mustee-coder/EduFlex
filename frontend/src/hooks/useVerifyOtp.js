import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/services/authService";
import { toast } from "sonner";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,

    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified successfully 🚀");
    },

    onError: (error) => {
      console.log("FULL ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to verify OTP"
      );
    },
  });
};