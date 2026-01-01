import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import rateLimit from './lib/rate-limit'

// Initialize rate limiter
// 10 requests per minute per IP
const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function middleware(request: NextRequest) {
    // Only apply to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'

        try {
            await limiter.check(null, 20, ip) // Limit 20 requests per minute
            return NextResponse.next()
        } catch {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Too many rejections requested. Take a breath.' },
                { status: 429 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
