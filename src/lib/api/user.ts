import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { API_BASE } from "./index";

type DecodedToken = {
  sub: string;
  role: "admin" | "user" | "employee";
  exp: number;
};

// Lưu token + redirect
export function handleLogin(accessToken: string, refreshToken: string, router: AppRouterInstance) {
  const decoded = jwtDecode<DecodedToken>(accessToken);

  const role = decoded.role;
  const userId = decoded.sub;

  Cookies.set("access_token", accessToken, {
    secure: true,
    sameSite: "Strict",
  });

  Cookies.set("refresh_token", refreshToken, {
    secure: true,
    sameSite: "Strict",
  });

  Cookies.set("userId", userId, {
    secure: true,
    sameSite: "Strict",
  });

  // Chuyển trang theo role
  switch (role) {
    case "admin":
      router.push("/dashboard/admin");
      break;
    case "employee":
      router.push("/dashboard/employee");
      break;
    case "user":
      router.push("/dashboard/user");
      break;
    default:
      router.push("/");
  }
}


export async function loginApi(
  email: string,
  password: string,
  router: AppRouterInstance
) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json(); 

  if (!res.ok) {
    return { success: false, message: data.message || "Đăng nhập thất bại" };
  }

  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken;

  handleLogin(accessToken, refreshToken, router);

  return { success: true };
}


export async function registerApi(
  username: string,
  email: string,
  password: string,
  role: "user" | "employee" | "admin" = "user"
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || "Đăng ký thất bại" };
  } else {
    return { success: true, message: data.message || "Đăng ký thành công" };
  }
}