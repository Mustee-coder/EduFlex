import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, LoaderCircle, Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useSendOtp } from "@/hooks/useSendOtp";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state?.email || localStorage.getItem("signupEmail") || "").trim().toLowerCase();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const { mutate: verify, isPending } = useVerifyOtp();
  const { mutate: resend, isPending: isResending } = useSendOtp();

  useEffect(() => {
    if (!email) navigate("/send-otp", { replace: true });
  }, [email, navigate]);
  useEffect(() => {
    if (!resendTimer) return undefined;
    const timer = window.setTimeout(() => setResendTimer((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setError("");
    verify({ email, otp }, {
      onSuccess: () => {
        if (localStorage.getItem("verificationPurpose") === "existing-account") {
          localStorage.removeItem("verificationPurpose");
          localStorage.removeItem("signupEmail");
          localStorage.removeItem("verifiedEmail");
          navigate("/login", { replace: true, state: { emailVerified: true } });
          return;
        }
        localStorage.setItem("verifiedEmail", email);
        navigate("/signup", { replace: true, state: { email } });
      },
      onError: (requestError) => setError(requestError?.response?.data?.message || "That code could not be verified. Request a new code and try again."),
    });
  };
  const onResend = () => {
    setError("");
    setNotice("");
    resend({ email }, {
      onSuccess: () => { setOtp(""); setResendTimer(60); setNotice("A new verification code has been sent. Check your inbox."); },
      onError: (requestError) => setError(requestError?.response?.data?.message || "We couldn’t resend the code. Please try again shortly."),
    });
  };
  return <AuthLayout title="Enter your verification code" subtitle="Confirm this address to continue creating your account.">
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"><Mail size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-indigo-700" /><div className="min-w-0"><p className="text-xs text-slate-500">Code sent to</p><p className="break-all text-sm font-semibold text-slate-900">{email}</p></div></div>
      {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
      {notice && <p role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900"><CheckCircle2 size={18} className="shrink-0" />{notice}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <label htmlFor="verification-code" className="block text-sm font-medium text-slate-800">6-digit code</label>
        <input id="verification-code" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" maxLength={6} value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} aria-invalid={Boolean(error)} aria-describedby={error ? "verification-error" : "verification-help"} placeholder="000000" className={`edu-focus-ring min-h-14 w-full rounded-xl border bg-white px-4 text-center font-mono text-2xl tracking-[0.45em] text-slate-950 placeholder:text-slate-300 placeholder:tracking-[0.45em] ${error ? "border-red-400" : "border-slate-300"}`} />
        <p id="verification-help" className="text-center text-xs text-slate-500">You can paste the complete code from your email.</p>
        {error && <span id="verification-error" className="sr-only">{error}</span>}
        <button type="submit" disabled={isPending || otp.length !== 6} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Verifying…" : "Verify email"}</button>
      </form>
      <div className="border-t border-slate-100 pt-4 text-center"><p className="mb-3 text-sm text-slate-600">Didn’t receive the code?</p><button type="button" onClick={onResend} disabled={isResending || resendTimer > 0} className="edu-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60">{isResending ? <LoaderCircle size={16} className="animate-spin" /> : resendTimer ? <Clock3 size={16} /> : null}{isResending ? "Sending…" : resendTimer ? `Resend in ${resendTimer}s` : "Resend code"}</button></div>
      <button type="button" onClick={() => { localStorage.removeItem("signupEmail"); localStorage.removeItem("verifiedEmail"); localStorage.removeItem("verificationPurpose"); navigate("/send-otp"); }} className="edu-focus-ring mx-auto flex min-h-10 items-center gap-1 rounded px-2 text-sm text-slate-600 hover:text-indigo-700"><ArrowLeft size={15} />Change email</button>
    </div>
  </AuthLayout>;
};
export default VerifyEmail;
