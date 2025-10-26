"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  User,
  contextType,
  Department,
  StateT,
  UserReport,
  Admin,
} from "@/lib/types";

const globalCOntext = createContext<contextType | undefined>(undefined);

export function contextProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [superAdminDrawerOpen, setSuperAdminDrawerOpen] = useState(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [states, setStates] = useState<StateT[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  async function fetchAdminMasters() {
    setLoading(true);
    await Promise.all([fetchUserReports()]);
    setLoading(false);
  }
  async function fetchUserReports() {
    try {
      const res = await fetch("/api/admin/reports");
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
    try {
      setLoading(true);
      await Promise.all([fetchDepartments(), fetchStates()]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchMasters() {
    setLoading(true);
    await Promise.all([fetchAdmins()]);
    setLoading(false);
  }

  const refreshDepartments = async () => fetchDepartments();
  const refreshStates = async () => fetchStates();
  const refreshAdmins = async () => fetchAdmins();
  const refreshUserReports = async () => fetchUserReports();

  useEffect(() => {
    fetchUserMasters();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAdminMasters();
    }
  }, [user]);
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
