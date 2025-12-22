"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRegisterForm } from "@/hooks/auth/useRegister";
export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const {
    name,
    email,
    password,
    confirmPassword,
    loading,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    setName,
    setNameError,
    setEmail,
    setEmailError,
    setPassword,
    setPasswordError,
    setConfirmPassword,
    setConfirmPasswordError,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    handleSubmit
  } = useRegisterForm();

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

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(validateName(e.target.value));
                  }}
                />
                {nameError && (
                  <p className="text-sm text-red-500">{nameError}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="bhi@example.com"
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

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(
                      validateConfirmPassword(e.target.value)
                    );
                  }}
                />
                {confirmPasswordError && (
                  <p className="text-sm text-red-500">{confirmPasswordError}</p>
                )}
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
              <Link
                href="/auth/login"
                className="underline underline-offset-4 text-red-500"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
