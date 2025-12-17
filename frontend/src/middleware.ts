import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Kita pindahkan logic auth ke Client Component (AdminLayout)
    // karena lebih stabil untuk membaca token dari localStorage/cookie di browser

    // Hanya handle redirect user yang sudah login page akses login page
    if (pathname === '/admin/login') {
        const token = request.cookies.get('auth_token')?.value
        if (token) {
            // Jika ada cookie, redirect ke dashboard
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
