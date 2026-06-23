import React from "react";
import { roleTheme } from "@/utils/roleTheme";

const Badge = ({ children, role = "Student" }) => {
  const theme = roleTheme[role] || roleTheme.default;

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${theme.bg} text-white`}
    >
      {children}
    </span>
  );
};

export default Badge;