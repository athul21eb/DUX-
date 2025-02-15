
"use server"
import "server-only";



import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth/auth";


export const googleAuthenticate = async () => {
  try {


    await signIn("google",
      {
        redirectTo: "/",
        
      }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return  "Invalid OAuth Signin"
    }

    throw error;
  }
};
