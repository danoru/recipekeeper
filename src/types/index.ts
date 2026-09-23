export interface User {
  id: string;
  username: string;
  /** "ADMIN" | "PATRON" | "USER" — for UI only; the server re-checks the database. */
  badge?: string;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
