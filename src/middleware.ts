import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ROLES = {
    ADMIN: 1,
    USER: 2,
} as const;

type Role = typeof ROLES[keyof typeof ROLES];

const PATTERNS = {
    PUBLIC: [
        "/signin",
        "/signup",
        "/verify",
        "/forgot-password",
        "/update-password",
        "/unauthorized",
    ],
    STATIC_FILES: /\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|webm|wav|mp3|pdf|doc|docx|txt|js|json)$/,
    API: {
        AUTH: "/api/auth",
        ADMIN: "/api/admin",
        USER: "/api/user",
    },
    PROTECTED: {
        ADMIN: "/admin",
        USER: "/user",
    },
} as const;

// Helper function to identify Serwist requests
const isSerwistRequest = (request: NextRequest): boolean => {
    const userAgent = request.headers.get('user-agent') || '';
    const isSerwistUserAgent = userAgent.includes('ServiceWorker') || 
                              userAgent.includes('serwist') || 
                              userAgent.includes('workbox');
                              
    const serwistPaths = [
        '/sw.js',
        '/serwist-sw.js',
        '/workbox-',
        '/serwist-',
        '/manifest.json',
        '/icon-',
    ];

    return isSerwistUserAgent || 
           serwistPaths.some(path => request.nextUrl.pathname.startsWith(path));
};

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

const matchesPattern = (path: string, patterns: readonly string[]): boolean => {
    return patterns.some(pattern => path.startsWith(pattern));
};

const isStaticFile = (path: string): boolean => {
    return PATTERNS.STATIC_FILES.test(path);
};

const handleUnauthorized = (request: NextRequest, isApi: boolean) => {
    return isApi
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/signin", request.url));
};

export async function middleware(request: NextRequest) {
    // Check for JWT secret key
    if (!process.env.JWT_SECRET_KEY) {
        console.error("JWT secret key is not configured");
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

    const pathname = request.nextUrl.pathname;

    // Allow all Serwist requests to pass through
    if (isSerwistRequest(request)) {
        console.log("🤖 Serwist request detected:", pathname);
        return NextResponse.next();
    }

    console.log("👤 User request:", pathname);

    const token = request.cookies.get("token")?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // Allow static files and public paths
    if (
        pathname === "/" ||
        isStaticFile(pathname) ||
        pathname.startsWith('/_next')
    ) {
        return NextResponse.next();
    }

    // Allow public auth routes for non-authenticated users
    if (!token && matchesPattern(pathname, PATTERNS.PUBLIC)) {
        return NextResponse.next();
    }

    // Handle authentication and authorization for user requests
    try {
        if (!token) {
            const isApi = pathname.startsWith("/api/");
            return handleUnauthorized(request, isApi);
        }

        // Verify token and extract role
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role as Role;

        // Handle authenticated user navigation to auth pages
        if (pathname === "/signin" || pathname === "/signup") {
            const redirectPath = role === ROLES.ADMIN ? "/admin" : "/user";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // Handle admin routes
        if (pathname.startsWith(PATTERNS.PROTECTED.ADMIN) && role !== ROLES.ADMIN) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Handle user routes
        if (
            pathname.startsWith(PATTERNS.PROTECTED.USER) &&
            role !== ROLES.USER &&
            role !== ROLES.ADMIN
        ) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        // Handle admin API routes
        if (pathname.startsWith(PATTERNS.API.ADMIN) && role !== ROLES.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Handle user API routes
        if (
            pathname.startsWith(PATTERNS.API.USER) &&
            role !== ROLES.USER &&
            role !== ROLES.ADMIN
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Allow auth API routes
        if (pathname.startsWith(PATTERNS.API.AUTH)) {
            return NextResponse.next();
        }

    } catch (error) {
        console.error("Token verification failed:", error);
        const response = NextResponse.redirect(
            new URL(`/signin?error=${encodeURIComponent(String(error))}`, request.url)
        );
        return clearAuthCookies(response);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_static|_vercel).*)",
    ],
};