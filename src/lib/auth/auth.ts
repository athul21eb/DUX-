import NextAuth from "next-auth";


import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
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

  ...authConfig,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await getUserByEmail(user.email ?? "");

        if (existingUser) {
          const existingGoogleAccount = await GoogleOAuthAccountById(
            existingUser.id ?? ""
          );

          if (!existingGoogleAccount) {
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

      return !!existingUser?.emailVerified;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role as string; // Ensure a default role is assigned
      token.isOAuth = !existingUser.password;

      return token;
    },

    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOAuth: token.isOAuth,
          role: token.role as string, // Ensure a default role
        },
      };
    },

  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(database),


});
