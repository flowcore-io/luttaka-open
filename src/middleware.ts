import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/tonik",
    "/event/:slug*",
    "/api/trpc/event.getPublic",
    "/api/trpc/event.getPublicList",
    "/api/stripe/webhook",
    "/api/sendgrid",
    "/api/transform/ticket.0",
    "/api/transform/user.0",
    "/api/transform/profile.0",
    "/api/transform/event.0",
    "/api/transform/company.0",
    "/api/transform/newsitem.0",
    "/api/transform/activity.0",
  ],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
