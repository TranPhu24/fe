import Cookies from "js-cookie";
import { API_BASE } from "./index";
import { ApiResponse,
    ApplyDiscountResponse,
    Discount,
    CreateDiscountDTO
 } from "./types";

export async function applyDiscount(
  code: string
): Promise<ApiResponse<ApplyDiscountResponse>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/discounts/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Áp dụng mã giảm giá thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Áp dụng mã giảm giá thành công",
    data: data.data,
  };
}


export async function createDiscount(
  payload: CreateDiscountDTO
): Promise<ApiResponse<{ discount: Discount }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/discounts`, {
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
      message: data.message || "Tạo mã giảm giá thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Tạo mã giảm giá thành công",
    data: {
      discount: data.discount || data.data?.discount,
    },
  };
}

export async function getAllDiscounts(): Promise<
  ApiResponse<{ discounts: Discount[] }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/discounts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Lấy danh sách mã giảm giá thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Lấy danh sách mã giảm giá thành công",
    data: {
      discounts: data.discounts || data.data?.discounts || [],
    },
  };
}

export async function removeDiscount(): Promise<
ApiResponse<null>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/discounts/remove`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Huỷ mã giảm giá thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Đã huỷ mã giảm giá",
    data: null,
  };
}
