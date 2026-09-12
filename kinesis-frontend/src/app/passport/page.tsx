import type { Metadata } from "next";
import PassportClient from "./PassportClient";

export const metadata: Metadata = {
  title: "Hộ chiếu số K-09 | KINESIS",
};

export default function PassportPage() {
  return <PassportClient />;
}
