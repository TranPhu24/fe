"use client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sendOTP } from "@/lib/api/auth"
import { useState } from "react"
export function useForgotPasswordForm() {
    const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [emailError, setEmailError] = useState("");

    const validateEmail = (value: string) => {
    if (!value) return "Email không được để trống";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Email không hợp lệ";
    return "";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailErr = validateEmail(email);
    setEmailError(emailErr);
    if (emailErr ) {
      toast.error("Vui lòng kiểm tra thông tin!");
      return;
    }
    setLoading(true)
    try {
      const result = await sendOTP({email})
        if (!result.success) {
        toast.error(result.message || "Gửi mã OTP thất bại!");
        return;
      }
      toast.success("Mã xác nhận đã được gửi đến email của bạn!")
      router.push("/auth/verify-code")
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
    loading,    
    emailError,
    setEmailError,
    validateEmail,
    handleSubmit,
  }

}