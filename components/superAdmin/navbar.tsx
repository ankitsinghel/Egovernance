"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { context } from "../../context/context";
import { Button } from "../ui/button";
import { startTransition } from "react";

export function SuperAdminNavbar() {

  const { setSuperAdminDrawerOpen, loading, setLoading, setUser, superAdminDrawerOpen } =
    context();
  const router = useRouter();

  async function handleLogout() {
    startTransition(async () => {
      try {
        await fetch("/api/logout", { method: "POST", credentials: "include" });
      } catch (e) {
        console.error("logout failed", e);
      }
      setUser(null);
      router.push("/super-admin/login"); //
    });
  }

  return (
    <nav className="flex items-center justify-between w-full px-6 py-3 border-b bg-white shadow-sm">
      {/* Left: Menu Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSuperAdminDrawerOpen(!superAdminDrawerOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
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
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}
