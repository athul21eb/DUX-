import { z } from "zod";

// Zod schema for skill
const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Description is required"),
  createdAt: z.date(), // Optional field
  updatedAt: z.date(), // Optional field
});

// Zod schema for experience
const experienceSchema = z
  .object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date().nullable().optional(),
    description: z.string().min(1, "Description is required"),
  })
  .refine(
    (data) => !data.endDate || data.startDate <= data.endDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Zod schema for education
const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date().nullable().optional(),
    description: z.string().min(1, "Description is required"),
  })
  .refine(
    (data) => !data.endDate || data.startDate <= data.endDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Form schema
const RegisterMentorformSchema = z.object({
  userId:z.string().optional(),
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[0-9]{10}$/.test(value),
      "Phone number must be exactly 10 digits"
    ),
  skills: z.array(skillSchema).min(1, "At least one skill is required"),

  aboutMe: z.string().min(20, "About me should be at least 20 characters"),
  experiences: z
    .array(experienceSchema)
    .min(1, "At least one experience is required"),
  educations: z
    .array(educationSchema)
    .min(1, "At least one education is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

export { RegisterMentorformSchema };