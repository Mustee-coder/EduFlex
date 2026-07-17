import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "@/components/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { useResetPassword } from "@/hooks/useResetPassword";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const { mutate, isPending } = useResetPassword();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      {
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully 🎉");
          navigate("/login");
        },

        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              "Failed to update password"
          );
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your new password below"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
        />

        <PasswordInput
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />

        <button
          type="submit"
          disabled={
            isPending ||
            !form.password ||
            !form.confirmPassword
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {isPending
            ? "Updating..."
            : "Update Password"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:underline font-medium"
        >
          Back to Login
        </button>
      </p>
    </AuthLayout>
  );
};

export default UpdatePassword;