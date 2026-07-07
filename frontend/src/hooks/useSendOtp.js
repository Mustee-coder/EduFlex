import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/services/authService";
import { toast } from "sonner";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,

    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent successfully 🚀");
    },

    onError: (error) => {

  toast.error(
    error?.response?.data?.message || "Failed to send OTP"
  );

    },
  });
};