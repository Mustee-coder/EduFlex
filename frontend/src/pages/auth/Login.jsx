import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PasswordInput from "@/components/auth/PasswordInput";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, AlertCircle, Loader } from "lucide-react";
import "@/index.css";

const Login = () => {
  const { mutate, isPending } = useLogin();
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");

    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Redirect authenticated users
  if (user) {
    const routes = {
      Admin: "/admin",
      Instructor: "/instructor",
      Student: "/dashboard",
    };

    return (
      <Navigate
        to={routes[user?.accountType] || "/dashboard"}
        replace
      />
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;


    mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          toast.success("Welcome back! 🚀");


          if (formData.rememberMe) {
            localStorage.setItem(
              "rememberEmail",
              formData.email
            );
          } else {
            localStorage.removeItem("rememberEmail");
          }


          login(data?.user, data?.token);


          const routes = {
            Admin: "/admin",
            Instructor: "/instructor",
            Student: "/dashboard",
          };

          const role =
            data?.user?.accountType || "Student";


          navigate(routes[role] || "/dashboard", {
            replace: true,
          });
        },

        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            "Login failed. Please try again.";

          toast.error(message);

          setErrors({
            submit: message,
          });
        },
      }
    );
  };


  const isFormValid =
    Boolean(formData.email.trim()) &&
    Boolean(formData.password.trim()) &&
    !isPending;


  return (
    <div className="login-root min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="login-card w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
      >

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="login-title text-white font-black text-lg">
              ED
            </span>
          </div>

          <h1 className="login-title text-3xl font-black text-gray-900">
            Eduflex
          </h1>

          <p className="text-gray-600 mt-2 text-sm">
            Welcome back! Continue your learning journey.
          </p>
        </div>


        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700 text-sm">
            <AlertCircle size={20}/>
            {errors.submit}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              />
            </div>


            {errors.email && (
              <p className="text-red-600 text-xs mt-2 flex gap-1">
                <AlertCircle size={14}/>
                {errors.email}
              </p>
            )}
          </div>



          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />
          </div>



          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />

              <span className="text-sm text-gray-600">
                Remember me
              </span>
            </label>


            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-indigo-600 font-semibold"
            >
              Forgot Password?
            </button>

          </div>



          <motion.button
            whileHover={isFormValid ? {scale:1.02}:{}}
            whileTap={isFormValid ? {scale:0.98}:{}}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >

            {isPending ? (
              <>
                <Loader className="inline w-4 h-4 animate-spin mr-2"/>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}

          </motion.button>

        </form>


        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/send-otp")}
            className="text-indigo-600 font-bold"
          >
            Create Account
          </button>
        </p>

      </motion.div>

    </div>
  );
};

export default Login;