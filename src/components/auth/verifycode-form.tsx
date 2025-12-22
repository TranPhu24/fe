"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ResetPasswordWithCode } from "@/hooks/auth/useVerifycode"  

export function ResetPasswordWithCodeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    emailError,
    passwordError,
    setEmailError,
    setPasswordError,
    validateEmail,
    validatePassword,
    handleSubmit,
  } = ResetPasswordWithCode();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập mã xác nhận, thông tin tài khoản và mật khẩu mới
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
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otp">Mã xác nhận (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã xác nhận"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));
                  }}
                />
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => {setConfirmPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                  }}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <Button type="submit" className="w-full  bg-red-500 hover:bg-red-600" disabled={loading}>
                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Gửi lại mã
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
