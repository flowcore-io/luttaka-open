import {authMiddleware} from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/api/proxy", "/api/transform/ticket", "/api/transform/user.0"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
