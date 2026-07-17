import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "@/components/auth/PasswordInput";
import { toast } from "sonner";

import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { mutate, isPending, error } = useLogin();
  const { user, login, loading } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [rememberMe, setRememberMe] = useState(false);

  if (loading) return null;

  if (user) {
    const role = user.accountType;

    if (role === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "Instructor") {
      return <Navigate to="/instructor" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  const submit = (e) => {
    e.preventDefault();

    mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          toast.success("Welcome back 🚀");

          login(data.user, data.token);

          const role = data.user.accountType;

          if (role === "Admin") {
            navigate("/admin", { replace: true });
          } else if (role === "Instructor") {
            navigate("/instructor", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        },

        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Login failed"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">
            EduFlex
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

           <PasswordInput
  name="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
/>

          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() =>
                  setRememberMe(!rememberMe)
                }
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={
              isPending ||
              !email ||
              !password
            }
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {isPending
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-sm mt-4">
            {error?.response?.data?.message ||
              "Login failed"}
          </p>
        )}

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;