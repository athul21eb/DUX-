"use server";

import "server-only";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/validator/authforms";
import * as z from "zod";

import { generateVerificationToken } from "@/lib/token/token";
import { createUser, getUserByEmail } from "@/lib/db/user";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail } from "@/lib/mail/verificationMail";

// import { generateVerificationToken } from "@/lib/token";
// import { sendVerificationEmail } from "@/lib/mail";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    // Validate the input data
    const validatedData = RegisterSchema.parse(data);

    //  If the data is invalid, return an error
    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    //  Destructure the validated data
    const { email, name, password, confirmPassword } = validatedData;

    // Check if passwords match
    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // Check to see if user already exists
    const userExists = await getUserByEmail(email);

console.log(userExists)
    // If the user exists, return an error
    if (userExists && userExists.email && !userExists.password) {
      return {
        error:
          "Email already register via  Google . please try with another email",
      };
    }

    if (
      userExists &&
      userExists.email &&
      userExists.password &&
      !userExists.emailVerified
    ) {
      return { error: "Email already verification sended . Please confirm your email address" };
    }


    if (userExists && userExists.email && userExists.password) {
      return { error: "Email already exists. Please try with another email" };
    }

    //verification link already sented to email



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const user = await createUser({
      email,
      name,
      password: hashedPassword,
    });

    // Generate Verification Token
    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken){
      return { error: "error in generate verification link" };
    }


    await sendVerificationEmail(email, verificationToken.token);
    revalidatePath("/signup");

    return { success: "Email Verification was sent" };
  } catch (error) {
    // Handle the error, specifically check for a 503 error
    console.error("Database error:", error);

    if ((error as { code: string }).code === "ETIMEDOUT") {
      return {
        error: "Unable to connect to the database. Please try again later.",
      };
    } else if ((error as { code: string }).code === "503") {
      return {
        error: "Service temporarily unavailable. Please try again later.",
      };
    } else {
      return { error: "An unexpected error occurred. Please try again later." };
    }
  }
};
