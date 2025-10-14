"use client"
import { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

export default function SuperAdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      <div className="mt-4">
        Welcome to the Super Admin dashboard (placeholder).
      </div>
    </div>
  );
}

  const [orgs, setOrgs] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [o, c] = await Promise.all([
        fetch("/api/organizations").then((r) => r.json()),
        fetch("/api/cities").then((r) => r.json()),
      ]);
      setOrgs(o.orgs || []);
      setCities(c.list || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createOrg(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    await fetch("/api/organizations", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    load();
  }

  async function createCity(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    await fetch("/api/cities", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    load();
  }

  async function createAdmin(e: any) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    const organizationId = Number(e.target.organizationId.value);
    const res = await fetch("/api/admin/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        organizationId,
        role: "Admin",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const j = await res.json();
    if (!j.ok) alert(j.error || "Create failed");
    else {
      alert("Admin created");
      load();
    }
  }

