import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import "@/index.css";

const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder = "Enter password",
  error = "",
  showStrength = false,
  required = false,
  disabled = false,
  label = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength calculator
  const getPasswordStrength = () => {
    if (!value) return { level: 0, label: "", color: "" };

    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    const levels = [
      { level: 0, label: "Very Weak", color: "bg-red-600" },
      { level: 1, label: "Weak", color: "bg-red-600" },
      { level: 2, label: "Fair", color: "bg-amber-600" },
      { level: 3, label: "Good", color: "bg-indigo-600" },
      { level: 4, label: "Strong", color: "bg-emerald-600" },
    ];

    return levels[strength];
  };

  const strength = getPasswordStrength();

  return (
    <>
     

      <div className="password-input-root space-y-2">
        {/* Label */}
        {label && (
          <label htmlFor={`auth-${name}`} className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            id={`auth-${name}`}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={label || placeholder}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={!!error}
            className={`edu-focus-ring password-field w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 font-medium text-sm transition-all focus:outline-none ${
              error
                ? "border-red-600 bg-red-50 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="edu-focus-ring toggle-btn absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            id={`${name}-error`}
            role="alert"
            className="flex items-center gap-2 text-red-600 text-sm font-medium"
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Password Strength Indicator */}
        {showStrength && value && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i < strength.level ? strength.color : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                Strength: <span className="font-semibold">{strength.label}</span>
              </p>
              {strength.level >= 3 && (
                <CheckCircle size={16} className="text-emerald-600" />
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        {showStrength && !value && (
          <p className="text-xs text-gray-500">
            💡 Use uppercase, numbers, and symbols for a strong password
          </p>
        )}
      </div>
    </>
  );
};

export default PasswordInput;
