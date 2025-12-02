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
import { useState } from "react"
import { sendResetPasswordApi } from "@/lib/api/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ResetPasswordWithCodeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()


   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      await sendResetPasswordApi({
        username,
        email,
        password: newPassword,
        otp: Number(otp),
      })
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
      router.push("/auth/login")
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Đặt lại mật khẩu thất bại!")
      } else {
        toast.error("Đặt lại mật khẩu thất bại!")
      }
    } finally {
      setLoading(false)
    }
  }

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
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
