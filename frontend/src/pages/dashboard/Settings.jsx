import React, { useState } from "react";
import { useDeleteProfile } from "@/hooks/useDeleteProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Eye, EyeOff, CheckCircle, AlertCircle, Trash2, Lock, Bell } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPasswordToggles, setShowPasswordToggles] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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
    toast.success("Notification preferences updated");
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: (data) => {
        toast.success("Account deleted successfully");
        setShowDelete(false);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete account");
      },
    });
  };

  const PasswordStrengthIndicator = ({ password }) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    const strengthColor = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-500",
    ];

    return (
      <div className="mt-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < strength ? strengthColor[strength - 1] : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Strength: <span className="font-semibold">{strengthLabel[strength] || "Very Weak"}</span>
        </p>
      </div>
    );
  };

  const PasswordInput = ({ name, placeholder, showToggle }) => (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPasswordToggles[showToggle] ? "text" : "password"}
          name={name}
          value={passwordForm[name]}
          onChange={handlePasswordChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pr-12 border rounded-xl font-medium text-sm transition-all ${
            passwordErrors[name]
              ? "border-red-500 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              : "border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          }`}
        />
        <button
          type="button"
          onClick={() =>
            setShowPasswordToggles((prev) => ({
              ...prev,
              [showToggle]: !prev[showToggle],
            }))
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPasswordToggles[showToggle] ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {passwordErrors[name] && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {passwordErrors[name]}
        </p>
      )}
      {name === "newPassword" && passwordForm.newPassword && (
        <PasswordStrengthIndicator password={passwordForm.newPassword} />
      )}
    </div>
  );

  return (
    <>
      
      <div className="settings-root min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
            
          {/* Header */}
          <div className="mb-10">
            <h1 className="settings-title text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600">Manage your account preferences and security</p>
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
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
                    placeholder="Current Password"
                    showToggle="current"
                  />

                  <PasswordInput
                    name="newPassword"
                    placeholder="New Password"
                    showToggle="new"
                  />

                  <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    showToggle="confirm"
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
                    className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all duration-300"
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

              <div className="space-y-4">
                {[
                  { key: "courseUpdates", label: "Course Updates", desc: "Get notified about new content" },
                  { key: "newMessages", label: "Messages", desc: "Receive message notifications" },
                  { key: "enrollmentReminders", label: "Enrollment Reminders", desc: "Reminders to complete courses" },
                  { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your learning activity" },
                ].map((notif) => (
                  <label
                    key={notif.key}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={notifications[notif.key]}
                      onChange={() => handleNotificationChange(notif.key)}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="modal-content bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-black text-red-600 mb-3">Delete Account?</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                This action cannot be undone. Your account, courses, and all data will be permanently removed from our system.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-red-700 font-semibold">
                  ⚠️ All your progress and certificates will be lost.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
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
