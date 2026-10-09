import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle } from "lucide-react";
import AuthLayout from "@/components/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { useResetPassword } from "@/hooks/useResetPassword";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { mutate, isPending } = useResetPassword();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [complete, setComplete] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const change = (event) => {
    const next = { ...form, [event.target.name]: event.target.value };
    setForm(next);
    setErrors((current) => ({ ...current, [event.target.name]: "", submit: "" }));
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.password) nextErrors.password = "Enter a new password.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your new password.";
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    if (!token) nextErrors.submit = "This reset link is invalid or has expired. Request a new link.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { if (!token) setInvalidLink(true); return; }
    mutate({ token, password: form.password, confirmPassword: form.confirmPassword }, {
      onSuccess: () => setComplete(true),
      onError: (error) => {
        const responseMessage = error?.response?.data?.message || "";
        const expiredOrInvalid = error?.response?.status === 400 || error?.response?.status === 404 || /invalid|expired|token/i.test(responseMessage);
        setErrors({ submit: expiredOrInvalid ? "This reset link is invalid or has expired. Request a new link." : "We couldn’t update your password. Please try again." });
        setInvalidLink(expiredOrInvalid);
      },
    });
  };
  if (complete) return <AuthLayout title="Password updated" subtitle="Your new password is ready to use."><div role="status" className="space-y-5"><div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-700" /><p>Your password has been changed. Sign in with your new password.</p></div><button type="button" onClick={() => navigate("/login", { replace: true })} className="edu-focus-ring flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800">Go to sign in</button></div></AuthLayout>;
  return <AuthLayout title="Choose a new password" subtitle="Set a new password for your EduFlex account.">
    <form onSubmit={submit} noValidate className="space-y-4">
      {errors.submit && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{errors.submit}</p></div>}
      <PasswordInput name="password" label="New password" value={form.password} onChange={change} placeholder="Enter a new password" error={errors.password} required disabled={isPending || invalidLink} />
      <PasswordInput name="confirmPassword" label="Confirm new password" value={form.confirmPassword} onChange={change} placeholder="Enter it once more" error={errors.confirmPassword} required disabled={isPending || invalidLink} />
      <button type="submit" disabled={isPending || invalidLink} className="edu-focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60">{isPending && <LoaderCircle size={18} className="animate-spin" />}{isPending ? "Updating password…" : "Update password"}</button>
    </form>
    {invalidLink && <button type="button" onClick={() => navigate("/forgot-password")} className="edu-focus-ring mx-auto mt-4 flex min-h-10 items-center gap-1 rounded px-2 text-sm font-semibold text-indigo-700"><ArrowLeft size={15} />Request a new reset link</button>}
    <button type="button" onClick={() => navigate("/login")} className="edu-focus-ring mx-auto mt-4 flex min-h-10 items-center gap-1 rounded px-2 text-sm text-slate-600 hover:text-indigo-700"><ArrowLeft size={15} />Back to sign in</button>
  </AuthLayout>;
};
export default UpdatePassword;
