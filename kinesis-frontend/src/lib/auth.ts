import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { User } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "user" | "admin";
  }
}

declare module "next-auth" {
  interface Session {
    user: User & { id?: string; role?: "user" | "admin" };
  }
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.sub) {
        token.sub = String(profile.sub);
        token.role = ADMIN_EMAILS.includes(String(profile.email).toLowerCase()) ? "admin" : "user";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
  },
});
