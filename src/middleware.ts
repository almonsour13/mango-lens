import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getUser } from "./stores/user-store";

const ADMIN_ROLE = 1;
const USER_ROLE = 2;

// Helper function to clear auth cookies
const clearAuthCookies = (response: NextResponse) => {
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });
    return response;
};

const authRoutes = [
    "/signin",
    "/signup",
    "/verify",
    "/forgot-password",
    "/update-password",
];
export async function middleware(request: NextRequest) {
    if (!process.env.JWT_SECRET_KEY) {
        return NextResponse.json(
            { error: "JWT secret key is not set." },
            { status: 500 }
        );
    }
    const pathname = request.nextUrl.pathname;
    console.log(pathname)
    const token = request.cookies.get("token")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    console.log("🚀 Middleware processing:", pathname);

    // if (
    //     pathname === "/" ||
    //     pathname.startsWith("/api/auth/:path*") ||
    //     pathname.startsWith("/workbox-") ||
    //     pathname.startsWith("/worker-") ||
    //     pathname.startsWith("/fallback-") ||
    //     pathname.startsWith("/sw.js") ||
    //     pathname.startsWith("/manifest.json") ||
    //     pathname.startsWith("/icon-") ||
    //     pathname.startsWith("/_next") ||
    //     pathname.startsWith("/images/") ||
    //     pathname.startsWith("/public/") ||
    //     pathname.match(
    //         /\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm|wav|mp3|pdf|doc|docx|txt)$/
    //     ) ||
    //     (!token && authRoutes.includes(pathname))
    // ) {
    //     return NextResponse.next();
    // }
    if(token){
        if (pathname === "/signin" || pathname === "/signup") {
            return NextResponse.redirect(new URL("/user", request.url));
        }
    }
    // try {
    //     if (token) {
    //         const { payload } = await jwtVerify(token, secret);
    //         const { role } = payload;

    //         if (pathname === "/signin" || pathname === "/signup") {
    //             return role === ADMIN_ROLE
    //                 ? NextResponse.redirect(new URL("/admin", request.url))
    //                 : NextResponse.redirect(new URL("/user", request.url));
    //         }

    //         if (pathname.startsWith("/admin") && role !== ADMIN_ROLE) {
    //             return NextResponse.redirect(
    //                 new URL("/unauthorized", request.url)
    //             );
    //         }

    //         if (
    //             pathname.startsWith("/user") &&
    //             role !== USER_ROLE &&
    //             role !== ADMIN_ROLE
    //         ) {
    //             return NextResponse.redirect(
    //                 new URL("/unauthorized", request.url)
    //             );
    //         }

    //         if (pathname.startsWith("/api/admin") && role !== ADMIN_ROLE) {
    //             return NextResponse.json(
    //                 { error: "Unauthorized" },
    //                 { status: 403 }
    //             );
    //         }

    //         if (
    //             pathname.startsWith("/api/user") &&
    //             role !== USER_ROLE &&
    //             role !== ADMIN_ROLE
    //         ) {
    //             return NextResponse.json(
    //                 { error: "Unauthorized" },
    //                 { status: 403 }
    //             );
    //         }
    //     } else {
    //         if (pathname.startsWith("/api/")) {
    //             return NextResponse.json(
    //                 { error: "Unauthorized" },
    //                 { status: 401 }
    //             );
    //         }
    //         return NextResponse.redirect(new URL("/signin", request.url));
    //     }
    // } catch (error) {
    //     console.error("Token verification failed:", error);
    //     const response = NextResponse.redirect(
    //         new URL("/signin?error=" + error, request.url)
    //     );
    //     return clearAuthCookies(response);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // '/((?!api|_next/static|_next/image|favicon.ico).*)',
        // "/((?!api/auth|_next|static|sw\\.js|manifest\\.json|icon-[0-9]+|images).*)",
        "/",
    ],
};
