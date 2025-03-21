import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedIn: z.string().optional(),
  summary: z.string().optional(),
});

export const educationItemSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const experienceItemSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const skillsSchema = z.object({
  skills: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string().optional(),
  expires: z.string().optional(),
});

export const cvFormSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationItemSchema).default([]),
  experience: z.array(experienceItemSchema).default([]),
  skills: skillsSchema,
  certifications: z.array(certificationSchema).default([]),
  additionalInfo: z.string().optional(),
});

export type CVFormType = z.infer<typeof cvFormSchema>;
