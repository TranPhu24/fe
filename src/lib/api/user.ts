import Cookies from "js-cookie";
import { API_BASE} from "./index";
import type { ApiResponse, User } from "./types";
export async function getMe(): Promise<
  ApiResponse<{ user: User }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy thông tin người dùng",
    };
  }
  return {
    success: true,
    message: data.message || "Lấy thông tin người dùng thành công",
    data: {
      user: data.user || data.data?.user,
    },
  };
}
