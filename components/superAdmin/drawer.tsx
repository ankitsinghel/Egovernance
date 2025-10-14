"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, Home, Users, Settings, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { context } from "../../context/context";

export function SuperAdminDrawer() {
    const { superAdminDrawerOpen, setSuperAdminDrawerOpen } = context();

  const pathname = usePathname();

  const routes = [
    { name: "Dashboard", icon: Home, route: "/super-admin/dashboard" },
    { name: "Manage Admins", icon: Users, route: "/super-admin/admins" },
    { name: "Departments", icon: Shield, route: "/super-admin/departments" },
    { name: "Settings", icon: Settings, route: "/super-admin/settings" },
  ];

  return (
    <Drawer direction="left" open={superAdminDrawerOpen} onOpenChange={setSuperAdminDrawerOpen}>
      {/* Trigger button */}
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      {/* Drawer panel */}
      <DrawerContent
        className={cn(
          "fixed top-0 left-0 h-full bg-white shadow-lg z-50 overflow-y-auto transition-all",
          "w-full sm:w-1/4" // full on mobile, 1/4 on larger screens
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Super Admin</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSuperAdminDrawerOpen(false)}
              aria-label="Close drawer"
            >
              ✕
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="space-y-1">
            {routes.map((item) => {
              const isActive = pathname === item.route;

              return (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={() => setSuperAdminDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
