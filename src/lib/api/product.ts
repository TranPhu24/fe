import Cookies from "js-cookie"
import { API_BASE } from "./index"
import {
  CreateProductDto,
  Product,
  ApiResponse,
  UpdateProductDto,
} from "./types"

export async function createProduct(
  dto: CreateProductDto
): Promise<ApiResponse<{ product: Product }>> {
  const accessToken = Cookies.get("access_token")


  if (!dto.image || !(dto.image instanceof File)) {
    return { success: false, message: "Vui lòng chọn hình ảnh sản phẩm" }
  }

  const formData = new FormData()
  formData.append("name", dto.name.trim())
  formData.append("price", dto.price.toString())
  if (dto.description?.trim()) formData.append("description", dto.description.trim())
  formData.append("category", dto.category)
  formData.append("stock", dto.stock.toString())
  formData.append("image", dto.image, dto.image.name) 

  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Tạo sản phẩm thất bại",
    }
  }

  return {
    success: true,
    message: data.message || "Tạo sản phẩm thành công",
    data: { product: data.product || data.data?.product },
  }
}

export async function getProducts(): Promise<
  ApiResponse<{ products: Product[] }>
> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/products`, {
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
      message: data.message || "Không thể lấy danh sách sản phẩm",
    }
  }

  return {
    success: true,
    message: "Lấy danh sách sản phẩm thành công",
    data: {
      products: data.products || data.data?.products || [],
    },
  }
}
export async function getProduct(
  id: string
): Promise<ApiResponse<{ product: Product }>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
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
      message: data.message || "Không thể lấy sản phẩm",
    }
  }

  return {
    success: true,
    message: "Lấy sản phẩm thành công",
    data: {
      product: data.product || data.data?.product,
    },
  }
}


export async function updateProduct(
  id: string,
  dto: UpdateProductDto
): Promise<ApiResponse<{ product: Product }>> {
  const accessToken = Cookies.get("access_token")

  const formData = new FormData()
  let isMultipart = false

  if (dto.name !== undefined) formData.append("name", dto.name.trim())
  if (dto.price !== undefined) formData.append("price", dto.price.toString())
  if (dto.description !== undefined)
    formData.append("description", dto.description.trim() || "")
  if (dto.category !== undefined) formData.append("category", dto.category)
  if (dto.stock !== undefined) formData.append("stock", dto.stock.toString())

  if (dto.image instanceof File) {
    formData.append("image", dto.image, dto.image.name)
    isMultipart = true
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  }

  const body = isMultipart ? formData : JSON.stringify(dto)

  if (!isMultipart) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PATCH",
    headers,
    body,
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Cập nhật sản phẩm thất bại",
    }
  }

  return {
    success: true,
    message: data.message|| "Cập nhật sản phẩm thành công",
    data: { product: data.product },
  }
}



export async function deleteProduct(
  id: string
): Promise<ApiResponse<null>> {
  const accessToken = Cookies.get("access_token")

  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message|| "Xóa sản phẩm thất bại",
    }
  }
  return {
    success: true,
    message: data.message|| "Xóa sản phẩm thành công",
    data: null,
  }
}