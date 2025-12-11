"use client";

import {
  Menu,
  MenuIcon,
  LogOutIcon,
  KeyIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { context } from "../context/context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import PasswordResetDialog from "./PasswordResetDialog";
import { useEffect, useState } from "react";
import Link from "next/link";

export function SuperAdminNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    setSuperAdminDrawerOpen,
    loading,
    setLoading,
    user,
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
    try {
      setLoading(true);
      const role = user.role;
      await fetch("/api/logout", { method: "POST", credentials: "include" });

      setUser(null);
      setLoading(false);

      if (role === "Superadmin") {
        router.push("/super-admin/login");
      } else {
        router.push("/admin/login");
      }
    } catch (e) {
      setLoading(false);
      console.error("logout failed", e);
    }
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

        {/* Right: user menu */}
        <div className="flex items-center gap-2">
          <Link
            href={
              user && user.role === "Superadmin"
                ? "/super-admin/sa-dash/dashboard"
                : "/admin/dashboard"
            }
          >
            <Button variant="outline">
              {/* show simple user initial or icon */}
              Dashboard
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-9 w-9 rounded-full border-2 border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-center h-full w-full">
                  {user ? (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <MenuIcon className="h-4 w-4 text-gray-600" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-lg border border-gray-200 bg-white/95 backdrop-blur-sm shadow-xl p-2 animate-in zoom-in-95 fade-in-0"
            >
              {/* User Info Section */}
              {user && (
                <>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || "User"}
                    </p>
                    {user.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Navigation */}
              <DropdownMenuItem
                asChild
                className="px-3 py-2.5 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Link
                  href={
                    user && user.role === "Superadmin"
                      ? "/super-admin/sa-dash/dashboard"
                      : "/admin/dashboard"
                  }
                  className="flex items-center w-full text-sm text-gray-700 hover:text-gray-900"
                >
                  <LayoutDashboardIcon className="h-4 w-4 mr-3 text-gray-400" />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              {/* Password Reset */}
              <PasswordResetDialog
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()} // prevents dropdown auto-close
                    asChild
                    className="px-3 py-2.5 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center w-full text-sm text-gray-700 hover:text-gray-900">
                      <KeyIcon className="h-4 w-4 mr-3 text-gray-400" />
                      Change password
                    </div>
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              {/* Logout */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  void (async () => {
                    await handleLogout();
                  })();
                }}
                className="px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors group"
              >
                <LogOutIcon className="h-4 w-4 mr-3 text-red-400 group-hover:text-red-500" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      {/* Render password dialog outside of dropdown so the menu closing doesn't unmount the trigger */}

      {/* <div className="h-12"></div> */}
    </>
  );
}
