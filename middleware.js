import { NextResponse } from "next/server"

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /about, /dashboardadmin)
  const path = request.nextUrl.pathname

  // If the path starts with /dashboardadmin, we want to use a different layout
  if (path.startsWith("/dashboardadmin")) {
    // We don't need to do anything special here, just let it pass through
    // The layout.jsx in the dashboardadmin folder will handle the layout
    return NextResponse.next()
  }

  // For all other routes, use the default layout
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

