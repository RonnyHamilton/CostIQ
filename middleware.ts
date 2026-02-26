import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Read the Supabase session token directly from cookies
    // This avoids using @supabase/ssr which bundles Node.js-only modules
    // incompatible with the Vercel Edge Runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Extract the access token from the Supabase auth cookie
    // Supabase stores the session in a cookie named `sb-<project-ref>-auth-token`
    const cookieName = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`
    const authCookie = request.cookies.get(cookieName)?.value

    let isAuthenticated = false

    if (authCookie) {
        try {
            const session = JSON.parse(authCookie)
            const accessToken = Array.isArray(session) ? session[0] : session?.access_token

            if (accessToken) {
                // Verify the token is not expired by checking exp claim in JWT payload
                // Use atob() — Buffer is not available in the Edge Runtime
                // JWT uses base64url (no padding), so we must pad it for atob()
                const base64Url = accessToken.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
                const payload = JSON.parse(atob(padded))
                isAuthenticated = payload.exp * 1000 > Date.now()
            }
        } catch {
            isAuthenticated = false
        }
    }

    const { pathname } = request.nextUrl
    const isPublicPath =
        pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth')

    if (!isAuthenticated && !isPublicPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

