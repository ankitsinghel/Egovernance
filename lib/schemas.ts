import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginForm = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, "Minimum six characters are allowed"),
  organization: z.string().optional(),
});

export type SignupForm = z.infer<typeof SignupSchema>;

export const ReportSchema = z.object({
  department: z.number().min(1, "Please select an organization"),
  designation: z.string().optional(),
  accusedName: z.string().optional(),
  state: z.number().optional(),
  description: z.string().min(1),
});

export type ReportForm = z.infer<typeof ReportSchema>;

export const DepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 characters"),
});
export type DepartmentForm = z.infer<typeof DepartmentSchema>;

export const StateSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 characters"),
});
export type StateForm = z.infer<typeof StateSchema>;

export const AdminCreateSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  departmentId: z.number().min(1, "Please select a department"),
});
export type AdminCreateForm = z.infer<typeof AdminCreateSchema>;

export const AdminUpdateSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Minimum 6 characters").optional(),
  departmentId: z.number().min(1, "Please select a department"),
});

export const UserReportCreateSchema = z.object({
  departmentId: z.number().min(1, "Department is required"),
  designation: z.string().min(1, "Designation is required").max(255),
  accusedName: z.string().min(1, "Accused name is required").max(255),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  files: z.string().optional().nullable(),
});

export type UserReportCreateForm = z.infer<typeof UserReportCreateSchema>;

export const UserReportUpdateSchema = z.object({
  departmentId: z.number().min(1, "Department is required").optional(),
  designation: z.string().min(1, "Designation is required").max(255).optional(),
  accusedName: z
    .string()
    .min(1, "Accused name is required")
    .max(255)
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000)
    .optional(),
  files: z.string().optional().nullable(),
  status: z.enum(["pending", "in_progress", "resolved", "closed"]).optional(),
  assignedToId: z.number().optional().nullable(),
});
export type UserReportUpdateForm = z.infer<typeof UserReportUpdateSchema>;

// You might also want these additional schemas for related operations
export const UserReportAssignSchema = z.object({
  assignedToId: z.number().min(1, "Admin ID is required"),
});
export type UserReportAssignForm = z.infer<typeof UserReportAssignSchema>;

export const UserReportStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "resolved", "closed"]),
});
export type UserReportStatusForm = z.infer<typeof UserReportStatusSchema>;

export const ActionLogCreateSchema = z.object({
  action: z.string().min(1, "Action is required").max(255),
  description: z.string().optional().nullable(),
  userReportId: z.number().min(1, "Report ID is required"),
});
export type ActionLogCreateForm = z.infer<typeof ActionLogCreateSchema>;

export type AdminUpdateForm = z.infer<typeof AdminUpdateSchema>;
