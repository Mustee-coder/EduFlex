import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSendOtp } from "@/hooks/useSendOtp";
import { toast } from "sonner";
import {
  Mail,
  AlertCircle,
  Loader,
  CheckCircle,
} from "lucide-react";
import "@/index.css";

const SendOtp = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useSendOtp();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);


  const checkEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );
  };


  const handleChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (!value.trim()) {
      setError("");
      setIsValidEmail(false);
      return;
    }

    const valid = checkEmail(value);

    setIsValidEmail(valid);

    setError(
      valid
        ? ""
        : "Please enter a valid email address"
    );
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();


    if (!normalizedEmail) {
      setError("Email address is required");
      return;
    }


    if (!checkEmail(normalizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }


    mutate(
      {
        email: normalizedEmail,
      },
      {
        onSuccess: () => {
          toast.success(
            "OTP sent to your email! 📧"
          );


          localStorage.setItem(
            "signupEmail",
            normalizedEmail
          );


          setEmail("");
          setError("");


          navigate("/verify-email", {
            state: {
              email: normalizedEmail,
            },
          });
        },


        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            "Failed to send OTP. Please try again.";


          toast.error(message);
          setError(message);
        },
      }
    );
  };


  const isFormValid = Boolean(
    email.trim() &&
    isValidEmail &&
    !isPending
  );


  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Enter your email to get started"
    >

      <div className="sendotp-root space-y-6">


        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />

            <p className="text-red-600 text-sm font-semibold">
              {error}
            </p>
          </motion.div>
        )}



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Email Address
            </label>


            <div className="relative">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>


              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`edu-focus-ring w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-white text-gray-900 placeholder:text-gray-500 text-sm font-medium focus:outline-none transition ${
                  error
                    ? "border-red-600 bg-red-50"
                    : isValidEmail
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 focus:border-indigo-600"
                }`}
              />


              {email.trim() && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">

                  {error ? (
                    <AlertCircle className="w-5 h-5 text-red-600"/>
                  ) : isValidEmail ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600"/>
                  ) : null}

                </div>
              )}

            </div>


            {isValidEmail && !error && (
              <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle size={14}/>
                Email is valid
              </p>
            )}

          </div>



          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">

            <p className="text-xs text-indigo-600">
              📧 We will send a verification code to confirm your email address.
            </p>

          </div>



          <motion.button
            whileHover={
              isFormValid
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              isFormValid
                ? { scale: 0.98 }
                : {}
            }
            type="submit"
            disabled={!isFormValid || isPending}
            className="edu-focus-ring w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >

            {isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin"/>
                Sending OTP...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4"/>
                Send Verification Code
              </>
            )}

          </motion.button>


        </form>



        <p className="text-center text-sm text-gray-600">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="edu-focus-ring rounded-sm text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
          >
            Sign In
          </button>

        </p>



      </div>

    </AuthLayout>
  );
};


export default SendOtp;
