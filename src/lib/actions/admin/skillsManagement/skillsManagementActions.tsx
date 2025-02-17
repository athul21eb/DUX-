"use server";

import { skillService } from "@/lib/db/skills";
import { Skill, skillSchema } from "@/utils/validator/skillform";






export async function getAllSkills(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;

    const [skills, totalCount] = await Promise.all([
      skillService.getSkillsWithPagination(skip, limit),
      skillService.getTotalSkillCount(),
    ]);

    if (!skills) throw new Error("Failed to fetch skills");

    return {
      success: true,
      skills,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching skills:", error);
    return { success: false, error: "Failed to fetch skills" };
  }
}

// Adjust the path

export async function createSkill(formData: Skill) {
  try {
    const validateData = skillSchema.parse(formData);

    if (!validateData) return { error: "Invalid Input Data" };

    const { name, description } = validateData;

    if (!name) {
      return { success: false, error: "Skill name is required" };
    }

    const skill = await skillService.createSkill(name, description);
    return { success: true, skill };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { success: false, error: "Failed to create skill" };
  }
}

export async function updateSkill(formData: Skill) {
  try {
  const validateData = skillSchema.parse(formData);

    if (!validateData) return { error: "Invalid Input Data" };

    const { id, name, description } = validateData;

    if (!id) {
      return { success: false, error: "Skill ID is required" };
    }

    const updatedSkill = await skillService.updateSkill(id, name, description);
    return updatedSkill
      ? { success: true, updatedSkill }
      : { success: false, error: "Failed to update skill" };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkill(id:string) {
  try {


    if (!id) {
      return { success: false, error: "Skill ID is required" };
    }

    const deletedSkill = await skillService.deleteSkill(id);
    return deletedSkill
      ? { success: true, deletedSkill }
      : { success: false, error: "Failed to delete skill" };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, error: "Failed to delete skill" };
  }
}
