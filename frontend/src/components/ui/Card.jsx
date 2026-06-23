import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;