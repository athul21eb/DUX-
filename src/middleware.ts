import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req: NextRequest) => {


  // Get encrypted token from cookies
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log("Middleware:", req.nextUrl.pathname,"    Role=>",token?.role);
  // Extract user role from token or default to 'guest'
  const role: string = token?.role ?? "guest";
  const isAuthenticated = !!token;

  // Role-based route protection
  const protectedRoutes: Record<string, string> = {
    "/mentor": "mentor",
    "/user": "user",
    "/admin": "admin",
  };

  for (const route in protectedRoutes) {
    if (req.nextUrl.pathname.startsWith(route) && role !== protectedRoutes[route]) {
      return NextResponse.redirect(new URL("/", req.nextUrl)); // Redirect unauthorized users
    }
  }

  // Restrict access to /register-as-mentor for users who are not 'user'
  if (req.nextUrl.pathname === "/register-as-mentor" && role === "user") {
    return NextResponse.next();
  } else if (req.nextUrl.pathname === "/register-as-mentor") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Prevent authenticated users from accessing /login and /signup
  if (isAuthenticated && ["/login", "/signup"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl)); // Redirect to home if already logged in
  }

  return NextResponse.next(); // Allow access if authorized
});

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
