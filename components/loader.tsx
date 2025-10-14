"use client";
import React from "react";

export function Spinner({ size = 6 }: { size?: number }) {
  // Use inline style for size because Tailwind dynamic classes like h-${size} won't work
  const px = `${size * 4}px`;
  return (
    <div className={`flex items-center justify-center`}>
      <svg
        style={{ height: px, width: px }}
        className={`animate-spin text-slate-700`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );
}

export default Spinner;
