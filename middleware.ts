import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Allow root
    if (path === "/") return NextResponse.next();

    // Get API key
    const apiKey = request.headers.get("x-api-key");

    // Everything allowed for admin with apiKey
    if (apiKey === process.env.API_KEY) return NextResponse.next();

    if (path.startsWith("/api/image") && request.method === "GET") {
        return NextResponse.next();
    }

    if (path.startsWith("/api"))
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    console.log("Not Allowed. Redirecting.");
    return NextResponse.redirect(new URL("/", request.url));
}

// For any path except those below, go through the above middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - about
         * - public
         */
        "/((?!_next/static|_next/image|favicon.ico|about|icons|images|sitemap.xml).*)",
    ],
};
