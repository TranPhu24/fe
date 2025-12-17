import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { API_BASE } from "./index";

import type {
  ApiResponse,
  RegisterDto,
  SendOTPDto,
  ResetPasswordDto,
  UserRole,
  DecodedToken,
  LoginResponseData,
} from "./types";

export function handleLogin(
  accessToken: string,
  refreshToken: string,
  router: AppRouterInstance
) {
  const decoded = jwtDecode<DecodedToken>(accessToken);

  const role = decoded.role as UserRole;
  const userId = decoded.sub;

  Cookies.set("access_token", accessToken, { secure: true, sameSite: "strict" });
  Cookies.set("refresh_token", refreshToken, { secure: true, sameSite: "strict" });
  Cookies.set("userId", userId, { secure: true, sameSite: "strict" });

  switch (role) {
    case "admin":
      router.push("/dashboard/admin/report");
      break;
    case "employee":
      router.push("/dashboard/employee");
      break;
    case "user":
      router.push("/");
      break;
    default:
      router.push("/");
  }
}

export async function loginApi(
  email: string,
  password: string,
  router: AppRouterInstance
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Đăng nhập thất bại",
    };
  }

  const { accessToken, refreshToken }= data as LoginResponseData;

  handleLogin(accessToken, refreshToken, router);

  return {
    success: true,
    message: data.message|| "Đăng nhập thành công",
    data: undefined,
  };
}

export async function registerApi(
  dto: RegisterDto
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Đăng ký thất bại",
    };
  }
  return {
    success: true,
    message: data.message|| "Đăng ký thành công",
    data: undefined,
  };
}

export async function sendOTP( dto: SendOTPDto): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Gửi mã OTP thất bại!",
    };
  }
  return {
    success: true,
    message: data.message|| "Mã OTP đã được gửi đến email của bạn",
    data: undefined,
  };
}

export async function sendResetPasswordApi(
  dto: ResetPasswordDto
): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Đặt lại mật khẩu thất bại",
    };
  }
  return {
    success: true,
    message: data.message|| "Đặt lại mật khẩu thành công",
    data: undefined,
  };
}