import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, LoaderCircle, Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSendOtp } from "@/hooks/useSendOtp";

const SendOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useSendOtp();
  const [email, setEmail] = useState(location.state?.email || "");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError(normalized ? "Enter a valid email address." : "Email is required.");
      return;
    }
    setError("");
    mutate({ email: normalized }, {
      onSuccess: () => {
        localStorage.removeItem("verifiedEmail");
        localStorage.setItem("signupEmail", normalized);
        if (location.state?.verificationPurpose === "existing-account") localStorage.setItem("verificationPurpose", "existing-account");
        else localStorage.removeItem("verificationPurpose");
        navigate("/verify-email", { state: { email: normalized } });
      },
      onError: (requestError) => setError(requestError?.response?.data?.message || "We couldn’t send a code. Please try again shortly."),
    });
  };
  return <AuthLayout title="Verify your email" subtitle="We’ll send a one-time code before you create your account.">
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
      <div><label htmlFor="otp-email" className="mb-1.5 block text-sm font-medium text-slate-800">Email address</label><input id="otp-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "otp-email-error" : "otp-email-help"} placeholder="you@example.com" className={`edu-focus-ring min-h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-950 placeholder:text-slate-400 ${error ? "border-red-400" : "border-slate-300"}`} />{error && <span id="otp-email-error" className="sr-only">{error}</span>}<p id="otp-email-help" className="mt-1.5 text-xs leading-5 text-slate-500">Use the address you want connected to your EduFlex account.</p></div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm leading-6 text-slate-600"><Mail size={17} aria-hidden="true" className="mr-2 inline text-indigo-700" />Your code expires after a short time. You can request another if needed.</div>
      <button type="submit" disabled={isPending} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-70">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Sending code…" : "Send verification code"}</button>
    </form>
    <button type="button" onClick={() => navigate("/login")} className="edu-focus-ring mx-auto mt-5 flex min-h-10 items-center gap-1 rounded px-2 text-sm font-medium text-slate-600 hover:text-indigo-700"><ArrowLeft size={15} />Back to sign in</button>
  </AuthLayout>;
};
export default SendOtp;
