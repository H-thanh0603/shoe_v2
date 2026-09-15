import { auth } from "@/lib/auth";
import { sweepStalePending } from "@/lib/shop-orders";

/* /api/admin/sweep — expire stale pending orders.
   Vercel Cron calls GET with `Authorization: Bearer $CRON_SECRET`.
   Legacy header x-cron-secret still accepted. Admin session also allowed. */
async function isAuthorized(request: Request): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authz = request.headers.get("authorization") ?? "";
    if (authz === `Bearer ${cronSecret}`) return true;
    if (request.headers.get("x-cron-secret") === cronSecret) return true;
  }
  const session = await auth();
  return session?.user?.role === "admin";
}

async function handleSweep(request: Request) {
  if (!(await isAuthorized(request))) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const expired = await sweepStalePending();
  return Response.json({ ok: true, expired });
}

export async function GET(request: Request) {
  return handleSweep(request);
}

export async function POST(request: Request) {
  return handleSweep(request);
}
