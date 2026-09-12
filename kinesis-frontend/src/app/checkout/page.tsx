import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Cart & Checkout Protocol | KINESIS",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
