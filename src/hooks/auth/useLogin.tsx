"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi, } from "@/lib/api/auth";


export function useLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) {
      toast.error("Vui lòng kiểm tra thông tin!");
      return;
    }

    setLoading(true);

    try {
      const result = await loginApi(email, password, router);

      if (!result.success) {
        toast.error(result.message || "Đăng nhập thất bại");
        return;
      }

      toast.success("Đăng nhập thành công!");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/google`;
  };


  return {
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
    handleGoogleLogin
  };
}
