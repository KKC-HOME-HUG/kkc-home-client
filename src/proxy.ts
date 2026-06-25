import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 Proxy (formerly "middleware"). Guards the admin area; the real
// login/session is delivered by admin-portal — here we only redirect
// unauthenticated requests to the login page.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("kkc_token")?.value;
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
