"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { context } from "../context/context";
import { Button } from "./ui/button";
import { startTransition, useEffect, useState } from "react";

export function SuperAdminNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    setSuperAdminDrawerOpen,
    loading,
    setLoading,
    setUser,
    superAdminDrawerOpen,
  } = context();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const router = useRouter();

  async function handleLogout() {
    startTransition(async () => {
      try {
        setLoading(true);
        await fetch("/api/logout", { method: "POST", credentials: "include" });
      } catch (e) {
        console.error("logout failed", e);
      }
      setUser(null);
      setLoading(false);
      router.push("/super-admin/login"); //
    });
  }

  return (
    <>
      <nav
        className={`sticky flex justify-between items-center px-5 h-14 top-0 left-0 right-0  transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200"
            : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSuperAdminDrawerOpen(!superAdminDrawerOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>
        </div>

        {/* Right: Logout Button */}
        <div>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
      {/* <div className="h-12"></div> */}
    </>
  );
}
