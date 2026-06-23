import React from "react";
import { roleTheme } from "@/utils/roleTheme";

const Input = ({
  role = "Student",
  className = "",
  ...props
}) => {
  const theme = roleTheme[role] || roleTheme.default;

  return (
    <input
      {...props}
      className={`
        w-full px-4 py-2 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-gray-200
        ${theme.hover}
        ${className}
      `}
    />
  );
};

export default Input;