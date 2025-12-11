import Cookies from "js-cookie"
import { API_BASE } from "./index"
import { ApiResponse, Cart } from "./types"

export async function addToCart(
  productId: string,
  quantity = 1
): Promise<ApiResponse<{ cart: Cart }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Thêm sản phẩm vào giỏ thất bại",
    }
  }

  return {
    success: true,
    message: data.message || "Thêm vào giỏ hàng thành công",
    data: {
      cart: data.cart || data.data?.cart,
    },
  }
}


export async function getCart(): Promise<ApiResponse<{ cart: Cart | null }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy giỏ hàng",
    }
  }

  return {
    success: true,
    message: data.message || "Lấy giỏ hàng thành công",
    data: {
      cart: data.cart ?? data.data?.cart ?? null,
    },
  }
}


export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<ApiResponse<{ cart: Cart }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity }),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Cập nhật giỏ hàng thất bại",
    }
  }

  return {
    success: true,
    message: data.message || "Cập nhật giỏ hàng thành công",
    data: {
      cart: data.cart || data.data?.cart,
    },
  }
}


export async function removeCartItem(
  productId: string
): Promise<ApiResponse<{ cart: Cart }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Xoá sản phẩm khỏi giỏ thất bại",
    }
  }

  return {
    success: true,
    message: data.message || "Xoá sản phẩm khỏi giỏ thành công",
    data: {
      cart: data.cart || data.data?.cart,
    },
  }
}


export async function clearCart(): Promise<ApiResponse<{ cart: Cart }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Xoá giỏ hàng thất bại",
    }
  }

  return {
    success: true,
    message: data.message || "Xoá giỏ hàng thành công",
    data: {
      cart: data.cart || data.data?.cart,
    },
  }
}