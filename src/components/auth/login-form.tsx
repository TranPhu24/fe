"use client";
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
import Link from "next/link";
import { useLoginForm } from "@/hooks/auth/useLogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    email,
    password,
    loading,
    emailError,
    passwordError,
    setEmail,
    setPassword,
    setEmailError,
    setPasswordError,
    validateEmail,
    validatePassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu để tiếp tục.
          </CardDescription>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(validateEmail(e.target.value));
                  }}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="./forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline text-red-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
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
              <Link
                href="./register"
                className="underline underline-offset-4 text-red-500"
              >
                Đăng ký
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
