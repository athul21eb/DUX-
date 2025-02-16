"use server";
import "server-only";

import * as z from "zod";
import { LoginSchema } from "@/utils/validator/authforms";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth/auth";
import { getUserByEmail } from "@/lib/db/user";




export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validateData = LoginSchema.parse(data);

  if (!validateData) return { error: "Invalid Input Data" };

  const { email, password } = validateData;

  const userExists = await getUserByEmail(email);

  if (!userExists) {
    return { error: "User does not exist" };
  }

  if (userExists.email && !userExists.password) {
    return { error: "Email already registered via Google. Please Login Using Google SignIn" };
  }

  // Verification link already sent to email
  if (userExists.email && userExists.password && !userExists.emailVerified) {
    return { error: "Email verification is not  done yet. Please confirm your email address" };
  }


  try {
    await signIn("credentials", {
      email: userExists.email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Please confirm your email address" };
      }
    }

    throw error;
  }

  return { success: "User LoggedIn Successfully" };
};
