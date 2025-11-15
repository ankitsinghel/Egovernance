"use client";

import React, { useEffect } from "react";
import { context } from "../../../context/context";
import { SuperAdminDashboard } from "@/components/AdminDrawer";
import { SuperAdminNavbar } from "@/components/AdminNavbar";
import { Boxes, MapPin, Settings, Users, Shield, Key } from "lucide-react";

export default function MastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchMasters, loading, dashboardRoutes } = context();

  useEffect(() => {
    fetchMasters();
  }, []);

  return (
    <div>
      <SuperAdminDashboard routes={dashboardRoutes}>
        <SuperAdminNavbar />
        <main>{children}</main>
      </SuperAdminDashboard>
    </div>
  );
}
