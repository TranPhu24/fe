export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { GoogleCallbackPage } from "@/app/auth/google/callback/google";

export default function Page() {
  return (
    <Suspense fallback={<div>Đang đăng nhập...</div>}>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <GoogleCallbackPage />
        </div>
      </div>
    </Suspense>
  );
}
