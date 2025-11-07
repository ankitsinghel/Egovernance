// Centralized type definitions for the project

import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  role: number | string;
  permissions: Permission[];
  departmentId?: number;
  organization?: string;
}
export type RouteItem = {
  name: string;
  href: string;
  icon: ReactNode;
  permission: string;
};

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
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
  stateId?: number | null;
};
export interface ReportFiles {
  id: number;
  name: string;
  filePath: string;
}
export type UserReport = {
  id: number;
  trackingId: string;
  departmentId: number;
  designation: string | null;
  accusedName: string | null;
  description: string;
  files: ReportFiles[] | [];
  // now stored as numeric status id which maps to lib/statuses.ts
  status: number;
  assignedToId: number | null;
  createdAt: string;
};
export interface ActionForDrawerT {
  id: number;
  statusChange: number | null;
  note: string;
  proofFile: string | null;
  createdAt: string;
}
export type ActionLog = {
  id: number;
  action: string;
  description: string | null;
  createdAt: string;
  adminId: number;
  userReportId: number;
  statusChange?: number | null;
  proofFile?: string | null;
  note?: string | null;
};
export type StatusItem = {
  id: number;
  key: "pending" | "in_progress" | "resolved" | "closed";
  label: string;
};
export type Report = {
  id: number;
  trackingId: string;
  department: string;
  state?: string;
  status: number;
  createdAt: string;
};

// Context shape exported so other files can reference it
export type contextType = {
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
  setPermissions: (permissions: Permission[]) => void;
  refreshPermissions: () => Promise<void>;
  refreshRoles?: () => Promise<void>;
  // Masters
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  states: StateT[];
  setStates: (states: StateT[]) => void;
  admins: Admin[];
  setAdmins: (admins: Admin[]) => void;
  userReports: UserReport[];
  setUserReports: (reports: UserReport[]) => void;
  // Fetchers
  fetchDepartments: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  fetchStates: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchAdminMasters: () => Promise<void>;
  fetchMasters: () => Promise<void>;
  fetchUserMasters: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshStates: () => Promise<void>;
  refreshUserReports: () => Promise<void>;
  refreshAdmins: () => Promise<void>;
};

export type LoadingContextType = contextType;
// JSON value type used for arbitrary JSON/meta payloads stored in DB
export type JSONValueT =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValueT }
  | JSONValueT[];

// Uploaded file shape produced by `parseForm` and used across the app
export type UploadedFileT = {
  filepath: string;
  originalFilename: string;
  mimetype?: string | null;
};

export type FieldsT = Record<string, string | string[]>;
export type FilesT = Record<string, UploadedFileT | UploadedFileT[]>;

// A loose file-like shape that may be returned by different runtimes/libs
export type FileLikeT = Partial<UploadedFileT> & { path?: string };

export type UserReportDetailT = UserReport & {
  actions?: ActionLog[];
  department?: Department | null;
};

// Minimal token payload shape used by auth utilities
export type TokenPayloadT = {
  id?: string | number;
  role?: string;
  [key: string]: JSONValueT | undefined;
};
