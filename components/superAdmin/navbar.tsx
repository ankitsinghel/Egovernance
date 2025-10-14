"use client";

import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { context } from "../../context/context";
import { Button } from "../ui/button";

export function SuperAdminNavbar() {
  const { setSuperAdminDrawerOpen, loading, setLoading } = context();
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        router.push("/super-admin/login");
      } else {
        alert("Logout failed");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="flex items-center justify-between w-full px-6 py-3 border-b bg-white shadow-sm">
      {/* Left: Menu Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSuperAdminDrawerOpen(true)}
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
