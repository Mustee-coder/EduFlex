import React from "react";
import { motion as Motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "from-emerald-600 to-teal-600",
  bgColor = "bg-emerald-100",
  textColor = "text-emerald-600",
}) => {
  return (
    <Motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
    >
      {/* Background Gradient */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-12 -mt-12`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`${bgColor} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
          {React.createElement(Icon, {
            className: `${textColor} w-6 h-6 sm:w-7 sm:h-7`,
          })}
        </div>

        {/* Content */}
        <div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1 sm:mb-2">
            {title}
          </p>
          <h3 className="admin-title text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {typeof value === "number"
              ? value.toLocaleString("en-NG")
              : value}
          </h3>
        </div>

        {/* Accent Line */}
        <div
          className={`mt-3 sm:mt-4 h-1 w-8 bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </Motion.div>
  );
};

export default StatCard;
