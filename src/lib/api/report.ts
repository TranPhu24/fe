import Cookies from "js-cookie";
import { ApiResponse, RevenueType, RawRevenueItem } from "./types";
import { API_BASE } from "./index";

export async function getRevenueReport(
  type: RevenueType
): Promise<ApiResponse<RawRevenueItem[]>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(
    `${API_BASE}/api/admin/reports/revenue?type=${type}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy báo cáo doanh thu",
    };
  }

  return {
    success: true,
    message: "Lấy báo cáo doanh thu thành công",
    data: data.data,
  };
}
