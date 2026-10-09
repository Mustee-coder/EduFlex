import React, { useState } from "react";
import { useDeleteProfile } from "@/hooks/useDeleteProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import PasswordInput from "@/components/auth/PasswordInput";
import { CheckCircle, AlertCircle, Trash2, Lock, Bell } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    newMessages: true,
    enrollmentReminders: true,
    weeklyDigest: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();
  const { mutate: updatePassword, isPending: isChanging } = useChangePassword();

  // ━━ VALIDATION ━━
  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = "Password must contain uppercase, lowercase, and numbers";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ━━ HANDLERS ━━
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleChangePassword = () => {
    if (!validatePassword()) return;

    updatePassword(passwordForm, {
      onSuccess: (data) => {
        toast.success(data?.message || "Password changed successfully! 🎉");
        setSuccessMessage("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPassword(false);

        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (err) => {
        const errMsg = err?.response?.data?.message || "Failed to change password";
        toast.error(errMsg);
        setPasswordErrors({ submit: errMsg });
      },
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.info("Preview updated for this session only. Notification preferences aren’t saved yet.");
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
        setShowDelete(false);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete account");
      },
    });
  };

  return (
    <>

      <div className="settings-root student-page min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-10">
            <h1 className="settings-title text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-sm text-slate-600">Manage account security and notification preview preferences.</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 font-semibold text-sm">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* ━━ ACCOUNT SETTINGS ━━ */}
            <div
              className="settings-card bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: "0s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="settings-title text-xl font-bold text-gray-900">
                  Account Security
                </h2>
              </div>

              <button
                onClick={() => setShowPassword(!showPassword)}
                className="student-button-primary"
              >
                {showPassword ? "Hide" : "Change Password"}
              </button>
            </div>

            {/* ━━ CHANGE PASSWORD ━━ */}
            {showPassword && (
              <div
                className="settings-card bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-8 shadow-sm"
                style={{ animationDelay: "0.1s" }}
              >
                <h2 className="settings-title text-xl font-bold text-gray-900 mb-6">
                  Change Your Password
                </h2>

                <div className="space-y-5">
                  <PasswordInput
                    name="currentPassword"
                    label="Current password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.currentPassword}
                    placeholder="Current Password"
                  />

                  <PasswordInput
                    name="newPassword"
                    label="New password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                    placeholder="New Password"
                    showStrength
                  />

                  <PasswordInput
                    name="confirmPassword"
                    label="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                    placeholder="Confirm New Password"
                  />

                  {passwordErrors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      {passwordErrors.submit}
                    </div>
                  )}

                  <button
                    onClick={handleChangePassword}
                    disabled={isChanging}
                    className="student-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isChanging ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}

            {/* ━━ NOTIFICATIONS ━━ */}
            <div
              className="settings-card bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="settings-title text-xl font-bold text-gray-900">
                  Notifications
                </h2>
              </div>

              <p className="mb-4 text-sm leading-6 text-slate-600">These switches are a local preview and aren’t saved to your account yet.</p>
              <div className="space-y-2">
                {[
                  { key: "courseUpdates", label: "Course Updates", desc: "Get notified about new content" },
                  { key: "newMessages", label: "Messages", desc: "Receive message notifications" },
                  { key: "enrollmentReminders", label: "Enrollment Reminders", desc: "Reminders to complete courses" },
                  { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your learning activity" },
                ].map((notif) => (
                  <label
                    key={notif.key}
                    className="flex min-h-16 items-center gap-4 rounded-xl border border-slate-100 px-3 py-3 transition-colors hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={notifications[notif.key]}
                      onChange={() => handleNotificationChange(notif.key)}
                      className="h-5 w-5 shrink-0 accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{notif.label}</p>
                      <p className="text-xs text-gray-500">{notif.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ━━ DANGER ZONE ━━ */}
            <div
              className="settings-card bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl border border-red-200 p-8 shadow-sm"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="settings-title text-xl font-bold text-red-700">
                  Danger Zone
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <button
                onClick={() => setShowDelete(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* ━━ DELETE MODAL ━━ */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description">
            <div className="modal-content max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
              <h3 id="delete-account-title" className="mb-3 text-xl font-semibold text-rose-700 sm:text-2xl">Delete account?</h3>
              <p id="delete-account-description" className="mb-6 text-sm leading-relaxed text-slate-600">
                This action cannot be undone. Your account, courses, and all data will be permanently removed from our system.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-red-700 font-semibold">
                  ⚠️ Your account and enrolled-course data will be permanently removed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDelete(false)}
                  disabled={isDeleting}
                  className="student-button-secondary flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-rose-800 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


export default Settings;
