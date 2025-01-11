import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_ROLE = 1;
const USER_ROLE = 2;

// Helper function to clear auth cookies
const clearAuthCookies = (response: NextResponse) => {
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
    });
    return response;
};

export async function middleware(request: NextRequest) {
    if (!process.env.JWT_SECRET_KEY) {
        return NextResponse.json({ error: 'JWT secret key is not set.' }, { status: 500 });
    }

    const token = request.cookies.get('token')?.value;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    if (request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/api/auth/:path*') ||
        request.nextUrl.pathname === '/manifest.json' || 
        request.nextUrl.pathname === '/sw.js' || 
        request.nextUrl.pathname.startsWith('/sw/') ||
        request.nextUrl.pathname.startsWith('/workbox-') ||
        (!token && request.nextUrl.pathname === '/signin') ||
        (!token && request.nextUrl.pathname === '/signup') ||
        (!token && request.nextUrl.pathname === '/verify') ||
        (!token && request.nextUrl.pathname === '/forgot-password') ||
        (!token && request.nextUrl.pathname === '/update-password')){
        return NextResponse.next();
    }

    try {
        if (token) {
            const { payload } = await jwtVerify(token, secret);
            const { role } = payload;

            if (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup') {
                return role === ADMIN_ROLE
                    ? NextResponse.redirect(new URL('/admin', request.url))
                    : NextResponse.redirect(new URL('/user', request.url));
            }

            if (request.nextUrl.pathname.startsWith('/admin') && role !== ADMIN_ROLE) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
            if (request.nextUrl.pathname.startsWith('/user') && (role !== USER_ROLE && role !== ADMIN_ROLE)) {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }

            if (request.nextUrl.pathname.startsWith('/api/admin') && role !== ADMIN_ROLE) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
            if (request.nextUrl.pathname.startsWith('/api/user') && (role !== USER_ROLE && role !== ADMIN_ROLE)) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
        } else {
            if (request.nextUrl.pathname.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        const response = NextResponse.redirect(new URL('/signin?error='+error, request.url));
        return clearAuthCookies(response);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ],
};