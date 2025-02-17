import { z } from "zod";

// Define the Skill schema
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required"),
  description: z.string().min(1, "Description is required"),
});

export type Skill = z.infer<typeof skillSchema>;