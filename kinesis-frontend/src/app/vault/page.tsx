import type { Metadata } from "next";
import VaultClient from "./VaultClient";

export const metadata: Metadata = {
  title: "Syndicate Member Vault | KINESIS",
};

export default function VaultPage() {
  return <VaultClient />;
}
