import { auth } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/shop-orders";

/* GET /api/orders/mine — orders of the signed-in user. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }
  const orders = await listOrdersForUser(session.user.id);
  return Response.json({ orders });
}
