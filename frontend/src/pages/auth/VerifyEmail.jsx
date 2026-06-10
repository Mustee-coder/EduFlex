import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useSendOtp } from "@/hooks/useSendOtp";

const VerifyEmail = () => {
const navigate = useNavigate();

const { mutate: verifyOtp, isPending } = useVerifyOtp();
const { mutate: resendOtp, isPending: resendLoading } = useSendOtp();

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

// Backspace support
const handleKeyDown = (e, index) => {
if (
e.key === "Backspace" &&
!otp[index] &&
index > 0
) {
inputsRef.current[index - 1]?.focus();
}
};

// Paste support
const handlePaste = (e) => {
const pastedData = e.clipboardData
.getData("text")
.trim()
.slice(0, 6);

if (!/^\d+$/.test(pastedData)) return;

const otpArray = pastedData
  .split("")
  .slice(0, 6);

const filledOtp = [...otp];

otpArray.forEach((digit, index) => {
  filledOtp[index] = digit;
});

setOtp(filledOtp);

};

// Verify OTP
const handleSubmit = (e) => {
e.preventDefault();

const finalOtp = otp.join("");

if (finalOtp.length !== 6) return;

verifyOtp(
  {
    email,
    otp: finalOtp,
  },
  {
    onSuccess: () => {
      localStorage.setItem(
        "verifiedEmail",
        email
      );

      navigate("/signup");
    },
  }
);

};

// Resend OTP
const handleResend = () => {
resendOtp({ email });
};

return (
<div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">

  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Verify Email
      </h1>

      <p className="text-gray-500 mt-2">
        Enter the 6-digit code sent to
      </p>

      <p className="font-medium text-gray-700">
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
      ref={(el) => (inputsRef.current[index] = el)}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(e.target.value, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      onPaste={handlePaste}
      className="w-11 h-11 border border-gray-300 rounded-md text-center text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"/>
  ))}
</div>

      <button
        type="submit"
        disabled={
          isPending ||
          otp.join("").length !== 6
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
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
        className="mt-2 text-blue-600 font-medium hover:underline disabled:opacity-50"
      >
        {resendLoading
          ? "Sending..."
          : "Resend OTP"}
      </button>

    </div>

  </div>

</div>

);
};

export default VerifyEmail;