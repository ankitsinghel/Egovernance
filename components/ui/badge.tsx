import React from "react";

type BadgePropsT = {
  children?: React.ReactNode;
  variant?: "gray" | "red" | "orange" | string;
  classname?: string;
};

export function Badge({ children, variant = "gray", className = "" }: BadgePropsT & { className?: string }) {
  const baseCls =
    variant === "red"
      ? "bg-red-600"
      : variant === "orange"
      ? "bg-orange-500"
      : "bg-gray-400";
  
  return (
    <span className={`text-white text-xs px-2 py-1 rounded ${baseCls} ${className}`}>
      {children}
    </span>
  );

}
