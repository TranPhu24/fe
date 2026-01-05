import Cookies from "js-cookie";
import { API_BASE } from "./index";
import { ApiResponse, Order, ShippingAddress } from "./types";


export async function createOrder(
  paymentMethod: string,
  newAddress: ShippingAddress & { saveAddress?: boolean },
  note?: string
): Promise<ApiResponse<{ order: Order }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentMethod, newAddress, note }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Tạo đơn hàng thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Tạo đơn hàng thành công",
    data: {
      order: data.order || data.data?.order,
    },
  };
}


export async function getMyOrders(
): Promise<ApiResponse<{ orders: Order[] }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: "Đơn hàng trống.",
    };
  }

  return {
    success: true,
    message: data.message || "Lấy danh sách đơn hàng thành công",
    data: {
      orders: data.orders || data.data?.orders || [],
    },
  };
}


export async function getOrderById(
  id: string
): Promise<ApiResponse<{ order: Order }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy chi tiết đơn hàng",
    };
  }

  return {
    success: true,
    message: data.message || "Lấy chi tiết đơn hàng thành công",
    data: {
      order: data.order || data.data?.order,
    },
  };
}


export async function cancelOrder(
  id: string,
  reason: string
): Promise<ApiResponse<{ order: Order }>> {
  const accessToken = Cookies.get("access_token");

  if (!accessToken) {
    return {
      success: false,
      message: "Chưa đăng nhập",
    };
  }

  const res = await fetch(`${API_BASE}/api/orders/${id}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Huỷ đơn thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Huỷ đơn hàng thành công",
    data: {
      order: data.order || data.data?.order,
    },
  };
}

export async function getAllOrders(): Promise<
  ApiResponse<{ orders: Order[] }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy danh sách đơn hàng",
    };
  }

  return {
    success: true,
    message: data.message || "Lấy danh sách đơn hàng thành công",
    data: {
      orders: data.orders || data.data?.orders || [],
    },
  };
}


export async function updateOrderStatus(
  id: string,
  status: string
): Promise<ApiResponse<{ order: Order }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Cập nhật trạng thái đơn thất bại",
    };
  }

  return {
    success: true,
    message: data.message || "Cập nhật trạng thái đơn thành công",
    data: {
      order: data.order || data.data?.order,
    },
  };
}


export async function createVNPayPayment(
  orderId: string
): Promise<ApiResponse<{ paymentUrl: string }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/payment/vnpay/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể tạo thanh toán VNPay",
    };
  }

  return {
    success: true,
    message: "Tạo URL VNPay thành công",
    data: {
      paymentUrl: data.paymentUrl,
    },
  };
}