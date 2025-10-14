"use client";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

export default function SuperDashboard() {
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

  return (
    <section className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Organizations</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {orgs.map((o) => (
              <li key={o.id}>{o.name}</li>
            ))}
          </ul>
        )}
        <form onSubmit={createOrg} className="mt-3 flex gap-2">
          <input
            name="name"
            className="p-2 border rounded"
            placeholder="Org name"
          />
          <Button type="submit">Create</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Cities</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {cities.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        )}
        <form onSubmit={createCity} className="mt-3 flex gap-2">
          <input
            name="name"
            className="p-2 border rounded"
            placeholder="City name"
          />
          <Button type="submit">Create</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Create Admin</h2>
        <form onSubmit={createAdmin} className="mt-3 space-y-2">
          <div>
            <input
              name="name"
              placeholder="Full name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              name="password"
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <select name="organizationId" className="w-full p-2 border rounded">
              <option value="">Select organization</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Create Admin</Button>
        </form>
      </Card>
    </section>
  );
}
