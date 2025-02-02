import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { verify } from "jsonwebtoken"

const ADMIN_ROLE = 1
const USER_ROLE = 2

// Helper function to clear auth cookies
const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
  return response
}

const authRoutes = ["/signin", "/signup", "/forgot-password", "/update-password"]

export async function middleware(request: NextRequest) {
  if (!process.env.JWT_SECRET_KEY) {
    return NextResponse.json({ error: "JWT secret key is not set." }, { status: 500 })
  }
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("token")?.value
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

  console.log("🚀 Middleware processing:", pathname)

  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth/:path*") ||
    pathname.startsWith("/workbox-") ||
    pathname.startsWith("/worker-") ||
    pathname.startsWith("/fallback-") ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/model") ||
    pathname.startsWith("/icon-") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/public/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm|wav|mp3|pdf|doc|docx|txt)$/) ||
    (!token && authRoutes.includes(pathname))
  ) {
    return NextResponse.next()
  }

  try {
    if (token) {
      const { payload } = await jwtVerify(token, secret)
      const { role } = payload

      if (pathname === "/signin" || pathname === "/signup" || pathname === "/verify") {
        return role === ADMIN_ROLE
          ? NextResponse.redirect(new URL("/admin", request.url))
          : NextResponse.redirect(new URL("/user", request.url))
      }

      if (pathname.startsWith("/admin") && role !== ADMIN_ROLE) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      if (pathname.startsWith("/user") && role !== USER_ROLE && role !== ADMIN_ROLE) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      if (pathname.startsWith("/api/admin") && role !== ADMIN_ROLE) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      if (pathname.startsWith("/api/user") && role !== USER_ROLE && role !== ADMIN_ROLE) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (pathname === "/verify") {
        const tokenParam = request.nextUrl.searchParams.get("token");
        if (!tokenParam) {
          return NextResponse.redirect(new URL("/signin", request.url))
        }
        const { payload } = await jwtVerify(tokenParam, secret)
        console.log("token:",payload)
        return NextResponse.next()
      }
      if (!authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/signin", request.url))
      }
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    const response = NextResponse.redirect(new URL("/signin?error=" + error, request.url))
    return clearAuthCookies(response)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

