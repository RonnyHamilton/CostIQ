import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isPublicPath =
        pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth')

    if (isPublicPath) {
        return NextResponse.next()
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

        // If env var is missing, fail open rather than crash
        if (!supabaseUrl) {
            return NextResponse.next()
        }

        const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
        const cookieName = `sb-${projectRef}-auth-token`

        // Supabase SSR may chunk the cookie as .0, .1, etc.
        const authCookie =
            request.cookies.get(cookieName)?.value ||
            request.cookies.get(`${cookieName}.0`)?.value

        if (!authCookie) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const session = JSON.parse(authCookie)
        const accessToken = Array.isArray(session) ? session[0] : session?.access_token

        if (!accessToken) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Decode JWT payload — use atob(), Buffer is not available in Edge Runtime
        // JWTs use base64url encoding (no padding, - and _ instead of + and /)
        const base64Url = accessToken.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
        const payload = JSON.parse(atob(padded))

        if (payload.exp * 1000 <= Date.now()) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    } catch {
        // Fail open — never crash the middleware with a 500
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
