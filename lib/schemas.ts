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
