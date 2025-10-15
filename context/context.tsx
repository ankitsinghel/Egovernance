"use client";
import React, { createContext, useContext, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  setLoading: (b: boolean) => void;
  superAdminDrawerOpen: boolean;
  setSuperAdminDrawerOpen: (b: boolean) => void;
};

const globalCOntext = createContext<LoadingContextType | undefined>(undefined);

export function contextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [superAdminDrawerOpen, setSuperAdminDrawerOpen] = useState(true);
  return (
    <globalCOntext.Provider
      value={{
        loading,
        setLoading,
        superAdminDrawerOpen,
        setSuperAdminDrawerOpen,
      }}
    >
      {children}
    </globalCOntext.Provider>
  );
}

export function context() {
  const ctx = useContext(globalCOntext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}
