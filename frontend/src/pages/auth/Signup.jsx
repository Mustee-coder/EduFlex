import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup";

const Signup = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useSignup();

  const email = localStorage.getItem("verifiedEmail");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    accountType: "Student",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      {
        ...form,
        email,
      },
      {
        onSuccess: () => {
          localStorage.removeItem("verifiedEmail");
          localStorage.removeItem("signupEmail");

          navigate("/login");
        },
      }
    );
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
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {isPending ? "Creating..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;