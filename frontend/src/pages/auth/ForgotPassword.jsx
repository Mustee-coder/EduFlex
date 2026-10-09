import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useForgotPassword } from "@/hooks/useForgotPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const showNeutralResult = () => setSubmitted(true);
  const submit = (event) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError(normalized ? "Enter a valid email address." : "Email is required.");
      return;
    }
    setError("");
    mutate(normalized, { onSuccess: showNeutralResult, onError: showNeutralResult });
  };
  if (submitted) return <AuthLayout title="Check your email" subtitle="Your request has been received.">
    <div role="status" className="space-y-5"><div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-700" /><p>If an account matches that email, password reset instructions will arrive shortly. Check your inbox and spam folder.</p></div><button type="button" onClick={() => navigate("/login")} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800"><ArrowLeft size={17} />Back to sign in</button><button type="button" onClick={() => { setSubmitted(false); setEmail(""); }} className="edu-focus-ring mx-auto flex min-h-10 items-center rounded px-2 text-sm font-medium text-slate-600 hover:text-indigo-700">Try another email</button></div>
  </AuthLayout>;
  return <AuthLayout title="Reset your password" subtitle="Enter the email on your account. If it matches, we’ll send a secure reset link.">
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
      <div><label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email address</label><div className="relative"><Mail size={17} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="reset-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} aria-invalid={Boolean(error)} placeholder="you@example.com" className={`edu-focus-ring min-h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-950 placeholder:text-slate-400 ${error ? "border-red-400" : "border-slate-300"}`} /></div></div>
      <button type="submit" disabled={isPending} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-70">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Sending request…" : "Send reset link"}</button>
    </form>
    <button type="button" onClick={() => navigate("/login")} className="edu-focus-ring mx-auto mt-5 flex min-h-10 items-center gap-1 rounded px-2 text-sm font-medium text-slate-600 hover:text-indigo-700"><ArrowLeft size={15} />Back to sign in</button>
  </AuthLayout>;
};
export default ForgotPassword;
