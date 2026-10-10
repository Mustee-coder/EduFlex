import React, { useState } from "react";
import { useDeleteProfile } from "@/hooks/useDeleteProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import PasswordInput from "@/components/auth/PasswordInput";
import { AlertCircle, Bell, CheckCircle2, KeyRound, LoaderCircle, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notifications, setNotifications] = useState({ courseUpdates: true, newMessages: true, enrollmentReminders: true, weeklyDigest: false });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();
  const { mutate: updatePassword, isPending: isChanging } = useChangePassword();

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Enter your current password.";
    if (!passwordForm.newPassword) errors.newPassword = "Enter a new password.";
    else if (passwordForm.newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) errors.newPassword = "Include an uppercase letter, a lowercase letter, and a number.";
    if (!passwordForm.confirmPassword) errors.confirmPassword = "Confirm your new password.";
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = "The passwords do not match.";
    if (passwordForm.newPassword && passwordForm.newPassword === passwordForm.currentPassword) errors.newPassword = "Choose a password different from your current one.";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    setSuccessMessage("");
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (!validatePassword()) return;
    updatePassword(passwordForm, {
      onSuccess: (response) => {
        const message = response?.message || "Password changed successfully.";
        setSuccessMessage(message);
        toast.success(message);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({});
      },
      onError: (error) => {
        const message = error?.response?.data?.message || "We couldn’t update your password. Please try again.";
        setPasswordErrors((prev) => ({ ...prev, submit: message }));
        toast.error(message);
      },
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
        setShowDelete(false);
      },
      onError: (error) => toast.error(error?.response?.data?.message || "Failed to delete account"),
    });
  };

  const notificationOptions = [
    { key: "courseUpdates", label: "Course updates", description: "Updates when course content changes." },
    { key: "newMessages", label: "Messages", description: "Notifications about new messages." },
    { key: "enrollmentReminders", label: "Enrollment reminders", description: "Reminders to continue your courses." },
    { key: "weeklyDigest", label: "Weekly digest", description: "A summary of your learning activity." },
  ];

  return (
    <main className="settings-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
        <header className="mb-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">Account</p>
          <h1 className="settings-title mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">Manage account security and notification previews.</p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="security-heading">
          <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><KeyRound className="h-5 w-5" aria-hidden="true" /></div>
            <div><h2 id="security-heading" className="text-base font-semibold text-slate-900">Account security</h2><p className="mt-1 text-sm text-slate-600">Keep your account access secure by updating your password.</p></div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <PasswordInput name="currentPassword" label="Current password" value={passwordForm.currentPassword} onChange={handlePasswordChange} error={passwordErrors.currentPassword} placeholder="Enter current password" disabled={isChanging} />
              <div className="space-y-5">
                <PasswordInput name="newPassword" label="New password" value={passwordForm.newPassword} onChange={handlePasswordChange} error={passwordErrors.newPassword} placeholder="Enter new password" showStrength disabled={isChanging} />
                <PasswordInput name="confirmPassword" label="Confirm new password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} error={passwordErrors.confirmPassword} placeholder="Confirm new password" disabled={isChanging} />
              </div>
            </div>
            {passwordErrors.submit && <div role="alert" className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{passwordErrors.submit}</div>}
            {successMessage && <div role="status" className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />{successMessage}</div>}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">Use at least 8 characters, including uppercase, lowercase, and a number.</p>
              <button type="submit" disabled={isChanging} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto">{isChanging && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{isChanging ? "Updating password…" : "Update password"}</button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="notifications-heading">
          <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Bell className="h-5 w-5" aria-hidden="true" /></div>
            <div><h2 id="notifications-heading" className="text-base font-semibold text-slate-900">Notification preview</h2><p className="mt-1 text-sm leading-5 text-slate-600">Choose which notifications you’d like to preview during this session. These preferences aren’t saved to your account.</p></div>
          </div>
          <div className="divide-y divide-slate-100 px-5 sm:px-6">
            {notificationOptions.map((option) => (
              <label key={option.key} className="flex min-h-[4.5rem] cursor-pointer items-center justify-between gap-4 py-3">
                <span className="min-w-0"><span className="block break-words text-sm font-medium text-slate-900">{option.label}</span><span className="mt-0.5 block break-words text-xs leading-5 text-slate-500">{option.description}</span></span>
                <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                  <input type="checkbox" role="switch" checked={notifications[option.key]} onChange={() => handleNotificationChange(option.key)} aria-label={option.label} className="peer sr-only" />
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-indigo-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600" />
                  <span aria-hidden="true" className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </span>
              </label>
            ))}
          </div>
          <p role="status" className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-600 sm:px-6">Preview preferences apply only until you leave this session.</p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm" aria-labelledby="danger-heading">
          <div className="flex items-start gap-3 border-b border-rose-100 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700"><ShieldAlert className="h-5 w-5" aria-hidden="true" /></div>
            <div><h2 id="danger-heading" className="text-base font-semibold text-rose-800">Delete account</h2><p className="mt-1 text-sm leading-5 text-slate-600">Permanently remove your account and associated data. This action cannot be undone.</p></div>
          </div>
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-slate-600">Make sure you intend to permanently close your EduFlex account.</p>
            <button type="button" onClick={() => setShowDelete(true)} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto"><Trash2 className="h-4 w-4" aria-hidden="true" />Delete account</button>
          </div>
        </section>
      </div>

      {showDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeleting) setShowDelete(false); }}>
        <section role="alertdialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><Trash2 className="h-5 w-5" aria-hidden="true" /></div>
          <h2 id="delete-account-title" className="mt-4 text-xl font-semibold text-slate-900">Delete your account?</h2>
          <p id="delete-account-description" className="mt-2 text-sm leading-6 text-slate-600">This action cannot be undone. Your account, courses, and associated data will be permanently removed.</p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowDelete(false)} disabled={isDeleting} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:w-auto">Cancel</button>
            <button type="button" onClick={handleDeleteAccount} disabled={isDeleting} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto">{isDeleting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{isDeleting ? "Deleting account…" : "Delete account"}</button>
          </div>
        </section>
      </div>}
    </main>
  );
};

export default Settings;
