"use client";
import { context } from "@/context/context";
import { FallingLines } from "react-loader-spinner";
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
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
      {/* Overlay backdrop that blocks clicks */}
      <div
        className="absolute inset-0 bg-gradient-to-br  backdrop-blur-md "
        onClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          touchAction: "none",
          pointerEvents: "all",
        }}
      />
      {/* Spinner container */}
      <div className="relative z-[2147483649]">
        {/* Outer glowing ring */}

        {/* Main spinner with gradient */}
        <FallingLines
          color="#4fa94d"
          width="100"
          visible={true}
        />

        {/* Floating particles */}
      </div>

      {/* Loading text */}
    </div>
  );
}

export default Spinner;
