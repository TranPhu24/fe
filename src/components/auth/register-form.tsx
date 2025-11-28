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

import { registerApi } from "@/lib/api/user";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const result = await registerApi(name, email, password);

      if (!result.success) {
        toast.error(result.message || "Đăng ký thất bại!");
        return;
      }

      toast.success(result.message || "Đăng ký thành công!");
      router.push("/auth/login");
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
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="bhi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <a
                href="/auth/login"
                className="underline underline-offset-4 text-red-500"
              >
                Đăng nhập ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
