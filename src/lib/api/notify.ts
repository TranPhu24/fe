import Cookies from "js-cookie"
import { API_BASE } from "./index"
import { ApiResponse, CreateNotificationDto, Notification} from "./types"

export async function createNotification(
payload: CreateNotificationDto
): Promise<ApiResponse<{ notification: Notification }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/notifications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Tạo thông báo thất bại",
    };
  }
  return {
    success: true,
    message: data.message || "Tạo thông báo thành công",
    data: {
      notification: data.notification || data.data?.notification,
    },
  };
}

export async function getAllNotifications(
): Promise<ApiResponse<{ notifications: Notification[] }>> {
  const accessToken = Cookies.get("access_token");
    const res = await fetch(`${API_BASE}/api/notifications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`},
  });
    const data = await res.json();
    if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy thông báo",
    };
  }
    return {
    success: true,
    message: data.message || "Lấy thông báo thành công",
    data: { 
        notifications: data.notifications 
        || data.data?.notifications || [] },
  };
}

export async function deleteNotification(
  id: string
): Promise<ApiResponse<null>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể xóa thông báo",
    };
  }

  return {
    success: true,
    message: data.message || "Xóa thông báo thành công",
    data: null,
  };
}