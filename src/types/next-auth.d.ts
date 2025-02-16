import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string; // Add the role property
  }

  interface Session {
    user: User; // Ensure session.user includes the custom User type
  }
}
