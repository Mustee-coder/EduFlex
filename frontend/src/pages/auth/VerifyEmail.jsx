import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useSendOtp } from "@/hooks/useSendOtp";

const VerifyEmail = () => {
  const navigate = useNavigate();

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const {
    mutate: resendOtp,
    isPending: resendLoading,
  } = useSendOtp();

  const email = localStorage.getItem("signupEmail");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputsRef = useRef([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/send-otp");
    }
  }, [email, navigate]);

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pastedData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const otpArray = pastedData.split("");

    const updatedOtp = [...otp];

    otpArray.forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
  };

  // Verify OTP
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    verifyOtp(
      {
        email,
        otp: finalOtp,
      },
      {
        onSuccess: () => {
          toast.success(
            "Email verified successfully 🎉"
          );

          localStorage.setItem(
            "verifiedEmail",
            email
          );

          navigate("/signup");
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "Invalid OTP"
          );
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
          toast.success(
            "OTP sent successfully 🎉"
          );
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to resend OTP"
          );
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <div className="text-center mb-6">
        <p className="text-gray-500">
          Verification code sent to
        </p>

        <p className="font-semibold text-gray-700">
          {email}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) =>
                (inputsRef.current[index] = el)
              }
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(
                  e.target.value,
                  index
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
              className="w-12 h-12 border rounded-xl text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={
            isPending ||
            otp.join("").length !== 6
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {isPending
            ? "Verifying..."
            : "Verify OTP"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Didn't receive the code?
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-2 text-blue-600 hover:underline font-medium disabled:opacity-50"
        >
          {resendLoading
            ? "Sending..."
            : "Resend OTP"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign In
        </button>
      </p>
    </AuthLayout>
  );
};

export default VerifyEmail;