import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

// ponytail: single-user-session via cookie only; upgrade to DB sessions when multi-device signout needed.
export async function proxy(request: NextRequest) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const res = NextResponse.next();
  res.headers.set("x-user-id", session?.user?.id ?? "");
  res.headers.set("x-user-email", session?.user?.email ?? "");
  res.headers.set("x-user-role", role);
  if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login?callbackUrl=/admin", request.url));
  }
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
