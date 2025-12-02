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
import { sendOTP } from "@/lib/api/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendOTP(email)
      toast.success("Mã xác nhận đã được gửi đến email của bạn!")

      router.push("/auth/verify-code")
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Yêu cầu đặt lại mật khẩu thất bại!")
      } else {
        toast.error("Yêu cầu đặt lại mật khẩu thất bại!")
      }
    } finally {
      setLoading(false)
    }
  }

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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
