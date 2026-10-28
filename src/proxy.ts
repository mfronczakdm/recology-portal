import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "recology_session";

/**
 * Route protection for the signed-in portal.
 * Next.js 16 renamed middleware.ts to proxy.ts; this is that gate.
 * `/dashboard` and everything under it require the fake session cookie.
 */
export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
