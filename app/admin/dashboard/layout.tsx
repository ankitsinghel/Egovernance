"use client";

import React from "react";
import { context } from "../../../context/context";
import { SuperAdminDashboard } from "@/components/AdminDrawer";
import { SuperAdminNavbar } from "@/components/AdminNavbar";

export default function MastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dashboardRoutes } = context();
  return (
    <SuperAdminDashboard routes={dashboardRoutes}>
      <SuperAdminNavbar />
      <main>{children}</main>
    </SuperAdminDashboard>
  );
}
