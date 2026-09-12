import { auth } from "@/lib/auth";
import { sweepStalePending } from "@/lib/shop-orders";

/* POST /api/admin/sweep — expire stale pending orders (cron: hit this daily).
   Public secret variant: header x-cron-secret matches CRON_SECRET when set,
   so Vercel Cron can call without a session. */
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const header = request.headers.get("x-cron-secret");
  const isCron = cronSecret ? header === cronSecret : false;

  if (!isCron) {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return Response.json({ error: "forbidden" }, { status: 403 });
    }
  }

  const expired = await sweepStalePending();
  return Response.json({ ok: true, expired });
}
