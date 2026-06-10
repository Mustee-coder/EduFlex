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
  console.log("FULL ERROR:", error);
  console.log("BACKEND RESPONSE:", error?.response?.data);

  toast.error(
    error?.response?.data?.message || "Failed to send OTP"
  );

    },
  });
};