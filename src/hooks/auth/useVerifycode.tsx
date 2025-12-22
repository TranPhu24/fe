"use client"
import { useState } from "react"
import { sendResetPasswordApi } from "@/lib/api/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export function ResetPasswordWithCode() {
const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

    const validateEmail = (value: string) => {
    if (!value) return "Email không được để trống";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Mật khẩu không được để trống";
    if (value.length < 6) return "Mật khẩu phải ít nhất 6 ký tự";
    return "";
  };
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = validateEmail(email);
    const passErr = validatePassword(newPassword);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) {
      toast.error("Vui lòng kiểm tra thông tin!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      await sendResetPasswordApi({
        email,
        password: newPassword,
        otp: Number(otp),
      })
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
      router.push("/auth/login")
    } catch (err: unknown) {
      const message =err instanceof Error? err.message: "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setLoading(false)
    }
  }
    return {
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
  }

}