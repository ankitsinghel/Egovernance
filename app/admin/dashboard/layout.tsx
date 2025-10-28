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
  const { fetchMasters, loading, dashboardRoutes } = context();

  return (
    <SuperAdminDashboard routes={dashboardRoutes}>
      <SuperAdminNavbar />
      <main>{children}</main>
    </SuperAdminDashboard>
  );
}
