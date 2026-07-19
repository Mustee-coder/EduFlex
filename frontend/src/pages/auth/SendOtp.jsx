import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useSendOtp } from "@/hooks/useSendOtp";

const SendOtp = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { mutate, isPending } = useSendOtp();

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }

    mutate(
      { email: normalizedEmail },
      {
        onSuccess: () => {
          toast.success("OTP sent successfully 🎉");

          localStorage.setItem(
            "signupEmail",
            normalizedEmail
          );

          setEmail("");

          navigate("/verify-email");
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to send OTP"
          );
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter your email to receive a verification code"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={
            isPending || !email.trim()
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {isPending
            ? "Sending OTP..."
            : "Continue"}
        </button>
      </form>

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

export default SendOtp;