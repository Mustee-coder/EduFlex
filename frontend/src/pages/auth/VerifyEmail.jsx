import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useSendOtp } from "@/hooks/useSendOtp";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Loader, Clock, Mail } from "lucide-react";
import "@/index.css";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: resendLoading } = useSendOtp();

  const email = localStorage.getItem("signupEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const inputsRef = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/send-otp");
    }
  }, [email, navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer(resendTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      setError("Please paste only numbers");
      return;
    }

    const otpArray = pastedData.split("");
    const updatedOtp = [...otp];

    otpArray.forEach((digit, index) => {
      if (index < 6) updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setError("");

    // Focus last input
    if (otpArray.length === 6) {
      inputsRef.current[5]?.focus();
    }
  };

  // Verify OTP
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    verifyOtp(
      { email, otp: finalOtp },
      {
        onSuccess: (data) => {
          toast.success("Email verified successfully! 🎉");
          setIsVerified(true);

          localStorage.setItem("verifiedEmail", email);

          setTimeout(() => {
            navigate("/signup", { state: { email } });
          }, 1500);
        },

        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message || "Invalid OTP. Please try again.";
          toast.error(errorMsg);
          setError(errorMsg);
          setOtp(["", "", "", "", "", ""]);
          inputsRef.current[0]?.focus();
        },
      }
    );
  };

  // Resend OTP
  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP resent to your email! 📧");
          setResendTimer(30);
          setOtp(["", "", "", "", "", ""]);
          setError("");
          inputsRef.current[0]?.focus();
        },

        onError: (error) => {
          const errorMsg =
            error?.response?.data?.message || "Failed to resend OTP";
          toast.error(errorMsg);
          setError(errorMsg);
        },
      }
    );
  };

  // Success state
  if (isVerified) {
    return (
      <AuthLayout title="Email Verified!" subtitle="Account created successfully">
        <div className="space-y-6">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <p className="text-gray-600 font-semibold">Email verified!</p>
            <p className="text-sm text-gray-600">
              Your account is ready. Redirecting to signup...
            </p>
          </motion.div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      
      <AuthLayout
        title="Verify Your Email"
        subtitle="Enter the 6-digit code sent to your email"
      >
        <div className="verify-root space-y-6">
          {/* Email Display */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 rounded-xl border border-indigo-200 p-4"
          >
            <div className="flex items-center gap-3 justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div className="text-center">
                <p className="text-xs text-indigo-600 font-semibold">Code sent to:</p>
                <p className="text-sm font-bold text-indigo-700 break-all">{email}</p>
              </div>
            </div>
          </motion.div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600">
                Verification Code
              </label>

              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${index + 1}`}
                    className={`edu-focus-ring otp-input w-12 h-12 md:w-14 md:h-14 border-2 rounded-xl bg-white text-gray-900 text-center text-2xl font-bold focus:outline-none transition-all ${
                      error
                        ? "border-red-600 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : digit
                        ? "border-emerald-600 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                        : "border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                ))}
              </div>

              {/* Helper Text */}
              <p className="text-xs text-gray-500 text-center">
                💡 You can paste the entire code
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={otp.join("").length === 6 && !isPending ? { scale: 1.02 } : {}}
              whileTap={otp.join("").length === 6 && !isPending ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isPending || otp.join("").length !== 6}
              className="edu-focus-ring w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Resend OTP */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendTimer > 0}
              className="edu-focus-ring w-full px-4 py-3 border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resendLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendTimer > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  Resend in {resendTimer}s
                </>
              ) : (
                "Resend OTP"
              )}
            </button>
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="edu-focus-ring rounded-sm text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default VerifyEmail;
