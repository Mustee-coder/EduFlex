import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      alert("Email is required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
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
        navigate("/login");
      },
      onError: (error) => {
        alert(error?.response?.data?.message || "Signup failed");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <select
            name="accountType"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          >
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>

          <button
            disabled={isPending || isFormInvalid}
            className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;