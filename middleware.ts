import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/free"
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const isProtected =
    pathname.startsWith("/student") ||
    pathname.startsWith("/teacher") ||
    pathname === "/chooserole" ||
    pathname === "/role-redirect";

  if (!userId && isProtected) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|static|favicon.ico).*)',
  ],
};
