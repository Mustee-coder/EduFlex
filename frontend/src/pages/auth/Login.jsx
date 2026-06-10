import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { mutate, isPending, error } = useLogin();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success("Welcome back 🚀");

          // save user to context
          login(data?.user);

          navigate("/dashboard");
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

      <div className="w-full max-w-md bg-white border border-[#E5E7EB] shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center text-[#111827] mb-2">
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

          <div className="relative">

            <input
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

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


export default Login
