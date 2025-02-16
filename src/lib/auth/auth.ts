import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { database } from "../db/database";
import { getUserByEmail, getUserById, updateUser } from "../db/user";
import {
  createGoogleOAuthAccount,
  GoogleOAuthAccountById,
} from "../db/oAuthAccounts";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await getUserByEmail(user.email ?? "");

        if (existingUser) {
          // Check if an account already exists for Google
          const existingGoogleAccount = await GoogleOAuthAccountById(
            existingUser.id ?? ""
          );

          if (!existingGoogleAccount) {
            // Link Google account to the existing user
            await createGoogleOAuthAccount(existingUser.id, {
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ?? null,
              refresh_token: account.refresh_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
              session_state: String(account.session_state) ?? null,
            });
          }

          // Mark Google users as email verified
          if (!existingUser.emailVerified) {
            await updateUser(existingUser.id, { emailVerified: new Date() });
          }

          return true;
        }
      }

      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id ?? "");

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOAuth: token.isOAuth,
          dob: token.dob,
          gender: token.gender,
          phone: token.phone,
        },
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.dob = existingUser.dob;
      token.gender = existingUser.gender;
      token.phone = existingUser.phone;
      token.isOAuth = !!existingUser.password ? false : true;

      return token;
    },
  },
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(database),
});
