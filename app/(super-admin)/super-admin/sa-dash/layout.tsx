"use client";

import React, { ReactNode, useEffect } from "react";
import { context } from "../../../../context/context";
import { Button } from "../../../../components/ui/button";
import { SuperAdminDashboard } from "@/components/AdminDrawer";
import { SuperAdminNavbar } from "@/components/AdminNavbar";
import { Boxes, MapPin, Settings, Users } from "lucide-react";

export default function MastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchMasters, loading } = context();

  useEffect(() => {
    fetchMasters();
  }, []);

  type RouteItem = { name: string; href: string; icon: ReactNode };

  const routes: RouteItem[] = [
    {
      name: "Departments",
      href: "/super-admin/sa-dash/departments",
      icon: <Boxes className="mr-2 size-3" />,
    },
    {
      name: "States",
      href: "/super-admin/sa-dash/states",
      icon: <MapPin className="mr-2 size-3" />,
    },
    {
      name: "Admins",
      href: "/super-admin/sa-dash/admins",
      icon: <Users className="mr-2 size-3" />,
    },
    {
      name: "Settings",
      href: "/super-admin/sa-dash/settings",
      icon: <Settings className="mr-2 size-3" />,
    },
  ];
  return (
    <SuperAdminDashboard routes={routes}>
      <SuperAdminNavbar />
      <main>{children}</main>
    </SuperAdminDashboard>
  );
}
