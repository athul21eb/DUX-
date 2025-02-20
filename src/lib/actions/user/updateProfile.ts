"use server";

import { getUserByEmail, updateUser } from "@/lib/db/user";
import { uploadImage } from "@/utils/cloudinary/cloudinary";
import { UserFormValues, UserSchema } from "@/utils/validator/userformupdate";
import { revalidatePath } from "next/cache";

export async function UpdateUserProfileAction(
  formData: UserFormValues,
  selectedImage: File | null
) {
  try {
    const validData = UserSchema.parse(formData);

    if (!validData) {
      return { success: false, message: "Invalid data" };
    }

    const { name, email, phone, gender, dob } = formData;

    // Fetch the current user data
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    let imageUrl: string | null = user.image ?? null;

    // Upload new image if a new one is selected
    if (selectedImage) {
      try {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) {
          throw new Error("Image upload returned null");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        return { success: false, message: "Failed to upload image" };
      }
    }

    // Check if the data has changed before updating
    const isDataUnchanged =
      user.name === name &&
      user.phone === phone &&
      user.gender === gender &&
      user.dob === dob &&
      user.image === imageUrl;

    if (isDataUnchanged) {
      return { success: false, message: "No changes detected" };
    }

    // Update the user if changes are detected
    const updatedUser = await updateUser(user.id, {
      name,
      phone,
      gender,
      dob,
      image: imageUrl ?? undefined,
    });

    // Revalidate the profile page
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        name: updatedUser?.name,
        image: imageUrl,
      },
    };
  } catch (error) {
    console.error("Error in UpdateUserProfileAction:", error);
    return { success: false, message: "Something went wrong" };
  }
}
