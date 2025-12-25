"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { handleLogin } from "@/lib/api/auth";

export function GoogleCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      toast.error("Đăng nhập Google thất bại");
      router.replace("/login");
      return;
    }

    handleLogin(accessToken, refreshToken, router);
    toast.success("Đăng nhập Google thành công!");
  }, [params, router]);

  return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <div className="flex items-center space-x-4">
    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    
    <p className="text-2xl font-medium text-gray-700">Đang đăng nhập...</p>
  </div>
  
  <div className="mt-4 flex space-x-1">
    <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>
    <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-150"></span>
    <span className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-300"></span>
  </div>
</div>;
}
