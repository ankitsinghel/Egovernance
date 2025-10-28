// Centralized type definitions for the project

import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  role: number|string;
  permissions: Permission[];
  departmentId?: number;
}
export type RouteItem = { name: string; href: string; icon: ReactNode, permission:string };

export interface Role {
  id: number;
  name: string;
  permissions?:Permission[]
}

export type Permission = { id: number; name: string; description?: string };
export type Department = { id: number; name: string };
export type StateT = { id: number; name: string };

export type Admin = {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  city: string | null;
};

export type UserReport = {
  id: number;
  trackingId: string;
  departmentId: number;
  designation: string | null;
  accusedName: string | null;
  description: string;
  files: string | null;
  status: "pending" | "in_progress" | "resolved" | "closed";
  assignedToId: number | null;
  createdAt: string;
};

export type ActionLog = {
  id: number;
  action: string;
  description: string | null;
  createdAt: string;
  adminId: number;
  userReportId: number;
};

export type Report = {
  id: number;
  trackingId: string;
  department: string;
  state?: string;
  status: string;
  createdAt: string;
};

// Context shape exported so other files can reference it
export type contextType = {
  setPermissions:(permissions:Permission[])=>void;
  dashboardRoutes: RouteItem[];
  loading: boolean;
  setLoading: (b: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  superAdminDrawerOpen: boolean;
  setSuperAdminDrawerOpen: (b: boolean) => void;
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  permissions: Permission[];
  refreshPermissions: () => Promise<void>;
  refreshRoles?: () => Promise<void>;
  // Masters
  departments: Department[];
  states: StateT[];
  admins: Admin[];
  userReports: UserReport[];
  fetchAdminMasters: () => Promise<void>;
  fetchMasters: () => Promise<void>;
  fetchUserMasters: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshStates: () => Promise<void>;
  refreshUserReports: () => Promise<void>;
  refreshAdmins: () => Promise<void>;
};

// Keep previous name used in codebase for compatibility
export type LoadingContextType = contextType;

// Generic alias for places where a flexible object is needed.
export type AnyT = any;
