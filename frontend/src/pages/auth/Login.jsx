import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, LoaderCircle, Mail } from "lucide-react";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";

const getRememberedEmail = () => {
  const email = localStorage.getItem("rememberEmail") || "";
  return { email, password: "", rememberMe: Boolean(email) };
};

const Login = () => {
  const { mutate, isPending } = useLogin();
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(getRememberedEmail);
  const [errors, setErrors] = useState({});
  const roleRoutes = { Admin: "/admin", Instructor: "/instructor", Student: "/dashboard" };

  if (loading) return <main className="flex min-h-[100svh] items-center justify-center" aria-label="Loading account"><LoaderCircle className="animate-spin text-indigo-700" /></main>;
  if (user) return <Navigate to={roleRoutes[user.accountType] || "/dashboard"} replace />;

  const onChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: "", submit: "" }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const nextErrors = {};
    if (!email) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address";
    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    mutate({ email, password: form.password }, {
      onSuccess: (data) => {
        if (form.rememberMe) localStorage.setItem("rememberEmail", email);
        else localStorage.removeItem("rememberEmail");
        login(data?.user);
        toast.success("Welcome back.");
        navigate(roleRoutes[data?.user?.accountType || "Student"] || "/dashboard", { replace: true });
      },
      onError: (error) => {
        const message = error?.response?.data?.message || "We couldn’t sign you in. Check your details and try again.";
        setErrors({ submit: message, code: error?.response?.data?.code || "" });
      },
    });
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue where your learning left off.">
    {location.state?.emailVerified && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900">Email verified. You can sign in now.</p>}
    {location.state?.signupComplete && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900">Your account is ready. Sign in to continue.</p>}
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {errors.submit && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div><p>{errors.submit}</p>{errors.code === "EMAIL_NOT_VERIFIED" && <button type="button" onClick={() => navigate("/send-otp", { state: { email: form.email.trim().toLowerCase(), verificationPurpose: "existing-account" } })} className="mt-2 font-semibold underline underline-offset-2">Verify your email</button>}</div></div>}
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email address</label>
        <div className="relative"><Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="login-email" name="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={onChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} placeholder="you@example.com" className={`edu-focus-ring min-h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-950 placeholder:text-slate-400 ${errors.email ? "border-red-400" : "border-slate-300"}`} />
        {errors.email && <p id="login-email-error" className="mt-1.5 text-xs text-red-700" role="alert">{errors.email}</p>}</div>
      </div>
      <div><div className="mb-1.5 flex justify-end"><button type="button" onClick={() => navigate("/forgot-password")} className="edu-focus-ring rounded text-sm font-medium text-indigo-700 hover:text-indigo-900">Forgot password?</button></div>
        <PasswordInput name="password" label="Password" value={form.password} onChange={onChange} placeholder="Enter your password" error={errors.password} required /></div>
      <label className="flex min-h-8 w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600"><input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={onChange} className="edu-focus-ring h-4 w-4 rounded border-slate-300 accent-indigo-700" />Remember this email</label>
      <button type="submit" disabled={isPending} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-70">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Signing in…" : "Sign in"}</button>
    </form>
    <p className="mt-6 text-center text-sm text-slate-600">New to EduFlex? <button type="button" onClick={() => navigate("/send-otp")} className="edu-focus-ring rounded font-semibold text-indigo-700 hover:text-indigo-900">Create an account</button></p>
  </AuthLayout>;
};

export default Login;
