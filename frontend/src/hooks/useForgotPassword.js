import { useMutation } from "@tanstack/react-query";
import { resetPasswordToken } from "@/services/resetPasswordService";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: resetPasswordToken,
  });
};