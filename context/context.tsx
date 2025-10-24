"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  role: string;
}
type LoadingContextType = {
  loading: boolean;
  setLoading: (b: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  superAdminDrawerOpen: boolean;
  setSuperAdminDrawerOpen: (b: boolean) => void;

  // Masters
  departments: Array<{ id: number; name: string }>;
  states: Array<{ id: number; name: string }>;
  admins: Array<any>;
  userReports: Array<any>;
  fetchAdminMasters: () => Promise<void>;
  fetchMasters: () => Promise<void>;
  fetchUserMasters: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshStates: () => Promise<void>;
  refreshUserReports: () => Promise<void>;
  refreshAdmins: () => Promise<void>;
};

const globalCOntext = createContext<LoadingContextType | undefined>(undefined);

export function contextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [superAdminDrawerOpen, setSuperAdminDrawerOpen] = useState(true);

  const [departments, setDepartments] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [userReports, setUserReports] = useState<
    Array<{
      id: number;
      trackingId: string;
      departmentId: number;
      designation: string | null;
      accusedName: string | null;
      description: string;
      files: string | null;
      status: string;
      assignedToId: number | null;
      createdAt: string;
    }>
  >([]);
  const [states, setStates] = useState<Array<{ id: number; name: string }>>([]);
  const [admins, setAdmins] = useState<Array<any>>([]);

  async function fetchAdminMasters() {
    setLoading(true);
    await Promise.all([fetchUserReports()]);
    setLoading(false);
  }
  async function fetchUserReports() {
    try {
      const res = await fetch("/api/user-reports");
      const j = await res.json();
      if (j.ok) setUserReports(j.reports || []);
    } catch (e) {
      console.error("fetchUserReports", e);
    }
  }
  async function fetchDepartments() {
    try {
      const res = await fetch("/api/departments");
      const j = await res.json();
      if (j.ok) setDepartments(j.departments || []);
    } catch (e) {
      console.error("fetchDepartments", e);
    }
  }

  async function fetchStates() {
    try {
      const res = await fetch("/api/states");
      const j = await res.json();
      if (j.ok) setStates(j.list || []);
    } catch (e) {
      console.error("fetchStates", e);
    }
  }

  async function fetchAdmins() {
    try {
      const res = await fetch("/api/admins");
      const j = await res.json();
      if (j.ok) setAdmins(j.admins || []);
    } catch (e) {
      // If admins endpoint doesn't exist, ignore
      console.warn("fetchAdmins failed", e);
    }
  }
  async function fetchUserMasters() {
    setLoading(true);
    await Promise.all([fetchDepartments(), fetchStates()]);
  }
  async function fetchMasters() {
    setLoading(true);
    await Promise.all([fetchDepartments(), fetchStates(), fetchAdmins()]);
    setLoading(false);
  }

  const refreshDepartments = async () => fetchDepartments();
  const refreshStates = async () => fetchStates();
  const refreshAdmins = async () => fetchAdmins();
  const refreshUserReports = async () => fetchUserReports();

    useEffect(() => {
      fetchUserMasters();
    }, []);
  return (
    <globalCOntext.Provider
      value={{
        fetchUserMasters,
        userReports,
        refreshUserReports,
        fetchAdminMasters,
        user,
        setUser,
        loading,
        setLoading,
        superAdminDrawerOpen,
        setSuperAdminDrawerOpen,

        departments,
        states,
        admins,
        fetchMasters,
        refreshDepartments,
        refreshStates,
        refreshAdmins,
      }}
    >
      {children}
    </globalCOntext.Provider>
  );
}

export function context() {
  const ctx = useContext(globalCOntext);
  if (!ctx) throw new Error("useContext must be used within provider");
  return ctx;
}
