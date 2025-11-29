"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { loginApi } from "@/lib/api/user";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const result = await loginApi(email, password, router);

        if (!result.success) {
          toast.error(result.message || "Đăng nhập thất bại");
          return;
        }
        toast.success("Đăng nhập thành công!");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại!";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu để tiếp tục.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="./forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline text-red-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>


              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Không có tài khoản?{" "}
              <a href="./register" className="underline underline-offset-4 text-red-500">
                Đăng ký
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
