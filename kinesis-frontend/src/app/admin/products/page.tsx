import Link from "next/link";
import { auth } from "@/lib/auth";
import { listProductsAdmin } from "@/lib/shop-products";
import ProductTable from "./ProductTable";
import NewProductForm from "./NewProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p className="p-space-xl font-body-md text-body-md text-error">403 — admin only</p>;
  }
  const products = await listProductsAdmin();
  return (
    <div className="mx-auto max-w-6xl px-gutter-mobile py-space-xl">
      <div className="flex flex-wrap items-center gap-space-sm">
        <Link
          href="/admin"
          className="border border-surface-container-highest px-space-md py-space-2xs font-label-technical text-label-technical uppercase tracking-widest text-secondary hover:text-primary"
        >
          ĐƠN HÀNG
        </Link>
        <span className="bg-primary-container px-space-md py-space-2xs font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container">
          SẢN PHẨM
        </span>
      </div>
      <h1 className="mt-space-md font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Quản lý sản phẩm
      </h1>
      <p className="mt-space-2xs font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        {products.length} sản phẩm · giá VND · tồn kho theo size
      </p>
      <div className="mt-space-lg">
        <NewProductForm />
      </div>
      <div className="mt-space-lg">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
