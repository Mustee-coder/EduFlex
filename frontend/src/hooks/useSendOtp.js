import { useMutation } from "@tanstack/react-query";
import { sendOtp } from "@/services/authService";

export const useSendOtp = () => useMutation({ mutationFn: sendOtp });
