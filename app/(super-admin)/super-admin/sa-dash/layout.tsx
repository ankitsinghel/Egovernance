"use client";

import React, { useEffect } from "react";
import { context } from "../../../../context/context";
import { Button } from "../../../../components/ui/button";
import { SuperAdminDashboard } from "@/components/superAdmin/drawer";
import { SuperAdminNavbar } from "@/components/superAdmin/navbar";

export default function MastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchMasters, loading } = context();

  useEffect(() => {
    fetchMasters();
  }, []);

  return (
      <SuperAdminDashboard>
        <SuperAdminNavbar />
        {/* <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Masters</h1>
          <div>
            <Button onClick={() => fetchMasters()} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh All Masters"}
            </Button>
          </div>
        </div> */}
        <main>{children}</main>
      </SuperAdminDashboard>
  );
}
