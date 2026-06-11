import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { mutate, isPending, error } = useLogin();
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // prevent flicker while loading auth state
  if (loading) return null;

  // auto redirect if already logged in
  if (user) {
    const role = user?.accountType;

    if (role === "Admin") return <Navigate to="/admin" replace />;
    if (role === "Instructor") return <Navigate to="/instructor" replace />;

    return <Navigate to="/dashboard" replace />;
  }

  const submit = (e) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("Welcome back 🚀");

          // FIXED: correct login usage
          login(data.user, data.token);

          const role = data?.user?.accountType;

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
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white border shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome back
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Continue your learning journey
        </p>

        <form onSubmit={submit} className="space-y-4">

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg"
          />

          <button
            disabled={isPending || !email || !password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>

        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error?.response?.data?.message || "Login failed"}
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;