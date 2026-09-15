import Link from "next/link";

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string; code?: string }>;
}) {
  const { order, status, code } = await searchParams;
  const success = status === "success";
  const cod = status === "cod";
  const retry = status === "retry";
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-gutter-mobile py-space-4xl text-center">
      <span
        className={`grid size-16 place-items-center ${success || cod ? "bg-primary-container text-on-primary-container" : retry ? "border border-surface-container-highest text-secondary" : "bg-error-container text-on-error-container"}`}
      >
        <span className="material-symbols-outlined text-3xl">
          {success || cod ? "verified" : retry ? "hourglass_top" : "error"}
        </span>
      </span>
      <p className="mt-space-lg font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        {success ? "PAYMENT CONFIRMED" : cod ? "ORDER PLACED" : retry ? "PAYMENT UNCLEAR" : "PAYMENT FAILED"}
      </p>
      <h1 className="mt-space-xs font-headline-md text-headline-md uppercase tracking-tight text-primary">
        {success
          ? "Cảm ơn — thanh toán thành công"
          : cod
            ? "Đơn hàng đã được ghi nhận"
            : retry
              ? "Hệ thống đang bận — đừng thanh toán lại"
              : `Thanh toán không thành công${code ? ` (mã ${code})` : ""}`}
      </h1>
      {retry && (
        <p className="mt-space-sm max-w-md font-body-md text-body-md text-secondary">
          Kết quả thanh toán chưa xác định (lỗi hệ thống tạm thời). Vui lòng chờ vài phút rồi
          kiểm tra lại — thanh toán lại có thể bị trừ tiền 2 lần.
        </p>
      )}
      {order && (
        <p className="mt-space-sm max-w-md font-body-md text-body-md text-secondary">
          Mã đơn hàng{" "}
          <span className="font-label-technical text-primary-container">{order}</span>.
          {success && " Xác nhận qua email sẽ đến trong ít phút."}
          {cod && " Shop sẽ gọi xác nhận trước khi giao hàng."}
        </p>
      )}
      <div className="mt-space-lg flex gap-space-sm">
        <Link
          href="/gallery"
          className="border border-surface-container-highest px-space-lg py-space-md font-label-technical text-label-technical uppercase tracking-widest text-secondary transition-colors hover:border-primary-container hover:text-primary-container"
        >
          TIẾP TỤC MUA SẮM
        </Link>
        <Link
          href="/vault"
          className="bg-primary-container px-space-lg py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
        >
          VÀO SYNDICATE VAULT →
        </Link>
      </div>
    </div>
  );
}
