import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Role-based route access mapping
const protectedRoutes: Record<string, string> = {
  "/mentor": "mentor",
  "/user": "user",
  "/admin": "admin",
};

// Function to check role access
const hasAccess = (pathname: string, role: string): boolean => {
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route + "/") || pathname === route) {
      return role === protectedRoutes[route];
    }
  }
  return true; // Default to allowing access
};

// Middleware function
export default auth(async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role: string = token?.role ?? "guest";
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  console.log("Middleware:", pathname, "Role =>", role);

  if (pathname === "/register-as-mentor" && role !== "user") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (!hasAccess(pathname, role)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthenticated && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

// Apply middleware to relevant routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
