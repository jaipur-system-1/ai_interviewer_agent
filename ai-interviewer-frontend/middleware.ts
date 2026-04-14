import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes (Landing page, etc.)
const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)",
  "/api(.*)" // Keep API open for now
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // 1. If public, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. If not logged in, force sign-in
  if (!userId) {
    return redirectToSignIn();
  }

  // 3. Logged in? Allow access to everything (Dashboard, Practice, etc.)
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};