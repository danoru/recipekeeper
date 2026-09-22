import { NextRequest, NextResponse } from "next/server";

// next-auth uses the `__Secure-` prefix only when served over HTTPS.
const SESSION_COOKIES = ["__Secure-next-auth.session-token", "next-auth.session-token"];

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings"],
};
