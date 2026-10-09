import { z } from "zod";
export const MATRIC = /^PSP\/SICT\/[A-Z]{3}\d?\/(ND|HND)\/\d{2}\/\d{4}$/;
export const registerSchema = z.object({
  role: z.enum(["student", "supervisor"]),
  fullName: z.string().min(3, "Enter your full name"),
  matricNo: z.string().trim().optional(),
  email: z.string().email("Enter a valid email"),
  gender: z.enum(["Male", "Female"], { message: "Select your gender" }),
  phone: z.string().min(10, "Enter a valid phone number"),
  department: z.string().min(2, "Select your department"),
  level: z.string().optional(),
  password: z.string().min(8, "At least 8 characters"),
}).superRefine((d, c) => {
  if (d.role === "student" && !MATRIC.test((d.matricNo ?? "").toUpperCase())) c.addIssue({ code: "custom", path: ["matricNo"], message: "Use the format PSP/SICT/CSC1/ND/24/0010" });
}).transform((d) => ({ ...d, matricNo: (d.matricNo ?? "").toUpperCase() }));
export const loginSchema = z.object({ identifier: z.string().min(3, "Enter your matric number or email"), password: z.string().min(1, "Enter your password") });
export const topicSchema = z.object({ title: z.string().min(10, "Title is too short"), description: z.string().min(40, "Describe the project in at least 40 characters") });
export const inviteSchema = z.object({ fullName: z.string().min(3, "Enter the full name"), email: z.string().email("Enter a valid email"), gender: z.enum(["Male", "Female"]), department: z.enum(["CSC", "SWE", "CYB", "DTS"]) });
export const passwordSchema = z.object({ password: z.string().min(8, "At least 8 characters"), confirm: z.string() }).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });
