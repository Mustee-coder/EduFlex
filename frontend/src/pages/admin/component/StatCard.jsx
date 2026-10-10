import React from "react";
import { motion as Motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "from-blue-700 to-blue-700",
  bgColor = "bg-blue-50",
  textColor = "text-blue-700",
}) => {
  return (
    <Motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
    >
      {/* Background Gradient */}
      <div
        className={`absolute right-0 top-0 h-16 w-1 rounded-bl ${color}`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`${bgColor} mb-4 flex h-11 w-11 items-center justify-center rounded-lg`}>
          {React.createElement(Icon, {
            className: `${textColor} h-5 w-5`,
          })}
        </div>

        {/* Content */}
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {typeof value === "number"
              ? value.toLocaleString("en-NG")
              : value}
          </h3>
        </div>

        {/* Accent Line */}
      </div>
    </Motion.div>
  );
};

export default StatCard;
