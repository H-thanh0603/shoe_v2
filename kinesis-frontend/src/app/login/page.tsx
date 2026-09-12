"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginInner() {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/";
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-space-xl px-gutter-mobile">
      <p className="font-label-micro text-label-micro uppercase tracking-widest text-secondary">
        KINESIS / ATELIER
      </p>
      <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
        Syndicate Access
      </h1>
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="bg-primary-container px-space-xl py-space-md font-label-technical text-label-technical font-bold uppercase tracking-widest text-on-primary-container transition-colors hover:bg-primary hover:text-on-secondary"
      >
        Đăng nhập bằng Google
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
