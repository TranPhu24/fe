"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerApi } from "@/lib/api/auth";

export function useRegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateName = (value: string) => {
    if (!value.trim()) return "Tên không được để trống";
    return "";
  };

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

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Vui lòng nhập lại mật khẩu";
    if (value !== password) return "Mật khẩu không khớp";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);

    if (nameErr || emailErr || passErr || confirmErr) {
      toast.error("Vui lòng kiểm tra thông tin!");
      return;
    }

    setLoading(true);

    try {
      const result = await registerApi({
        username: name,
        email,
        password,
      });

      if (!result.success) {
        toast.error(result.message || "Đăng ký thất bại!");
        return;
      }

      toast.success(result.message || "Đăng ký thành công!");
      router.push("/auth/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
    return {
    name,
    email,
    password, 
    confirmPassword,
    loading,
    nameError,
    emailError,
    passwordError,
    confirmPasswordError,
    setPasswordError,
    setConfirmPasswordError,
    setNameError,
    setEmailError,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    handleSubmit,
  };
}