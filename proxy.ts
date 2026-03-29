export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!$|login|register|creators|recipes|members|api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
