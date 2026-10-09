import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, LoaderCircle, Mail, ShieldCheck, UserRound } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { useSignup } from "@/hooks/useSignup";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useSignup();
  const verifiedEmail = (location.state?.email || localStorage.getItem("verifiedEmail") || "").trim().toLowerCase();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: verifiedEmail, password: "", confirmPassword: "", accountType: "Student" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (values) => {
    const result = {};
    if (!values.firstName.trim()) result.firstName = "First name is required";
    else if (values.firstName.trim().length < 2) result.firstName = "Use at least 2 characters";
    if (!values.lastName.trim()) result.lastName = "Last name is required";
    else if (values.lastName.trim().length < 2) result.lastName = "Use at least 2 characters";
    if (!values.email.trim()) result.email = "Email is required";
    else if (!emailPattern.test(values.email.trim())) result.email = "Enter a valid email address";
    if (!values.password) result.password = "Password is required";
    else if (values.password.length < 8) result.password = "Use at least 8 characters";
    else if (!/[A-Z]/.test(values.password)) result.password = "Include an uppercase letter";
    else if (!/[0-9]/.test(values.password)) result.password = "Include a number";
    if (!values.confirmPassword) result.confirmPassword = "Please confirm your password";
    else if (values.confirmPassword !== values.password) result.confirmPassword = "Passwords do not match";
    return result;
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setErrors(validate(next));
  };
  const onBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validate(form));
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(validationErrors).length) return;
    if (form.email.trim().toLowerCase() !== verifiedEmail) {
      setErrors({ submit: "Verify this email address before creating your account." });
      return;
    }
    mutate({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: verifiedEmail, password: form.password, confirmPassword: form.confirmPassword, accountType: form.accountType }, {
      onSuccess: () => {
        localStorage.removeItem("verifiedEmail");
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("verificationPurpose");
        navigate("/login", { replace: true, state: { signupComplete: true } });
      },
      onError: (error) => setErrors({ submit: error?.response?.data?.message || "We couldn’t create your account. Please try again." }),
    });
  };

  if (!verifiedEmail) return <AuthLayout title="Verify your email first" subtitle="A verified address is required before account creation.">
    <div className="space-y-4"><div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">We’ll send a one-time code to your email. Once verified, you can return here to finish signing up.</div><button onClick={() => navigate("/send-otp")} type="button" className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800"><Mail size={18} />Verify email</button><p className="text-center text-sm text-slate-600">Already have an account? <button type="button" onClick={() => navigate("/login")} className="edu-focus-ring rounded font-semibold text-indigo-700">Sign in</button></p></div>
  </AuthLayout>;

  const showError = (field) => touched[field] ? errors[field] : "";
  return <AuthLayout title="Create your account" subtitle="A few details, then you’re ready to start learning.">
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errors.submit && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{errors.submit}</p></div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[['firstName','First name'],['lastName','Last name']].map(([name,label]) => <div key={name}><label htmlFor={`signup-${name}`} className="mb-1.5 block text-sm font-medium text-slate-800">{label}</label><div className="relative"><UserRound size={16} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id={`signup-${name}`} name={name} autoComplete={name === "firstName" ? "given-name" : "family-name"} value={form[name]} onChange={onChange} onBlur={onBlur} aria-invalid={Boolean(showError(name))} aria-describedby={showError(name) ? `${name}-error` : undefined} className={`edu-focus-ring min-h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-950 ${showError(name) ? "border-red-400" : "border-slate-300"}`} />{showError(name) && <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-700">{showError(name)}</p>}</div></div>)}
      </div>
      <div><label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-slate-800">Verified email</label><div className="relative"><Mail size={16} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="signup-email" name="email" type="email" autoComplete="email" value={form.email} readOnly aria-describedby="verified-email-hint" className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700" /><ShieldCheck size={17} aria-hidden="true" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-700" /></div><p id="verified-email-hint" className="mt-1.5 text-xs text-slate-500">Verified before signup. The server checks this address again.</p></div>
      <div><PasswordInput name="password" label="Password" value={form.password} onChange={onChange} onBlur={onBlur} placeholder="At least 8 characters" error={showError("password")} showStrength required /></div>
      <div><PasswordInput name="confirmPassword" label="Confirm password" value={form.confirmPassword} onChange={onChange} onBlur={onBlur} placeholder="Enter your password again" error={showError("confirmPassword")} required /></div>
      <div><label htmlFor="signup-account-type" className="mb-1.5 block text-sm font-medium text-slate-800">I’m joining as</label><select id="signup-account-type" name="accountType" value={form.accountType} onChange={onChange} className="edu-focus-ring min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"><option value="Student">Student</option><option value="Instructor">Instructor</option></select>{form.accountType === "Instructor" && <p className="mt-1.5 text-xs leading-5 text-slate-500">Instructor accounts require administrator approval before instructor access is available.</p>}</div>
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">Use at least 8 characters, including an uppercase letter and a number.</p>
      <button type="submit" disabled={isPending} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-70">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Creating account…" : "Create account"}</button>
    </form>
    <p className="mt-5 text-center text-sm text-slate-600">Already have an account? <button type="button" onClick={() => navigate("/login")} className="edu-focus-ring rounded font-semibold text-indigo-700">Sign in</button></p>
    <button type="button" onClick={() => { localStorage.removeItem("verifiedEmail"); localStorage.removeItem("signupEmail"); localStorage.removeItem("verificationPurpose"); navigate("/send-otp"); }} className="edu-focus-ring mx-auto mt-3 flex min-h-10 items-center gap-1 rounded px-2 text-xs text-slate-500 hover:text-indigo-700"><ArrowLeft size={14} />Use a different email</button>
  </AuthLayout>;
};

export default Signup;
