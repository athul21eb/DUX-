import authConfig from "@/lib/auth/auth.config"
import NextAuth from "next-auth"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async (req) =>{

   console.log("Middleware",req.nextUrl.pathname)
  // Your custom middleware logic goes here
})

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
