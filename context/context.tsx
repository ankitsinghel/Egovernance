"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { toast } from "sonner";
import type {
  User,
  contextType,
  Department,
  StateT,
  UserReport,
  Admin,
  Role,
  RouteItem,
} from "@/lib/types";
import type { Permission } from "@/lib/types";
import { Boxes, Key, MapPin, Settings, Shield, Users } from "lucide-react";

const globalCOntext = createContext<contextType | undefined>(undefined);

export function contextProvider({
  children,
  initialUser,
  initialDepartments,
  initialStates,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialDepartments?: Department[];
  initialStates?: StateT[];
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [superAdminDrawerOpen, setSuperAdminDrawerOpen] = useState(true);

  const [departments, setDepartments] = useState<Department[]>(
    initialDepartments || []
  );
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [states, setStates] = useState<StateT[]>(initialStates || []);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Initialize known roles once (avoid calling setState during render)
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "SuperAdmin" },
    { id: 2, name: "CentralAdmin" },
    { id: 3, name: "StateAdmin" },
  ]);
  const dashboardRoutes: RouteItem[] = [
    {
      name: "Departments",
      href: "/super-admin/sa-dash/departments",
      icon: <Boxes className="mr-2 size-3" />,
      permission: "view_depmartments",
    },
    {
      name: "States",
      href: "/super-admin/sa-dash/states",
      icon: <MapPin className="mr-2 size-3" />,
      permission: "view_states",
    },
    {
      name: "Admins",
      href: "/super-admin/sa-dash/admins",
      icon: <Users className="mr-2 size-3" />,
      permission: "view_admins",
    },
    {
      name: "Roles",
      href: "/super-admin/sa-dash/roles",
      icon: <Shield className="mr-2 size-3" />,
      permission: "view_roles",
    },
    {
      name: "Permissions",
      href: "/super-admin/sa-dash/permissions",
      icon: <Key className="mr-2 size-3" />,
      permission: "view_permissions",
    },
    {
      name: "Settings",
      href: "/super-admin/sa-dash/settings",
      icon: <Settings className="mr-2 size-3" />,
      permission: "view_super_settings",
    },
    {
      name: "Complaints",
      href: "/admin/dashboard/complaints",
      icon: <Boxes className="mr-2 size-3" />,
      permission: "view_complaints",
    },
    {
      name: "State Admins",
      href: "/admin/dashboard/state-admins",
      icon: <Users className="mr-2 size-3" />,
      permission: "view_state_admins",
    },
  ];

  async function fetchAdminMasters() {
    setLoading(true);
    await Promise.all([fetchUserReports(), fetchAdmins()]);
    setLoading(false);
  }
  async function fetchUserReports() {
    try {
      const res = await fetch("/api/admin/reports");
      const j = await res.json();
      if (j.ok) {
        setUserReports(j.reports || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.error("fetchUserReports", e);
      toast.error("Failed to load reports");
    }
  }
  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments");
      const j = await res.json();
      if (j.ok) {
        setDepartments(j.departments || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.error("fetchDepartments", e);
      toast.error("Failed to load departments");
    }
  }

  async function fetchStates() {
    try {
      const res = await fetch("/api/states");
      const j = await res.json();
      if (j.ok) {
        setStates(j.list || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.error("fetchStates", e);
      toast.error("Failed to load states");
    }
  }

  async function fetchAdmins() {
    try {
      const res = await fetch("/api/admins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const j = await res.json();

      if (j.ok) {
        setAdmins(j.admins || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.warn("fetchAdmins failed", e);
    }
  }

  async function fetchRoles() {
    try {
      const res = await fetch("/api/roles");
      const j = await res.json();
      if (j.ok) {
        setRoles(j.list || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.error("fetchRoles", e);
    }
  }

  async function fetchPermissions() {
    try {
      const res = await fetch("/api/permissions");
      const j = await res.json();
      if (j.ok) {
        setPermissions(j.list || []);
        if (j.message) toast.success(j.message);
      } else {
        if (j.message) toast.error(j.message);
      }
    } catch (e) {
      console.error("fetchPermissions", e);
    }
  }
  async function fetchUserMasters() {
    try {
      if (
        (departments && departments.length > 0) ||
        (states && states.length > 0)
      )
        return;
      setLoading(true);
      await Promise.all([fetchDepartments(), fetchStates()]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchMasters() {
    setLoading(true);
    await Promise.all([fetchAdmins(), fetchRoles(), fetchPermissions()]);
    setLoading(false);
  }

  const refreshDepartments = async () => fetchDepartments();
  const refreshStates = async () => fetchStates();
  const refreshAdmins = async () => fetchAdmins();
  const refreshUserReports = async () => fetchUserReports();
  const refreshRoles = async () => fetchRoles();
  const refreshPermissions = async () => fetchPermissions();

  useEffect(() => {
    if (user) {
      fetchAdminMasters();
    }
  }, [user]);
  // useEffect(() => {
  //   fetchUserMasters();
  // },[]) ;
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <globalCOntext.Provider
        value={{
          dashboardRoutes,
          roles,
          setRoles,
          permissions,
          setPermissions,
          userReports,
          refreshUserReports,
          user,
          setUser,
          loading,
          superAdminDrawerOpen,
          departments,
          states,
          admins,
          setLoading,
          setUserReports,
          setSuperAdminDrawerOpen,
          setAdmins,
          setDepartments,
          setStates,
          fetchAdminMasters,
          fetchUserMasters,
          fetchAdmins,
          fetchDepartments,
          fetchStates,
          fetchRoles,
          fetchPermissions,
          refreshPermissions,
          refreshRoles,
          fetchMasters,
          refreshDepartments,
          refreshStates,
          refreshAdmins,
        }}
      >
        {children}
      </globalCOntext.Provider>
    </ThemeProvider>
  );
}

export function context() {
  const ctx = useContext(globalCOntext);
  if (!ctx) throw new Error("useContext must be used within provider");
  return ctx;
}
