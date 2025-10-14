"use client";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Building,
  MapPin,
  Users,
  Plus,
  Trash2,
  Search,
  Loader2,
  Shield,
  BarChart3,
  Download,
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    e.target.reset();
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
    e.target.reset();
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
      alert("Admin created successfully!");
      e.target.reset();
      load();
    }
  }

  async function deleteOrg(id: number) {
    if (confirm("Are you sure you want to delete this organization?")) {
      await fetch(`/api/organizations/${id}`, { method: "DELETE" });
      load();
    }
  }

  async function deleteCity(id: number) {
    if (confirm("Are you sure you want to delete this city?")) {
      await fetch(`/api/cities/${id}`, { method: "DELETE" });
      load();
    }
  }

  const filteredOrgs = orgs.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">
            Super Admin Dashboard
          </h1>
        </div>
        <p className="text-slate-600">
          Manage organizations, cities, and administrator accounts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white border-l-4 border-l-blue-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Organizations
              </p>
              <p className="text-2xl font-bold text-slate-900">{orgs.length}</p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-l-4 border-l-green-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Cities</p>
              <p className="text-2xl font-bold text-slate-900">
                {cities.length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-white border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Coverage
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {orgs.length + cities.length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations or cities..."
            className="flex-1 p-2 border-0 focus:ring-0 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Organizations Section */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Organizations
              </h2>
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {orgs.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {filteredOrgs.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{org.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteOrg(org.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {filteredOrgs.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  {searchTerm
                    ? "No organizations match your search"
                    : "No organizations yet"}
                </div>
              )}
            </div>
          )}

          <form onSubmit={createOrg} className="flex gap-2">
            <input
              name="name"
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter organization name..."
              required
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>
        </Card>

        {/* Cities Section */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-slate-900">Cities</h2>
            </div>
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
              {cities.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{city.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCity(city.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  {searchTerm ? "No cities match your search" : "No cities yet"}
                </div>
              )}
            </div>
          )}

          <form onSubmit={createCity} className="flex gap-2">
            <input
              name="name"
              className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter city name..."
              required
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>
        </Card>
      </div>

      {/* Create Admin Section */}
      <Card className="p-6 mt-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Create New Admin</h2>
        </div>

        <form
          onSubmit={createAdmin}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter admin's full name"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="admin@organization.gov"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create secure password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assign Organization
              </label>
              <select
                name="organizationId"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select an organization</option>
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="reset" variant="outline">
              Clear Form
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Users className="w-4 h-4 mr-2" />
              Create Admin Account
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Admins
          </Button>
        </div>
      </Card>
    </div>
  );
}
