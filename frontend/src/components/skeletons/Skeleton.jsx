import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
  );
};