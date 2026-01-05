import Cookies from "js-cookie";
import { API_BASE} from "./index";
import type { ApiResponse, User, Product } from "./types";
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

export async function getFavoriteProducts(): Promise<
  ApiResponse<{ products: Product[] }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/favorite`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy danh sách yêu thích",
    };
  }

  return {
    success: true,
    message: data.message || "Lấy danh sách yêu thích thành công",
    data: {
      products: data.favoriteFoods || data.data?.favoriteFoods,
    },
  };
}

export async function addFavoriteProduct(
  productId: string
): Promise<ApiResponse<null>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Đăng nhập để thêm sản phẩm yêu thích",
    };
  }

  return {
    success: true,
    message: data.message || "Đã thêm sản phẩm vào yêu thích",
    data: null,
  };
}

export async function removeFavoriteProduct(
  productId: string
): Promise<ApiResponse<null>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/favorite/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể xoá sản phẩm yêu thích",
    };
  }

  return {
    success: true,
    message: data.message || "Đã xoá sản phẩm khỏi yêu thích",
    data: null, 
  };
}


