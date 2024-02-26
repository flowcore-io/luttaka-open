import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/api/proxy", "/api/transform/ticket.0"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
