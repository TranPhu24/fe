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

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card >
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Nhập thông tin của bạn để tạo tài khoản mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form>
            <div className="grid gap-4">
              {/* Họ và tên */}
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="bhi@example.com"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Nút Đăng ký */}
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium"
              >
                Đăng ký
              </Button>
            </div>

            {/* Link quay lại đăng nhập */}
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <a href="login" className="underline underline more-underline-offset-4 text-red-500">
                Đăng nhập ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}