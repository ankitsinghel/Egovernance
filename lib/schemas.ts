import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginForm = z.infer<typeof LoginSchema>

export const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, "Minimum six characters are allowed"),
  organization: z.string().optional(),
})

export type SignupForm = z.infer<typeof SignupSchema>

export const ReportSchema = z.object({
  organization: z.string().min(1, "Please select an organization"),
  designation: z.string().optional(),
  accusedName: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(1),
})

export type ReportForm = z.infer<typeof ReportSchema>

export const DepartmentSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters").max(100, "Maximum 100 characters"),
})
export type DepartmentForm = z.infer<typeof DepartmentSchema>

export const StateSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters").max(100, "Maximum 100 characters"),
})
export type StateForm = z.infer<typeof StateSchema>

export const AdminCreateSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  departmentId: z.number().min(1, "Please select a department"),
})
export type AdminCreateForm = z.infer<typeof AdminCreateSchema>

export const AdminUpdateSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Minimum 6 characters").optional(),
  departmentId: z.number().min(1, "Please select a department"),
})
export type AdminUpdateForm = z.infer<typeof AdminUpdateSchema>
