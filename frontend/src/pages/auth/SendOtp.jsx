import { useState } from "react";
import { useSendOtp } from "@/hooks/useSendOtp";
import { useNavigate } from "react-router-dom";

const SendOtp = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useSendOtp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    mutate(
      { email: normalizedEmail },
      {
        onSuccess: () => {
          localStorage.setItem("signupEmail", normalizedEmail);
          setEmail("");
          navigate("/verify-email");
        },
        onError: (error) => {
          alert(error?.response?.data?.message || "Failed to send OTP");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            disabled={!email.trim() || isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-60"
          >
            {isPending ? "Sending OTP..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendOtp;