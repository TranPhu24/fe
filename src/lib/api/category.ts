import { CreateCategoryDto, Category, UpdateCategoryDto, ApiResponse } from "./types";
import { API_BASE } from "./index";
import Cookies from "js-cookie";
export async function createCategory(
  dto: CreateCategoryDto
): Promise<ApiResponse<{ category: Category }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message ?? "Tạo danh mục thất bại" };
  }

  return {
    success: true,
    message: data.message ?? "Tạo danh mục thành công",
    data: { category: data.category },
  };
}
export async function getAllCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message ?? "Lấy danh sách thất bại" };
  }

  return {
    success: true,
    message: data.message ?? "Lấy danh sách thành công",
    data: { categories: data as Category[] }
  };
}

export async function updateCategory(
  id: string,
  dto: UpdateCategoryDto
): Promise<ApiResponse<{ category: Category }>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message ?? "Cập nhật thất bại" };
  }

  return {
    success: true,
    message: data.message ?? "Cập nhật thành công",
    data: { category: data.category },
  };
}
export async function deleteCategory(
  id: string
): Promise<ApiResponse<void>> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message ?? "Xoá thất bại" };
  }

  return {
    success: true,
    message: data.message ?? "Xoá danh mục thành công",
    data: undefined,
  };
}
