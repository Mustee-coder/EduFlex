import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { useSignup } from "@/hooks/useSignup";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Loader, User, Mail, Lock } from "lucide-react";
import "@/index.css";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useSignup();
  const verifiedEmail = (
    location.state?.email || localStorage.getItem("verifiedEmail") || ""
  ).trim().toLowerCase();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: verifiedEmail,
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // ━━ VALIDATION ━━
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "First name is required";
        } else if (value.trim().length < 2) {
          newErrors.firstName = "First name must be at least 2 characters";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Last name is required";
        } else if (value.trim().length < 2) {
          newErrors.lastName = "Last name must be at least 2 characters";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = "Please enter a valid email";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = "Password must contain an uppercase letter";
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = "Password must contain a number";
        } else {
          delete newErrors.password;
        }

        // Calculate strength
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;
        setPasswordStrength(strength);

        // Check password match
        if (form.confirmPassword && value !== form.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else if (form.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (value !== form.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // ━━ HANDLERS ━━
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(form).forEach((key) => {
      validateField(key, form[key]);
    });

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      accountType: form.accountType,
    };

    mutate(payload, {
      onSuccess: () => {
        localStorage.removeItem("verifiedEmail");
        localStorage.removeItem("signupEmail");
        toast.success("Account created successfully! 🎉");
        navigate("/login");
      },
      onError: (error) => {
        const errorMsg =
          error?.response?.data?.message || "Signup failed. Please try again.";
        toast.error(errorMsg);
        setErrors({ submit: errorMsg });
      },
    });
  };

  const isFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword &&
    Object.keys(errors).length === 0 &&
    !isPending;

  return (
    <>
      

      <AuthLayout
        title="Create Your Account"
        subtitle="Join EduFlex and start learning"
      >
        <div className="register-root space-y-6">
          {/* Submit Error */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-semibold">{errors.submit}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="firstName"
                    placeholder="First"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.firstName && !!errors.firstName}
                    className={`edu-focus-ring input-field w-full pl-10 pr-3 py-2.5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 font-medium text-sm focus:outline-none transition-all ${
                      touched.firstName && errors.firstName
                        ? "border-red-600 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : touched.firstName && !errors.firstName
                        ? "border-emerald-600 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                        : "border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    name="lastName"
                    placeholder="Last"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.lastName && !!errors.lastName}
                    className={`edu-focus-ring input-field w-full pl-10 pr-3 py-2.5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 font-medium text-sm focus:outline-none transition-all ${
                      touched.lastName && errors.lastName
                        ? "border-red-600 bg-red-50 focus:ring-2 focus:ring-red-200"
                        : touched.lastName && !errors.lastName
                        ? "border-emerald-600 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                        : "border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  readOnly={Boolean(verifiedEmail)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={touched.email && !!errors.email}
                  className={`edu-focus-ring input-field w-full pl-10 pr-12 py-2.5 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 font-medium text-sm focus:outline-none transition-all ${
                    touched.email && errors.email
                      ? "border-red-600 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : touched.email && !errors.email
                      ? "border-emerald-600 bg-emerald-50 focus:ring-2 focus:ring-emerald-200"
                      : "border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  }`}
                />
                {touched.email && form.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.email ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a strong password"
                error={touched.password ? errors.password : ""}
                showStrength={true}
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
              <PasswordInput
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                error={touched.confirmPassword ? errors.confirmPassword : ""}
              />
            </div>

            {/* Account Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">I am a:</label>
              <select
                name="accountType"
                value={form.accountType}
                onChange={handleChange}
                className="edu-focus-ring w-full px-4 py-2.5 border-2 border-gray-200 bg-white text-gray-900 rounded-xl font-medium text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="Student">👨‍🎓 Student</option>
                <option value="Instructor">🎓 Instructor</option>
              </select>
            </div>

            {/* Info Box */}
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <p className="text-xs text-indigo-600 leading-relaxed">
                <span className="font-bold">✅ Your password must have:</span> At least 8 characters, uppercase letter, and a number.
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid}
              className="edu-focus-ring w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign In Link */}
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

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="edu-focus-ring rounded-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="edu-focus-ring rounded-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;
