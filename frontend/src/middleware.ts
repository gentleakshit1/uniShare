import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protect /dashboard and /upload routes. Everything else (like /) is public.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/upload(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Clerk internal paths
    '/__clerk/:path*',
  ],
}
