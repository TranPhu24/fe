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
import { useForgotPasswordForm } from "@/hooks/auth/useForgotpass"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    email,
    loading,
    emailError,
    setEmail,
    setEmailError,
    validateEmail,
    handleSubmit,
  } = useForgotPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email để nhận mã xác nhận
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
              <Button type="submit" className="w-full  bg-red-500 hover:bg-red-600" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Trở về đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
