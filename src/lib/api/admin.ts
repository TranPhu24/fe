import { CreateEmployeeDto, Employee, ApiResponse } from "./types";
import { API_BASE } from "./index";
import Cookies from "js-cookie";

export async function createEmployee(
  dto: CreateEmployeeDto
): Promise<ApiResponse<{ user: Employee }>> {

  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,  
    },
    credentials: "include",
    body: JSON.stringify(dto),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Tạo nhân viên thất bại!",
      data: undefined,
    };
  }

  return {
    success: true,
    message: data.message || "Tạo nhân viên thành công!",
    data: { user: data.user },
  };
}

export async function getAllEmployees(): Promise<
  ApiResponse<{ employees: Employee[] }>
> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/employees`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,  
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Không thể lấy danh sách nhân viên",
      data: undefined,
    };
  }

  return {
    success: true,
    message: data.message || "Lấy danh sách nhân viên thành công",
    data: { employees: data.employees },
  };
}



export async function deleteEmployee(id: string): Promise<ApiResponse> {
  const accessToken = Cookies.get("access_token");

  const res = await fetch(`${API_BASE}/api/user/employees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`, 
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Xóa nhân viên thất bại!",
    };
  }

  return {
    success: true,
    message: data.message || "Xóa nhân viên thành công!",
    data: undefined,
  };
}
