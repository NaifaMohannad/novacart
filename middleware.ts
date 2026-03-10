import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protected routes
  const protectedRoutes = ["/cart", "/checkout"]

  // Check if current path is protected
  const isProtected = protectedRoutes.some((route) => path.startsWith(route))

  if (isProtected) {
    // Check for token in cookies or header
    const token =
      request.cookies.get("novacart_token")?.value ||
      request.headers.get("authorization")

    // If no token found, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*"],
}