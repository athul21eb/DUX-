import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import { database } from "../db/database";
import { getUserByEmail, getUserById } from "../db/user";
import {
  createGoogleOAuthAccount,
  GoogleOAuthAccountById,
} from "../db/oAuthAccounts";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} =
  
  NextAuth({
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


              return true;
            }

            // If no existing user, continue with NextAuth's default behavior (create a new user)
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
        // console.log("token in session", token);
        // console.log("session in session", session);
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            isOAuth: token.isOauth,
          },
        };
      },
      async jwt({ token }) {
        // console.log("token in jwt", token);
        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;
        token.name = existingUser.name;
        token.email = existingUser.email;

        return token;
      },
    },
    ...authConfig,
    session: {
      strategy: "jwt",
    },
    adapter: PrismaAdapter(database),
  });
