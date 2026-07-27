import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { toast } from "sonner";
import { Mail, AlertCircle, Loader, CheckCircle, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate, isPending } = useForgotPassword();

  // ━━ EMAIL VALIDATION ━━
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailValue.trim());
    setIsValidEmail(isValid);

    if (!emailValue.trim()) {
      setError("Email address is required");
    } else if (!isValid) {
      setError("Please enter a valid email address");
    } else {
      setError("");
    }

    return isValid;
  };

  // ━━ HANDLERS ━━
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value.trim()) {
      validateEmail(value);
    } else {
      setError("");
      setIsValidEmail(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    // Validate
    if (!validateEmail(normalizedEmail)) {
      return;
    }

    mutate(normalizedEmail, {
      onSuccess: (data) => {
        toast.success(data?.message || "Reset link sent! 📧");

        // Show success state
        setIsSubmitted(true);

        // Save email for reference
        localStorage.setItem("resetEmail", normalizedEmail);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },

      onError: (error) => {
        const errorMsg =
          error?.response?.data?.message ||
          "Failed to send reset link. Please try again.";

        toast.error(errorMsg);
        setError(errorMsg);
      },
    });
  };

  const isFormValid = email.trim() && isValidEmail && !isPending;

  // ━━ SUCCESS STATE ━━
  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="Password reset instructions sent"
      >
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
            className="space-y-3 text-center"
          >
            <p className="text-gray-700 font-semibold">
              We've sent a password reset link to:
            </p>
            <p className="text-sm text-indigo-600 font-bold break-all">
              {email}
            </p>
            <p className="text-sm text-gray-600">
              Check your email (and spam folder) for instructions. The link expires in 24 hours.
            </p>
          </motion.div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-bold">💡 Tip:</span> If you don't see the email, check your spam folder or request a new link.
            </p>
          </div>

          {/* Back to Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </motion.button>

          {/* Redirecting message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-500"
          >
            Redirecting to login in a moment...
          </motion.p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');

        .forgotpassword-root {
          font-family: 'Poppins', sans-serif;
        }

        .forgotpassword-title {
          font-family: 'Syne', sans-serif;
        }

        .input-field {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-message {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <AuthLayout
        title="Forgot Password?"
        subtitle="Enter your email to receive a password reset link"
      >
        <div className="forgotpassword-root space-y-6">
          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  aria-label="Email address"
                  aria-describedby={error ? "email-error" : undefined}
                  aria-invalid={!!error}
                  className={`input-field w-full pl-12 pr-12 py-3 border-2 rounded-xl font-medium text-sm focus:outline-none transition-all ${
                    error
                      ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : isValidEmail
                      ? "border-emerald-500 bg-emerald-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                      : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  }`}
                />

                {/* Validation Icon */}
                {email.trim() && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {error ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : isValidEmail ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : null}
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="text-red-600 text-xs font-semibold flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.p>
              )}

              {isValidEmail && !error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-600 text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle size={14} />
                  Email is valid
                </motion.p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-bold">🔐 Secure:</span> We'll send you a link to reset your password. You'll need to verify it's really you.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Reset Link
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors"
            >
              Back to Login
            </button>
          </p>

          {/* Security Info */}
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            Your password reset link will expire in <span className="font-semibold">24 hours</span> for security reasons.
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
