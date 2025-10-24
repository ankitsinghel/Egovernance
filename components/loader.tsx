"use client";
import { context } from "@/context/context";
import React, { useEffect } from "react";

export function Spinner({ size = 6 }: { size?: number }) {
  const { loading } = context();

  const px = `${size * 4}px`;

  useEffect(() => {
    if (loading) {
      // Disable scroll
      document.body.style.overflow = "hidden";
      // Prevent right-click context menu
      const preventContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener("contextmenu", preventContextMenu);

      return () => {
        // Re-enable scroll when spinner is removed
        document.body.style.overflow = "unset";
        document.removeEventListener("contextmenu", preventContextMenu);
      };
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay backdrop that blocks clicks */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-sm"
        onClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          touchAction: "none",
          pointerEvents: "all",
        }}
      />

      {/* Spinner container */}
      <div className="relative z-50">
        {/* Outer glowing ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            width: `calc(${px} + 20px)`,
            height: `calc(${px} + 20px)`,
            top: "-10px",
            left: "-10px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
          }}
        />

        {/* Main spinner with gradient */}
        <svg
          style={{ height: px, width: px }}
          className="animate-spin drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient
              id="spinnerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="url(#spinnerGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="0"
            className="opacity-80"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;64;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Center dot */}
          <circle
            cx="12"
            cy="12"
            r="2"
            fill="url(#spinnerGradient)"
            className="animate-pulse"
          />
        </svg>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full animate-bounce"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default Spinner;
