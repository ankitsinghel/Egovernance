"use client";

import React, { ReactNode, useEffect } from "react";
import { context } from "../../../context/context";
import { SuperAdminDashboard } from "@/components/AdminDrawer";
import { SuperAdminNavbar } from "@/components/AdminNavbar";
import { Boxes } from "lucide-react";

export default function MastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchMasters, loading } = context();

  type RouteItem = { name: string; href: string; icon: ReactNode };

  const routes: RouteItem[] = [
    {
      name: "Complaints",
      href: "/admin/dashboard/complaints",
      icon: <Boxes className="mr-2 size-3" />,
    },
  ];
  return (
    <SuperAdminDashboard routes={routes}>
      <SuperAdminNavbar />
      <main>{children}</main>
    </SuperAdminDashboard>
  );
}
