import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthLayout from "@/components/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { useSignup } from "@/hooks/useSignup";

const Signup = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useSignup();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormInvalid =
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      accountType: form.accountType,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Account created successfully 🎉");
navigate("/login");
      },
      onError: (error) => {
        toast.error(
  error?.response?.data?.message || "Signup failed"
);
      },
    });
  };

  return (
    <AuthLayout
  title="Create Account"
  subtitle="Start your learning journey"
>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <PasswordInput
  name="password"
  value={form.password}
  onChange={handleChange}
  placeholder="Password"
/>

          <PasswordInput
  name="confirmPassword"
  value={form.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm Password"
/>

          <select
            name="accountType"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>

          <button
            disabled={isPending || isFormInvalid}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Account"}
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

export default Signup;
