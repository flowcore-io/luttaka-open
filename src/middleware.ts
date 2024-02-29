import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/stripe/webhook",
    "/api/transform/ticket.0",
    "/api/transform/user.0",
    "/api/transform/profile.0",
    "/api/transform/conference.0",
  ],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
