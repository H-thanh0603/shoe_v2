import type { Metadata } from "next";
import { Suspense } from "react";
import TrackClient from "./TrackClient";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng | KINESIS",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackClient />
    </Suspense>
  );
}
