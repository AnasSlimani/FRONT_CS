import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Retrieve token from cookies
  const token = request.cookies.get('token')?.value;

  // Protect the '/dashboardadmin' route
  if (path.startsWith("/dashboardadmin")) {
    // No token, redirect to login
    if (!token) {
      console.log("You are not connected");
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const decoded = jwtDecode(token);

      // Allow only admin users
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url)); // redirect non-admins
      }

      return NextResponse.next();

    } catch (error) {
      alert("invalid token");
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // All other routes
  return NextResponse.next();
}

// Define paths where middleware should run
export const config = {
  matcher: [
    "/dashboardadmin/:path*",
  ],
};