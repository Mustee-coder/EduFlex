import React from "react";
import { roleTheme } from "@/utils/roleTheme";

const Button = ({
  children,
  onClick,
  variant = "primary",
  role = "Student",
  className = "",
}) => {
  const theme = roleTheme[role] || roleTheme.default;

  const base =
    "px-4 py-2 rounded-lg font-medium transition active:scale-95";

  const variants = {
    primary: `${theme.bg} text-white hover:opacity-90`,
    secondary: `bg-white border ${theme.text} ${theme.hover}`,
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;