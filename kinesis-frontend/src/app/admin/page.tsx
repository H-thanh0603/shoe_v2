import { auth } from "@/lib/auth";
import { listAllOrders } from "@/lib/shop-orders";
import StatusCell from "./StatusCell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p className="p-space-xl font-body-md text-body-md text-error">403 — admin only</p>;
  }
  const orders = await listAllOrders(200);
  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl">
      <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Quản lý đơn hàng
      </h1>
      <p className="mt-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        {orders.length} đơn gần nhất
      </p>
      <div className="mt-space-lg overflow-x-auto border border-surface-container-highest">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-surface-container-highest font-label-micro text-label-micro uppercase tracking-widest text-secondary">
              <th className="px-space-md py-space-sm">Mã ĐH</th>
              <th className="px-space-md py-space-sm">Khách</th>
              <th className="px-space-md py-space-sm">SĐT</th>
              <th className="px-space-md py-space-sm">Số tiền</th>
              <th className="px-space-md py-space-sm">Trạng thái</th>
              <th className="px-space-md py-space-sm">Ngày</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm text-primary">
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-surface-container-highest/50">
                <td className="px-space-md py-space-sm font-label-technical">{o.id}</td>
                <td className="px-space-md py-space-sm">{o.name}</td>
                <td className="px-space-md py-space-sm">{o.phone}</td>
                <td className="px-space-md py-space-sm font-label-technical">
                  {o.amount_vnd.toLocaleString("vi-VN")} VNĐ
                </td>
                <td className="px-space-md py-space-sm">
                  <StatusCell orderId={o.id} status={o.status} />
                </td>
                <td className="px-space-md py-space-sm">{String(o.created_at).slice(0, 10)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-space-md py-space-lg text-center text-secondary">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
